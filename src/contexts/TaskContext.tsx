"use client"

import { createContext, useContext, useState, useEffect } from 'react'

export interface Task {
  id: number
  title: string
  card_type: 'shinhan' | 'hyundai' | 'samsung' | 'bc' | 'kb' | 'lotte' | 'other'
  amount: number
  time: string
  store: string
  date: string
  usage: string
  completed: boolean
}

interface AddTaskInput {
  title: string
  memo: string
}

interface TaskContextType {
  tasks: Task[]
  addTask: (input: AddTaskInput) => Promise<void>
  deleteTask: (taskId: number) => Promise<void>
  deleteAllTasks: () => Promise<void>
  completeAllSinglePaymentTasks: () => Promise<void>
  totalAmount: number
  cardTotals: Record<string, number>
  isLoading: boolean
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/tasks')
        if (!response.ok) throw new Error('Failed to fetch tasks')
        const data = await response.json()
        setTasks(data)
      } catch (error) {
        console.error('Failed to fetch tasks:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const parseCardMessage = (memo: string) => {
    const cardTypes = {
      '신한': 'shinhan',
      '현대': 'hyundai',
      '삼성': 'samsung',
      'BC': 'bc',
      'KB': 'kb',
      '롯데': 'lotte'
    } as const

    let card_type: Task['card_type'] = 'other'
    let amount = 0
    let time = ''
    let store = '할부'
    let usage = ''

    // Parse card type
    for (const [key, value] of Object.entries(cardTypes)) {
      if (memo.includes(key)) {
        card_type = value
        break
      }
    }

    // Parse amount (숫자와 '원' 사이의 값)
    const amountMatch = memo.match(/(\d{1,3}(,\d{3})*|\d+)원/)
    if (amountMatch) {
      amount = parseInt(amountMatch[1].replace(/,/g, ''))
    }

    // Parse time (시:분 형식)
    const timeMatch = memo.match(/(\d{1,2}:\d{2})/)
    if (timeMatch) {
      time = timeMatch[1]
      // Parse usage (시간 바로 다음의 문자열만 추출, 줄바꿈 이후는 무시)
      const timeIndex = memo.indexOf(timeMatch[0])
      const afterTime = memo.slice(timeIndex + timeMatch[0].length).trim()
      const firstLineEnd = afterTime.indexOf('\n')
      
      if (firstLineEnd === -1) {
        // 줄바꿈이 없는 경우 전체 문자열 사용
        usage = afterTime.trim()
      } else {
        // 줄바꿈이 있는 경우 첫 줄만 사용
        usage = afterTime.slice(0, firstLineEnd).trim()
      }
    }

    // 일시불 여부 확인
    if (memo.includes('일시불')) {
      store = '일시불'
    }

    return { card_type, amount, time, store, usage }
  }

  const addTask = async (input: AddTaskInput) => {
    setIsLoading(true)
    try {
      const parsedData = parseCardMessage(input.memo)
      const newTask: Task = {
        id: Date.now(),
        title: input.title,
        card_type: parsedData.card_type,
        amount: parsedData.amount,
        time: parsedData.time,
        store: parsedData.store,
        date: new Date().toLocaleDateString('ko-KR'),
        usage: parsedData.usage,
        completed: false
      }

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      })

      if (!response.ok) throw new Error('Failed to add task')
      setTasks(prev => [...prev, newTask])
    } catch (error) {
      console.error('Failed to add task:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const deleteTask = async (taskId: number) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/tasks', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: taskId }),
      })

      if (!response.ok) throw new Error('Failed to delete task')
      setTasks(prev => prev.filter(task => task.id !== taskId))
    } catch (error) {
      console.error('Failed to delete task:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const deleteAllTasks = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/tasks/all', {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete all tasks')
      setTasks([])
    } catch (error) {
      console.error('Failed to delete all tasks:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const completeAllSinglePaymentTasks = async () => {
    try {
      const response = await fetch('/api/tasks/complete', {
        method: 'PUT',
      })

      if (!response.ok) {
        throw new Error('Failed to complete tasks')
      }

      const updatedTasks = await response.json()
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.store === '일시불' ? { ...task, completed: true } : task
        )
      )
    } catch {
      console.error('Error completing single payment tasks')
    }
  }

  // Calculate totals
  const sortedTasks = [...tasks].sort((a, b) => {
    // 날짜 비교
    const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime()
    if (dateComparison !== 0) return dateComparison
    
    // 날짜가 같은 경우 시간 비교
    const [aHour, aMinute] = a.time.split(':').map(Number)
    const [bHour, bMinute] = b.time.split(':').map(Number)
    const timeA = aHour * 60 + aMinute
    const timeB = bHour * 60 + bMinute
    return timeB - timeA
  })

  const totalAmount = sortedTasks.reduce((sum, task) => sum + task.amount, 0)
  const cardTotals = sortedTasks.reduce((totals, task) => {
    totals[task.card_type] = (totals[task.card_type] || 0) + task.amount
    return totals
  }, {} as Record<string, number>)

  return (
    <TaskContext.Provider
      value={{
        tasks: sortedTasks,
        addTask,
        deleteTask,
        deleteAllTasks,
        completeAllSinglePaymentTasks,
        totalAmount,
        cardTotals,
        isLoading
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export const useTask = () => {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider')
  }
  return context
} 