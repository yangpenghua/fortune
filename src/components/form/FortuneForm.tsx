'use client'

import { useState, useCallback } from 'react'
import { FortuneRequest, FortuneStyle } from '@/types'

interface FortuneFormProps {
  onSubmit: (data: FortuneRequest) => void
  loading?: boolean
}

const STYLE_OPTIONS: Array<{ value: FortuneStyle; label: string; icon: string }> = [
  { value: 'traditional', label: '传统八字', icon: '📜' },
  { value: 'constellation', label: '星座运势', icon: '⭐' },
  { value: 'tarot', label: '塔罗占卜', icon: '🃏' },
]

const GENDER_OPTIONS: Array<{ value: 'male' | 'female' | 'other'; label: string; icon: string }> = [
  { value: 'male', label: '男', icon: '👨' },
  { value: 'female', label: '女', icon: '👩' },
  { value: 'other', label: '保密', icon: '🔮' },
]

export function FortuneForm({ onSubmit, loading }: FortuneFormProps) {
  const [formData, setFormData] = useState<FortuneRequest>({
    name: '',
    gender: 'other',
    style: 'traditional'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return
    onSubmit(formData)
  }

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, name: e.target.value }))
  }, [])

  const handleBirthDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({
      ...prev,
      birthDate: value && value.length > 0 ? value : undefined
    }))
  }, [])

  const handleStyleChange = useCallback((style: FortuneStyle) => {
    if (loading) return
    setFormData(prev => ({ ...prev, style }))
  }, [loading])

  const handleGenderChange = useCallback((gender: 'male' | 'female' | 'other') => {
    if (loading) return
    setFormData(prev => ({ ...prev, gender }))
  }, [loading])

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* 姓名输入 */}
      <div className="space-y-2">
        <label className="block text-guochao-gold font-semibold">
          <span className="text-lg">请输入姓名</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={handleNameChange}
          placeholder="请输入2-10个汉字"
          maxLength={20}
          disabled={loading}
          className="input-field text-center text-xl"
        />
        <p className="text-sm text-guochao-cream/50 text-center">
          支持中文姓名，2-10个汉字
        </p>
      </div>

      {/* 性别选择 */}
      <div className="space-y-2">
        <label className="block text-guochao-gold font-semibold">
          性别（可选）
        </label>
        <div className="flex gap-3">
          {GENDER_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleGenderChange(option.value)}
              disabled={loading}
              className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all relative z-10 ${
                formData.gender === option.value
                  ? 'border-guochao-gold bg-guochao-gold/10 text-guochao-gold'
                  : 'border-guochao-gold/30 text-guochao-cream/70 hover:border-guochao-gold/50'
              } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="text-xl mr-2">{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 出生日期 */}
      <div className="space-y-2">
        <label className="block text-guochao-gold font-semibold">
          出生日期（可选）
        </label>
        <input
          type="date"
          value={formData.birthDate || ''}
          onChange={handleBirthDateChange}
          disabled={loading}
          max={new Date().toISOString().split('T')[0]}
          className="input-field"
        />
        <p className="text-xs text-guochao-cream/40 text-center">
          选择您的出生日期，让测算更精准
        </p>
      </div>

      {/* 测算风格 */}
      <div className="space-y-2">
        <label className="block text-guochao-gold font-semibold">
          测算风格
        </label>
        <div className="grid grid-cols-3 gap-3">
          {STYLE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleStyleChange(option.value)}
              disabled={loading}
              className={`py-3 px-3 rounded-lg border-2 transition-all text-sm relative z-10 ${
                formData.style === option.value
                  ? 'border-guochao-gold bg-guochao-gold/10 text-guochao-gold'
                  : 'border-guochao-gold/30 text-guochao-cream/70 hover:border-guochao-gold/50'
              } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="text-xl block mb-1">{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 提交按钮 */}
      <button
        type="submit"
        disabled={loading || !formData.name.trim()}
        className="btn-primary w-full text-lg py-4"
      >
        {loading ? '测算中...' : '✨ 开始测算 ✨'}
      </button>

      <p className="text-xs text-center text-guochao-cream/40">
        仅供娱乐，请勿迷信
      </p>
    </form>
  )
}
