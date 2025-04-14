"use client"

import { useState, FormEvent } from 'react'
import TaskList from '@/components/task-list'
import { Plus, X, BarChart } from 'lucide-react'
import { useTask } from '@/contexts/TaskContext'
import Dialog, { DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function Home() {
  const { tasks, totalAmount, cardTotals, addTask } = useTask()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showChart, setShowChart] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    memo: ''
  })

  // 할부 금액 계산
  const installmentAmount = tasks
    .filter(task => !task.store.includes('일시불'))
    .reduce((sum, task) => sum + task.amount, 0)

  // Calculate monthly totals for the chart
  const monthlyTotals = tasks.reduce((acc, task) => {
    const date = new Date(task.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    acc[monthKey] = (acc[monthKey] || 0) + task.amount
    return acc
  }, {} as Record<string, number>)

  const chartData = {
    labels: Object.keys(monthlyTotals).sort(),
    datasets: [
      {
        label: '월별 정산 금액',
        data: Object.keys(monthlyTotals).sort().map(key => monthlyTotals[key]),
        backgroundColor: 'rgba(147, 51, 234, 0.5)',
        borderColor: 'rgb(147, 51, 234)',
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '월별 정산 금액',
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        beginAtZero: true,
        ticks: {
          callback: function(tickValue: number | string) {
            const value = Number(tickValue)
            return new Intl.NumberFormat('ko-KR', { 
              style: 'currency', 
              currency: 'KRW',
              maximumFractionDigits: 0
            }).format(value)
          }
        },
      },
    },
  } as const

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    addTask(formData)
    setFormData({ title: '', memo: '' })
    setIsDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              정산관리
            </h1>
            <button
              onClick={() => setShowChart(true)}
              className="p-2 text-purple-600 hover:text-white dark:text-purple-400 dark:hover:text-white border-2 border-purple-600 dark:border-purple-400 focus:outline-none rounded-lg hover:bg-gradient-to-r from-purple-600 to-blue-600 dark:hover:bg-gradient-to-r dark:from-purple-600 dark:to-blue-600 transition-all duration-300"
              aria-label="월별 정산 그래프 보기"
            >
              <BarChart className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Total Amount Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all hover:shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Total Amount</h2>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalAmount.toLocaleString()}원</p>
            <p className="text-sm text-green-600 dark:text-green-400">
              할부금액: {installmentAmount.toLocaleString()}원
            </p>
          </div>

          {/* Card Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all hover:shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Card Summary</h2>
            </div>
            <div className="space-y-2">
              {Object.entries(cardTotals).map(([cardType, amount]) => (
                <div key={cardType} className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300 capitalize">
                    {cardType === 'shinhan' ? '신한카드' :
                     cardType === 'hyundai' ? '현대카드' :
                     cardType === 'samsung' ? '삼성카드' :
                     cardType === 'bc' ? 'BC카드' :
                     cardType === 'kb' ? 'KB카드' :
                     cardType === 'lotte' ? '롯데카드' : '기타'}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {amount.toLocaleString()}원
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {new Date().toLocaleString('ko-KR', { month: 'long' })} 정산
            </h2>
            <button 
              onClick={() => setIsDialogOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              추가
            </button>
          </div>
          <TaskList />
        </div>
      </div>

      {/* Chart Dialog */}
      <Dialog open={showChart} onOpenChange={setShowChart}>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="flex items-center justify-between">
            <DialogTitle>월별 정산 금액 그래프</DialogTitle>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">닫기</span>
            </DialogClose>
          </DialogHeader>
          <div className="p-4">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Task Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add Adjustment</h3>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter title"
                  required
                />
              </div>
              <div>
                <label htmlFor="memo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Text
                </label>
                <textarea
                  id="memo"
                  value={formData.memo}
                  onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-32"
                  placeholder="Paste card message here"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
