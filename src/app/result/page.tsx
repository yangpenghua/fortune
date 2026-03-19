'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { FortuneData } from '@/types'
import { GuochaoCard } from '@/components/common/GuochaoCard'
import { FortuneCard } from '@/components/result/FortuneCard'
import { ResultHeader } from '@/components/result/ResultHeader'
import { ResultActions } from '@/components/result/ResultActions'
import { ShareImage } from '@/components/result/ShareImage'
import { generateShareImage, downloadImage } from '@/lib/image'

function ResultContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [data, setData] = useState<FortuneData | null>(null)
  const [sharing, setSharing] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [shareImageUrl, setShareImageUrl] = useState<string | null>(null)
  const shareRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dataParam = searchParams.get('data')
    if (dataParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(dataParam))
        setData(parsed)
      } catch {
        router.push('/')
      }
    } else {
      router.push('/')
    }
  }, [searchParams, router])

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto" />
          <p className="mt-4 text-guochao-cream/70">加载中...</p>
        </div>
      </div>
    )
  }

  const handleGenerateShare = async () => {
    if (!shareRef.current) return
    setSharing(true)
    try {
      const dataUrl = await generateShareImage(shareRef.current)
      setShareImageUrl(dataUrl)
    } catch (error) {
      alert('生成分享图失败，请重试')
    } finally {
      setSharing(false)
    }
  }

  const handleDownload = async () => {
    if (shareImageUrl) {
      await downloadImage(shareImageUrl, `${data.name}-运势.png`)
      return
    }

    if (!shareRef.current) return
    setDownloading(true)
    try {
      const dataUrl = await generateShareImage(shareRef.current)
      await downloadImage(dataUrl, `${data.name}-运势.png`)
    } catch (error) {
      alert('下载失败，请重试')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="min-h-screen py-8 px-4">
      {/* 隐藏的分享图元素 */}
      <div className="hidden">
        <div ref={shareRef}>
          <ShareImage data={data} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <ResultHeader data={data} />

        <div className="space-y-4">
          <FortuneCard section={data.personality} delay={100} />
          <FortuneCard section={data.career} delay={200} />
          <FortuneCard section={data.love} delay={300} />
          <FortuneCard section={data.health} delay={400} />
          <FortuneCard section={data.lucky} delay={500} />
          <FortuneCard section={data.dailyQuote} delay={600} />
        </div>

        <ResultActions
          onShare={handleGenerateShare}
          onDownload={handleDownload}
          sharing={sharing}
          downloading={downloading}
        />

        {shareImageUrl && (
          <div className="mt-8 fade-in">
            <GuochaoCard>
              <h3 className="text-guochao-gold font-bold mb-4 text-center">
                🖼️ 分享图预览
              </h3>
              <div className="rounded-lg overflow-hidden border-2 border-guochao-gold/30">
                <img src={shareImageUrl} alt="分享图" className="w-full" />
              </div>
              <p className="text-center text-guochao-cream/60 text-sm mt-4">
                长按图片保存，或点击上方按钮下载
              </p>
            </GuochaoCard>
          </div>
        )}

        <p className="text-center text-guochao-cream/30 text-xs mt-12">
          仅供娱乐，请勿迷信
        </p>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="loading-spinner mx-auto" />
        <p className="mt-4 text-guochao-cream/70">加载中...</p>
      </div>
    </div>
  )
}

export default function ResultPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResultContent />
    </Suspense>
  )
}
