import type { ResourceSubject } from './data'
import { resourceSubjects } from './data'

export type SharedCustom = { t: string; u: string; s: ResourceSubject; l: string }
export type SharedItem = number | SharedCustom

const MAX_ITEMS = 60

function toBase64Url(text: string) {
  let binary = ''
  for (const byte of new TextEncoder().encode(text)) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(token: string) {
  const base64 = token.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(base64 + '='.repeat((4 - (base64.length % 4)) % 4))
  return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)))
}

export function isWebUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function isSharedCustom(value: unknown): value is SharedCustom {
  if (!value || typeof value !== 'object') return false
  const item = value as Record<string, unknown>
  return (
    typeof item.t === 'string' &&
    item.t.trim().length > 0 &&
    typeof item.u === 'string' &&
    isWebUrl(item.u) &&
    typeof item.s === 'string' &&
    (resourceSubjects as string[]).includes(item.s) &&
    typeof item.l === 'string'
  )
}

export function encodeCollection(items: SharedItem[]) {
  return toBase64Url(JSON.stringify({ v: 1, r: items.slice(0, MAX_ITEMS) }))
}

export function decodeCollection(token: string, knownIds: Set<number>): SharedItem[] | null {
  let payload: unknown
  try {
    payload = JSON.parse(fromBase64Url(token))
  } catch {
    return null
  }
  const list = payload && typeof payload === 'object' ? (payload as { r?: unknown }).r : undefined
  if (!Array.isArray(list)) return null

  const items: SharedItem[] = []
  for (const item of list.slice(0, MAX_ITEMS)) {
    if (typeof item === 'number') {
      if (knownIds.has(item)) items.push(item)
    } else if (isSharedCustom(item)) {
      items.push({ t: item.t.trim().slice(0, 120), u: item.u, s: item.s, l: item.l.slice(0, 12) })
    }
  }
  return items.length > 0 ? items : null
}
