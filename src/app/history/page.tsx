'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { GuochaoCard } from '@/components/common/GuochaoCard'
import { FortuneHistoryItem } from '@/types'
import { getHistory, deleteHistoryItem, clearHistory } from '@/lib/storage'

const styleLabels: Record<string, string> = {
  traditional: '传统八字',
  constellation: '星座运势',
  tarot: '塔罗占卜'
}

export default function HistoryPage() {
  const router = useRouter()
  const [history, setHistory] = useState<FortuneHistoryItem[]>([])

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  const handleView = (item: FortuneHistoryItem) => {
    const state = encodeURIComponent(JSON.stringify(item))
    router.push(`/result?data=${state}`)
  }

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条记录吗？')) {
      deleteHistoryItem(id)
      setHistory(getHistory())
    }
  }

  const handleClearAll = () => {
    if (confirm('确定要清空所有历史记录吗？此操作不可恢复！')) {
      clearHistory()
      setHistory([])
    }
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-guochao-gold mb-2">
            📚 历史记录
          </h1>
          <p className="text-guochao-cream/70">
            共 {history.length} 条记录
          </p>
        </div>

        {history.length === 0 ? (
          <GuochaoCard>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-guochao-cream/70 mb-4">
                还没有测算记录
              </p>
              <button
                onClick={() => router.push('/')}
                className="btn-primary"
              >
                去测算
              </button>
            </div>
          </GuochaoCard>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={handleClearAll}
                className="text-sm text-guochao-red/70 hover:text-guochao-red"
              >
                清空全部
              </button>
            </div>

            <div className="space-y-4">
              {history.map((item, index) => (
                <GuochaoCard key={item.id} className="fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 cursor-pointer" onClick={() => handleView(item)}>
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">✨</div>
                        <div>
                          <h3 className="text-xl font-bold text-guochao-gold">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-3 mt-1 text-sm text-guochao-cream/60">
                            <span>{styleLabels[item.style]}</span>
                            <span>•</span>
                            <span>{new Date(item.createdAt).toLocaleDateString('zh-CN')}</span>
                          </div>
                          <p className="text-guochao-cream/80 mt-2 line-clamp-1">
                            {item.dailyQuote.content}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleView(item)}
                        className="btn-secondary py-2 px-4 text-sm"
                      >
                        查看
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-guochao-red/70 hover:text-guochao-red p-2"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </GuochaoCard>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
