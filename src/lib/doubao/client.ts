import { FortuneRequest, FortuneData, FortuneStyle } from '@/types'
import { getPromptConfig, sectionTitles } from './prompts'

const DOUBAO_API_KEY = process.env.DOUBAO_API_KEY || ''
const DOUBAO_BASE_URL = process.env.DOUBAO_BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3'
const DOUBAO_MODEL = process.env.DOUBAO_MODEL || 'ep-20241203010358-7jx5j'

interface DoubaoMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface DoubaoChatCompletionRequest {
  model: string
  messages: DoubaoMessage[]
  temperature?: number
  max_tokens?: number
}

interface DoubaoChatCompletionResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export async function generateFortune(request: FortuneRequest): Promise<FortuneData> {
  const { name, gender, birthDate, style = 'traditional' } = request
  const promptConfig = getPromptConfig(style as FortuneStyle)

  const messages: DoubaoMessage[] = [
    {
      role: 'system',
      content: promptConfig.systemPrompt
    },
    {
      role: 'user',
      content: promptConfig.userPromptTemplate(name, gender, birthDate)
    }
  ]

  try {
    // 调用豆包API
    let content: string

    if (DOUBAO_API_KEY && DOUBAO_API_KEY !== 'your_api_key_here') {
      content = await callDoubaoAPI(messages)
    } else {
      // 没有配置API Key时使用模拟数据
      content = getMockFortune(name, style as FortuneStyle)
    }

    // 解析返回的JSON
    const parsed = parseFortuneResponse(content)

    // 构建返回数据
    return {
      name,
      gender,
      birthDate,
      style: style as FortuneStyle,
      createdAt: new Date().toISOString(),
      personality: {
        ...sectionTitles.personality,
        content: parsed.personality
      },
      career: {
        ...sectionTitles.career,
        content: parsed.career
      },
      love: {
        ...sectionTitles.love,
        content: parsed.love
      },
      health: {
        ...sectionTitles.health,
        content: parsed.health
      },
      lucky: {
        ...sectionTitles.lucky,
        content: parsed.lucky
      },
      dailyQuote: {
        ...sectionTitles.dailyQuote,
        content: parsed.dailyQuote
      }
    }
  } catch (error) {
    console.error('生成算命结果失败:', error)
    throw new Error('生成失败，请稍后重试')
  }
}

async function callDoubaoAPI(messages: DoubaoMessage[]): Promise<string> {
  const requestBody: DoubaoChatCompletionRequest = {
    model: DOUBAO_MODEL,
    messages,
    temperature: 0.8,
    max_tokens: 2000
  }

  const response = await fetch(`${DOUBAO_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DOUBAO_API_KEY}`
    },
    body: JSON.stringify(requestBody)
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API请求失败: ${response.status} - ${errorText}`)
  }

  const data: DoubaoChatCompletionResponse = await response.json()
  return data.choices[0].message.content
}

function parseFortuneResponse(content: string): {
  personality: string
  career: string
  love: string
  health: string
  lucky: string
  dailyQuote: string
} {
  // 尝试提取JSON部分
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0])
    } catch {
      // 解析失败，继续使用备用方案
    }
  }

  // 如果无法解析JSON，返回模拟数据
  return {
    personality: content.slice(0, 150) || '您的性格独特而迷人，既有细腻的一面，也有果敢的时刻。',
    career: '事业上您有着独特的洞察力，只要保持初心，必将有所成就。',
    love: '感情中您真诚待人，美好的缘分正在向您走来。',
    health: '注意劳逸结合，适当运动，保持身心愉悦。',
    lucky: '幸运数字：3、8，幸运颜色：金色，幸运方位：东方。',
    dailyQuote: '相信自己，每一天都是新的开始！'
  }
}

function getMockFortune(name: string, style: FortuneStyle): string {
  const mockData = {
    personality: `${name}这个名字蕴含着独特的气质。您是一个内心坚定、处事稳重的人，对待朋友真诚热情，有着很强的责任感。在困难面前从不轻易退缩，总能用智慧找到解决问题的方法。`,
    career: '事业上，您有着敏锐的直觉和出色的执行力。适合从事需要创意和耐心的工作，近期会有不错的机会出现，把握好时机，必能获得满意的成果。',
    love: '感情方面，您是一个专一且浪漫的人。如果已有伴侣，近期感情会更加甜蜜；如果还在等待，美好的缘分很快就会降临，保持积极的心态迎接吧。',
    health: '健康上，建议您注意规律作息，避免熬夜。平时可以多做一些舒缓的运动，如散步、瑜伽等，保持心情舒畅，身心自然康健。',
    lucky: '幸运数字：2、7；幸运颜色：朱红、明黄；幸运方位：南方。本周可以多接触这些幸运元素，会为您带来好心情和好运气。',
    dailyQuote: '星光不问赶路人，时光不负有心人。'
  }

  return JSON.stringify(mockData)
}
