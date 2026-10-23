import { describe, expect, it } from 'vitest'
import type { SharedItem } from './share'
import { decodeCollection, encodeCollection } from './share'

describe('collection links', () => {
  it('round-trips library ids and custom Arabic resources', () => {
    const items: SharedItem[] = [1, 3, { t: 'ملخص الدوال', u: 'https://example.org/dawal', s: 'Mathematics', l: 'AR' }]
    const token = encodeCollection(items)

    expect(token).toMatch(/^[\w-]+$/)
    expect(decodeCollection(token, new Set([1, 3]))).toEqual(items)
  })

  it('drops unknown ids and unsafe links', () => {
    const token = encodeCollection([99, { t: 'x', u: 'javascript:alert(1)', s: 'Physics', l: 'FR' }])

    expect(decodeCollection(token, new Set([1]))).toBeNull()
  })

  it('rejects malformed tokens', () => {
    expect(decodeCollection('not-a-real-token', new Set([1]))).toBeNull()
    expect(decodeCollection(encodeCollection([]), new Set([1]))).toBeNull()
  })
})
