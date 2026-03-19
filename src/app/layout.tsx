import type { Metadata } from 'next'
import './globals.css'
import { ParticleBackground } from '@/components/common/ParticleBackground'
import { Navigation } from '@/components/common/Navigation'

export const metadata: Metadata = {
  title: '测名字AI算命',
  description: '基于AI的个性化姓名算命，传统国潮风格',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <ParticleBackground />
        <Navigation />
        <main className="relative z-10 min-h-screen pt-16">
          {children}
        </main>
      </body>
    </html>
  )
}
