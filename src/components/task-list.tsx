"use client"

import { useState } from 'react'
import { useTask } from '@/contexts/TaskContext'
import { Trash2, CreditCard, Clock } from 'lucide-react'

type FilterType = 'all' | 'single' | 'installment';

export default function TaskList() {
  const { tasks, deleteTask } = useTask()
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredTasks = tasks.filter(task => {
    if (filter === 'single') {
      return task.store.includes('일시불');
    }
    if (filter === 'installment') {
      return !task.store.includes('일시불');
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
              {task.store.includes('일시불') ? (
                <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              ) : (
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {task.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {task.amount.toLocaleString()}원 • {task.time} • {task.date}
                </p>
                {task.usage && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {task.usage}
                  </p>
                )}
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