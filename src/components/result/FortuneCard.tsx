import { FortuneSection } from '@/types'
import { GuochaoCard } from '@/components/common/GuochaoCard'

interface FortuneCardProps {
  section: FortuneSection
  delay?: number
}

export function FortuneCard({ section, delay = 0 }: FortuneCardProps) {
  return (
    <GuochaoCard className="fade-in" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start gap-4">
        <span className="text-4xl">{section.icon}</span>
        <div className="flex-1">
          <h3 className="text-guochao-gold font-bold text-lg mb-2">
            {section.title}
          </h3>
          <p className="text-guochao-cream/90 leading-relaxed">
            {section.content}
          </p>
        </div>
      </div>
    </GuochaoCard>
  )
}
