'use client'

import { FortuneHistoryItem, CheckInData, StorageData, FortuneData } from '@/types'

const STORAGE_KEY = 'suanming_storage'

function getStorage(): StorageData {
  if (typeof window === 'undefined') {
    return { history: [], checkIn: null }
  }
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('读取存储失败:', error)
  }
  return { history: [], checkIn: null }
}

function setStorage(data: StorageData): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('保存存储失败:', error)
  }
}

// 历史记录相关
export function saveToHistory(fortune: FortuneData): FortuneHistoryItem {
  const storage = getStorage()
  const item: FortuneHistoryItem = {
    ...fortune,
    id: Date.now().toString()
  }
  // 限制最多保存50条
  storage.history = [item, ...storage.history].slice(0, 50)
  setStorage(storage)
  return item
}

export function getHistory(): FortuneHistoryItem[] {
  return getStorage().history
}

export function deleteHistoryItem(id: string): void {
  const storage = getStorage()
  storage.history = storage.history.filter(item => item.id !== id)
  setStorage(storage)
}

export function clearHistory(): void {
  const storage = getStorage()
  storage.history = []
  setStorage(storage)
}

// 签到相关
export function getCheckInData(): CheckInData | null {
  return getStorage().checkIn
}

export function canCheckIn(): boolean {
  const checkIn = getCheckInData()
  if (!checkIn) return true

  const today = new Date().toDateString()
  return checkIn.lastCheckIn !== today
}

export function doCheckIn(dailyFortune?: string): CheckInData {
  const storage = getStorage()
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()

  let streak = 1
  if (storage.checkIn) {
    if (storage.checkIn.lastCheckIn === yesterday) {
      streak = storage.checkIn.streak + 1
    } else if (storage.checkIn.lastCheckIn !== today) {
      streak = 1
    } else {
      streak = storage.checkIn.streak
    }
  }

  storage.checkIn = {
    lastCheckIn: today,
    streak,
    totalCheckIns: (storage.checkIn?.totalCheckIns || 0) + 1,
    dailyFortune
  }

  setStorage(storage)
  return storage.checkIn
}

export function getCheckInStreak(): number {
  return getCheckInData()?.streak || 0
}
