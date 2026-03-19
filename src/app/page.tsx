'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GuochaoCard } from '@/components/common/GuochaoCard'
import { FortuneForm } from '@/components/form/FortuneForm'
import { LoadingOverlay } from '@/components/common/LoadingOverlay'
import { FortuneRequest, FortuneData } from '@/types'
import { saveToHistory } from '@/lib/storage'

export default function HomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: FortuneRequest) => {
    setLoading(true)
    try {
      const response = await fetch('/api/fortune', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || '生成失败')
      }

      // 保存到历史记录
      saveToHistory(result.data)

      // 跳转到结果页
      const state = encodeURIComponent(JSON.stringify(result.data))
      router.push(`/result?data=${state}`)
    } catch (error) {
      alert(error instanceof Error ? error.message : '生成失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {loading && <LoadingOverlay />}

      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-float">
            🔮
          </div>
          <h1 className="text-3xl font-bold text-guochao-gold mb-2">
            测名字AI算命
          </h1>
          <p className="text-guochao-cream/70">
            输入姓名，探索你的专属运势
          </p>
        </div>

        <GuochaoCard>
          <FortuneForm onSubmit={handleSubmit} loading={loading} />
        </GuochaoCard>

        <div className="mt-8 text-center">
          <div className="flex justify-center gap-8 text-guochao-cream/50 text-sm">
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">👤</span>
              <span>性格解析</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">💼</span>
              <span>事业运势</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">💕</span>
              <span>感情走向</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
