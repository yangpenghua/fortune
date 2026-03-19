'use client'

import html2canvas from 'html2canvas'

export async function generateShareImage(element: HTMLElement): Promise<string> {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#1A1A1A',
      logging: false,
    })

    return canvas.toDataURL('image/png')
  } catch (error) {
    console.error('生成分享图片失败:', error)
    throw new Error('生成图片失败')
  }
}

export async function downloadImage(dataUrl: string, filename: string = 'suanming.png'): Promise<void> {
  try {
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('下载图片失败:', error)
    throw new Error('下载失败')
  }
}

export function copyShareText(name: string, quote: string): boolean {
  try {
    const text = `✨ 我刚刚测了「${name}」的名字运势，太准了！\n\n「${quote}」\n\n快来测测你的名字吧！`

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
      return true
    }

    // 降级方案
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    return true
  } catch (error) {
    console.error('复制文案失败:', error)
    return false
  }
}
