import { ReactNode, HTMLAttributes } from 'react'

interface GuochaoCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

export function GuochaoCard({ children, className = '', ...props }: GuochaoCardProps) {
  return (
    <div className={`guochao-border card-hover ${className}`} {...props}>
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}
