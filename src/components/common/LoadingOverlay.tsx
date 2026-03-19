interface LoadingOverlayProps {
  message?: string
}

const loadingMessages = [
  '正在解析姓名笔画...',
  '正在测算五行八字...',
  '正在调用天机算法...',
  '正在生成专属报告...',
]

export function LoadingOverlay({ message }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="loading-spinner mx-auto mb-6" />
        <p className="text-guochao-gold text-lg animate-pulse">
          {message || loadingMessages[Math.floor(Math.random() * loadingMessages.length)]}
        </p>
      </div>
    </div>
  )
}
