"use client"

import { createContext, useContext, useState, useEffect } from 'react'

export interface Task {
  id: number
  title: string
  cardType: 'shinhan' | 'hyundai' | 'samsung' | 'bc' | 'kb' | 'lotte' | 'other'
  amount: number
  time: string
  store: string
  date: string
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

    let cardType: Task['cardType'] = 'other'
    let amount = 0
    let time = ''
    let store = ''

    // Parse card type
    for (const [key, value] of Object.entries(cardTypes)) {
      if (memo.includes(key)) {
        cardType = value
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
    }

    // Parse store name (마지막 줄을 상점명으로 가정)
    const lines = memo.trim().split('\n')
    store = lines[lines.length - 1].trim()

    return { cardType, amount, time, store }
  }

  const addTask = async (input: AddTaskInput) => {
    setIsLoading(true)
    try {
      const parsedData = parseCardMessage(input.memo)
      const newTask: Task = {
        id: Date.now(),
        title: input.title,
        cardType: parsedData.cardType,
        amount: parsedData.amount,
        time: parsedData.time,
        store: parsedData.store,
        date: new Date().toLocaleDateString('ko-KR'),
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

  // Calculate totals
  const totalAmount = tasks.reduce((sum, task) => sum + task.amount, 0)
  const cardTotals = tasks.reduce((totals, task) => {
    totals[task.cardType] = (totals[task.cardType] || 0) + task.amount
    return totals
  }, {} as Record<string, number>)

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        deleteTask,
        deleteAllTasks,
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