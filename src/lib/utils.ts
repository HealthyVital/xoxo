import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrencyEUR(value: number): string {
  return new Intl.NumberFormat('en-NL', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-NL').format(value)
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`
}

export function formatDate(iso?: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function timeAgo(iso?: string): string {
  if (!iso) return '—'
  const d = new Date(iso).getTime()
  const now = Date.now()
  const diffDays = Math.round((now - d) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  if (diffDays > 0) return `${diffDays}d ago`
  if (diffDays === -1) return 'tomorrow'
  return `in ${Math.abs(diffDays)}d`
}

export function uid(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(36)}`
}

export function nowIso(): string {
  return new Date().toISOString()
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}
