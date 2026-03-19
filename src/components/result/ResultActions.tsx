import { useRouter } from 'next/navigation'
import { FortuneData } from '@/types'
import { copyShareText } from '@/lib/image'

interface ResultActionsProps {
  onShare: () => void
  onDownload: () => void
  sharing?: boolean
  downloading?: boolean
}

export function ResultActions({ onShare, onDownload, sharing, downloading }: ResultActionsProps) {
  const router = useRouter()

  const handleCopyText = () => {
    const success = copyShareText('您的名字', '每日箴言内容')
    if (success) {
      alert('文案已复制到剪贴板！')
    } else {
      alert('复制失败，请手动复制')
    }
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center mt-8">
      <button
        onClick={() => router.push('/')}
        className="btn-secondary"
      >
        🔄 重新测算
      </button>
      <button
        onClick={handleCopyText}
        className="btn-secondary"
      >
        📝 复制文案
      </button>
      <button
        onClick={onShare}
        disabled={sharing}
        className="btn-secondary"
      >
        {sharing ? '生成中...' : '🖼️ 生成分享图'}
      </button>
      <button
        onClick={onDownload}
        disabled={downloading}
        className="btn-primary"
      >
        {downloading ? '下载中...' : '💾 保存图片'}
      </button>
    </div>
  )
}
