"use client"

import { useState } from 'react'
import { useTask } from '@/contexts/TaskContext'
import { Trash2, CreditCard, Clock, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

type FilterType = 'all' | 'single' | 'installment';

export default function TaskList() {
  const { tasks, deleteTask, completeAllSinglePaymentTasks } = useTask()
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

  const handleCompleteAll = () => {
    if (window.confirm('일시불 항목을 모두 정산 완료 처리하시겠습니까?')) {
      completeAllSinglePaymentTasks();
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
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
      </div>
      <div className="space-y-2">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center justify-between p-4 rounded-lg ${
              task.completed 
                ? 'bg-gray-100 dark:bg-gray-800' 
                : 'bg-gray-50 dark:bg-gray-700'
            }`}
          >
            <div className="flex items-center space-x-4">
              {task.store.includes('일시불') ? (
                <CreditCard className={`h-5 w-5 ${
                  task.completed 
                    ? 'text-gray-400 dark:text-gray-500' 
                    : 'text-purple-600 dark:text-purple-400'
                }`} />
              ) : (
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              )}
              <div>
                <p className={`text-sm font-medium ${
                  task.completed 
                    ? 'text-gray-500 dark:text-gray-400' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {task.title} [{task.usage}]
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {task.amount.toLocaleString()}원 • {task.date.slice(5)} • {task.time}
                </p>
                {task.usage && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {task.usage}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {task.completed && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <Button
        onClick={handleCompleteAll}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
      >
        정산 완료
      </Button>
    </div>
  )
} 