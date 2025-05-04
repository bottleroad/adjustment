"use client"

import { useState } from 'react'
import { useTask } from '@/contexts/TaskContext'
import { Trash2, CreditCard, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

type FilterType = 'all' | 'single' | 'installment';

// 스켈레톤 로딩 컴포넌트
const TaskSkeleton = () => (
  <div className="animate-pulse space-y-2">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="mt-1 flex items-center gap-2">
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
        <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    ))}
  </div>
);

export default function TaskList() {
  const { tasks, deleteTask, completeAllSinglePaymentTasks, isLoading } = useTask()
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredTasks = tasks.filter(task => !task.completed)
    .filter(task => {
      if (filter === 'all') return true
      if (filter === 'single') return task.store === '일시불'
      if (filter === 'installment') return task.store === '할부'
      return true
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

      {isLoading ? (
        <TaskSkeleton />
      ) : (
        <>
          <div className="space-y-2">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {task.store === '일시불' ? (
                      <CreditCard className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    ) : (
                      <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    )}
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {task.title}
                    </span>
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      {new Intl.NumberFormat('ko-KR', {
                        style: 'currency',
                        currency: 'KRW',
                      }).format(task.amount)}
                    </span>
                    <span className={`
                      px-2 py-0.5 text-xs font-medium rounded-full
                      ${task.card_type === 'samsung' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                        task.card_type === 'hyundai' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                        task.card_type === 'bc' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                        task.card_type === 'kb' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                        task.card_type === 'shinhan' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                        task.card_type === 'lotte' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                      }`}>
                      {task.card_type.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>{task.date}</span>
                    <span>{task.time}</span>
                    <span>{task.usage}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="ml-4 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 focus:outline-none"
                  aria-label="항목 삭제"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          {filter === 'all' && (
            <Button
              onClick={handleCompleteAll}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              정산 완료
            </Button>
          )}
        </>
      )}
    </div>
  )
}