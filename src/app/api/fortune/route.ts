import { NextRequest, NextResponse } from 'next/server'
import { FortuneRequest, FortuneResponse } from '@/types'
import { generateFortune } from '@/lib/doubao/client'

export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    const body: FortuneRequest = await request.json()

    // 验证输入
    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json<FortuneResponse>({
        success: false,
        error: '请输入姓名'
      }, { status: 400 })
    }

    // 中文姓名长度验证
    const chineseChars = body.name.match(/[\u4e00-\u9fa5]/g)
    if (chineseChars && (chineseChars.length < 2 || chineseChars.length > 10)) {
      return NextResponse.json<FortuneResponse>({
        success: false,
        error: '中文姓名请保持2-10个汉字'
      }, { status: 400 })
    }

    // 验证出生日期（如果提供了）
    if (body.birthDate) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(body.birthDate)) {
        return NextResponse.json<FortuneResponse>({
          success: false,
          error: '出生日期格式无效'
        }, { status: 400 })
      }

      const birthDate = new Date(body.birthDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (isNaN(birthDate.getTime())) {
        return NextResponse.json<FortuneResponse>({
          success: false,
          error: '出生日期无效'
        }, { status: 400 })
      }

      if (birthDate > today) {
        return NextResponse.json<FortuneResponse>({
          success: false,
          error: '出生日期不能是未来日期'
        }, { status: 400 })
      }
    }

    // 调用AI生成
    const data = await generateFortune(body)

    return NextResponse.json<FortuneResponse>({
      success: true,
      data
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json<FortuneResponse>({
      success: false,
      error: error instanceof Error ? error.message : '生成失败，请稍后重试'
    }, { status: 500 })
  }
}
