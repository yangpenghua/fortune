'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-guochao-gold flex items-center gap-2">
            <span className="text-2xl">🔮</span>
            <span>测名字</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm transition-colors ${
                isActive('/') ? 'text-guochao-gold' : 'text-guochao-cream/70 hover:text-guochao-cream'
              }`}
            >
              首页
            </Link>
            <Link
              href="/history"
              className={`text-sm transition-colors ${
                isActive('/history') ? 'text-guochao-gold' : 'text-guochao-cream/70 hover:text-guochao-cream'
              }`}
            >
              历史记录
            </Link>
            <Link
              href="/checkin"
              className={`text-sm transition-colors ${
                isActive('/checkin') ? 'text-guochao-gold' : 'text-guochao-cream/70 hover:text-guochao-cream'
              }`}
            >
              每日签到
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
