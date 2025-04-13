"use client"

import { useState } from 'react'
import { Star, Trash2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { useTask } from '@/contexts/TaskContext'

interface Task {
  id: number
  title: string
  date: string
  completed: boolean
  important: boolean
  amount: number
  cardType: 'shinhan' | 'hyundai' | 'samsung' | 'other'
  store: string
  time: string
}

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Complete project proposal",
    date: "2024. 4. 13.",
    completed: false,
    important: true,
    amount: 50000,
    cardType: 'shinhan',
    store: "일시불",
    time: "10:00"
  },
  {
    id: 2,
    title: "Schedule team meeting",
    date: "2024. 4. 13.",
    completed: false,
    important: false,
    amount: 30000,
    cardType: 'hyundai',
    store: "할부",
    time: "11:00"
  }
]

type FilterType = 'all' | 'single' | 'installment';

export default function TaskList() {
  const { tasks, toggleTaskCompletion, deleteTask, deleteAllTasks } = useTask()
  const [filter, setFilter] = useState<FilterType>('all')

  const totalAmount = tasks.reduce((sum, task) => sum + task.amount, 0)
  
  const cardTotals = tasks.reduce((acc, task) => {
    acc[task.cardType] = (acc[task.cardType] || 0) + task.amount
    return acc
  }, {} as Record<string, number>)

  const filteredTasks = tasks.filter(task => {
    if (filter === 'single') {
      return task.store.includes('일시불');
    }
    if (filter === 'installment') {
      return !task.store.includes('일시불');  // 일시불이 아닌 모든 경우를 할부로 처리
    }
    return true;
  })

  const handleDeleteTask = (taskId: number) => {
    if (window.confirm('이 항목을 삭제하시겠습니까?')) {
      deleteTask(taskId)
    }
  }

  const handleDeleteAll = () => {
    if (window.confirm('일시불 항목을 모두 삭제하시겠습니까?')) {
      // 일시불 항목만 찾아서 삭제
      tasks.forEach(task => {
        if (task.store.includes('일시불')) {
          deleteTask(task.id);
        }
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-purple-600 text-white'
              : 'text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          전체
        </button>
        <button
          onClick={() => setFilter('single')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            filter === 'single'
              ? 'bg-purple-600 text-white'
              : 'text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          일시불
        </button>
        <button
          onClick={() => setFilter('installment')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            filter === 'installment'
              ? 'bg-purple-600 text-white'
              : 'text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          할부
        </button>
      </div>

      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompletion(task.id)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <div>
                <p className={`text-sm font-medium ${
                  task.completed ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'
                }`}>
                  {task.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {task.store} • {task.amount.toLocaleString()}원 • {task.time}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>

      {/* 전체 보기에서만 전체 삭제 버튼 표시 */}
      {filter === 'all' && tasks.some(task => task.store.includes('일시불')) && (
        <div className="mt-6">
          <button
            onClick={handleDeleteAll}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            전체 삭제
          </button>
        </div>
      )}
    </div>
  )
} 