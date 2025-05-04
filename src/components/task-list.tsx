// ... existing code ...
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
// ... existing code ...