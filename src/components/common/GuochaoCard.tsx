import { ReactNode } from 'react'

interface GuochaoCardProps {
  children: ReactNode
  className?: string
}

export function GuochaoCard({ children, className = '' }: GuochaoCardProps) {
  return (
    <div className={`guochao-border card-hover ${className}`}>
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}
