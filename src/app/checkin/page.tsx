'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { GuochaoCard } from '@/components/common/GuochaoCard'
import { CheckInData } from '@/types'
import { getCheckInData, canCheckIn, doCheckIn, getCheckInStreak } from '@/lib/storage'

const dailyFortunes = [
  '今日宜：积极乐观，好运自然来！',
  '今日幸运值满格，适合做重要决定！',
  '保持微笑，会有意外惊喜等着你！',
  '今日是尝试新事物的好日子！',
  '你的努力即将得到回报，继续加油！',
  '今日适合与人交流，能收获宝贵建议！',
  '放松心情，享受美好的一天！',
  '今日你的创意无限，适合头脑风暴！',
  '相信自己，你比想象中更强大！',
  '今日宜感恩，珍惜身边的每一个人！',
]

export default function CheckInPage() {
  const router = useRouter()
  const [checkInData, setCheckInData] = useState<CheckInData | null>(null)
  const [canCheckInToday, setCanCheckInToday] = useState(false)
  const [checkedIn, setCheckedIn] = useState(false)

  useEffect(() => {
    setCheckInData(getCheckInData())
    setCanCheckInToday(canCheckIn())
  }, [])

  const handleCheckIn = () => {
    const dailyFortune = dailyFortunes[Math.floor(Math.random() * dailyFortunes.length)]
    const newData = doCheckIn(dailyFortune)
    setCheckInData(newData)
    setCanCheckInToday(false)
    setCheckedIn(true)
  }

  const streak = checkInData?.streak || 0
  const total = checkInData?.totalCheckIns || 0

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-guochao-gold mb-2">
            🎋 每日签到
          </h1>
          <p className="text-guochao-cream/70">
            每日签到获取专属运势
          </p>
        </div>

        {/* 签到统计 */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <GuochaoCard>
            <div className="text-center">
              <div className="text-4xl mb-2">🔥</div>
              <div className="text-3xl font-bold text-guochao-gold">
                {streak}
              </div>
              <div className="text-sm text-guochao-cream/70">
                连续签到
              </div>
            </div>
          </GuochaoCard>
          <GuochaoCard>
            <div className="text-center">
              <div className="text-4xl mb-2">📅</div>
              <div className="text-3xl font-bold text-guochao-gold">
                {total}
              </div>
              <div className="text-sm text-guochao-cream/70">
                累计签到
              </div>
            </div>
          </GuochaoCard>
        </div>

        {/* 签到按钮 */}
        <GuochaoCard className="mb-8">
          <div className="text-center py-8">
            {canCheckInToday ? (
              <>
                <div className="text-6xl mb-4 animate-float">
                  🎁
                </div>
                <p className="text-guochao-cream/80 mb-6">
                  今日还未签到，点击领取今日运势！
                </p>
                <button
                  onClick={handleCheckIn}
                  className="btn-primary text-lg px-8 py-4"
                >
                  ✨ 立即签到 ✨
                </button>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">
                  ✅
                </div>
                <p className="text-guochao-gold font-bold text-lg mb-2">
                  今日已签到！
                </p>
                {checkInData?.dailyFortune && (
                  <GuochaoCard className="mt-4 bg-guochao-gold/5">
                    <p className="text-guochao-cream/90">
                      {checkInData.dailyFortune}
                    </p>
                  </GuochaoCard>
                )}
              </>
            )}
          </div>
        </GuochaoCard>

        {/* 连续签到奖励 */}
        <GuochaoCard>
          <h3 className="text-guochao-gold font-bold text-lg mb-4 text-center">
            🎯 连续签到奖励
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {[1, 3, 7, 14, 30].map((day, index) => (
              <div
                key={day}
                className={`text-center p-3 rounded-lg border-2 ${
                  streak >= day
                    ? 'border-guochao-gold bg-guochao-gold/10'
                    : 'border-guochao-gold/20'
                }`}
              >
                <div className="text-2xl mb-1">
                  {streak >= day ? '🏆' : '🔒'}
                </div>
                <div className={`text-sm font-bold ${streak >= day ? 'text-guochao-gold' : 'text-guochao-cream/50'}`}>
                  {day}天
                </div>
              </div>
            ))}
          </div>
        </GuochaoCard>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="btn-secondary"
          >
            去测算名字
          </button>
        </div>
      </div>
    </div>
  )
}
