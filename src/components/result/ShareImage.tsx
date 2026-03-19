import { FortuneData } from '@/types'
import { FortuneCard } from './FortuneCard'
import { ResultHeader } from './ResultHeader'

interface ShareImageProps {
  data: FortuneData
}

export function ShareImage({ data }: ShareImageProps) {
  return (
    <div className="bg-gradient-to-b from-black to-[#2D1F1F] min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <ResultHeader data={data} />

        <div className="space-y-4">
          <FortuneCard section={data.personality} />
          <FortuneCard section={data.career} />
          <FortuneCard section={data.love} />
          <FortuneCard section={data.health} />
          <FortuneCard section={data.lucky} />
          <FortuneCard section={data.dailyQuote} />
        </div>

        <div className="text-center mt-8 pt-6 border-t border-guochao-gold/20">
          <p className="text-guochao-gold font-bold text-lg">测名字AI算命</p>
          <p className="text-guochao-cream/50 text-sm mt-1">扫码体验更多精彩</p>
        </div>
      </div>
    </div>
  )
}
