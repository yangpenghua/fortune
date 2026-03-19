import { FortuneData } from '@/types'

interface ResultHeaderProps {
  data: FortuneData
}

const styleLabels: Record<string, string> = {
  traditional: '传统八字',
  constellation: '星座运势',
  tarot: '塔罗占卜'
}

export function ResultHeader({ data }: ResultHeaderProps) {
  return (
    <div className="text-center mb-8 fade-in">
      <div className="inline-block mb-4">
        <div className="text-6xl mb-4 animate-float">
          ✨
        </div>
      </div>
      <h1 className="text-4xl font-bold text-guochao-gold mb-2">
        {data.name}
      </h1>
      <p className="text-guochao-cream/70 mb-2">
        {data.gender && (
          <span className="mr-4">
            {data.gender === 'male' ? '👨 男' : data.gender === 'female' ? '👩 女' : '🔮 保密'}
          </span>
        )}
        {data.birthDate && <span>🎂 {data.birthDate}</span>}
      </p>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-guochao-gold/10 border border-guochao-gold/30">
        <span>📋</span>
        <span className="text-guochao-gold text-sm">
          {styleLabels[data.style] || '传统八字'}
        </span>
      </div>
      <p className="text-xs text-guochao-cream/40 mt-4">
        {new Date(data.createdAt).toLocaleString('zh-CN')}
      </p>
    </div>
  )
}
