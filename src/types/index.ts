export interface FortuneRequest {
  name: string
  gender?: 'male' | 'female' | 'other'
  birthDate?: string
  style?: FortuneStyle
}

export interface FortuneResponse {
  success: boolean
  data?: FortuneData
  error?: string
}

export interface FortuneData {
  name: string
  gender?: string
  birthDate?: string
  style: FortuneStyle
  createdAt: string
  personality: FortuneSection
  career: FortuneSection
  love: FortuneSection
  health: FortuneSection
  lucky: FortuneSection
  dailyQuote: FortuneSection
}

export interface FortuneSection {
  title: string
  icon: string
  content: string
}

export type FortuneStyle = 'traditional' | 'constellation' | 'tarot'

export interface FortuneHistoryItem extends FortuneData {
  id: string
}

export interface CheckInData {
  lastCheckIn: string
  streak: number
  totalCheckIns: number
  dailyFortune?: string
}

export interface StorageData {
  history: FortuneHistoryItem[]
  checkIn: CheckInData | null
}
