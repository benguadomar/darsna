import { describe, expect, it } from 'vitest'
import { classifyLink, EXAMPLE_CHAT, extractLinks, linkKey } from './rescue'

describe('extractLinks', () => {
  it('finds, deduplicates and classifies the links in the example chat', () => {
    const result = extractLinks(EXAMPLE_CHAT)

    expect(result.total).toBe(9)
    expect(result.links).toHaveLength(7)
    expect(result.duplicates).toBe(2)

    const byHost = Object.fromEntries(result.links.map((link) => [link.host, link]))
    expect(byHost['fr.khanacademy.org']).toMatchObject({
      count: 3,
      subject: 'Mathematics',
      trust: 'Trusted platform',
      language: 'FR',
      title: 'الدرس ديال الدوال هنا',
    })
    expect(byHost['telmidtice.men.gov.ma'].trust).toBe('Official source')
    expect(byHost['bit.ly']).toMatchObject({ warning: 'shortened', subject: 'Physics' })
    expect(byHost['drive.google.com'].warning).toBe('file')
    expect(byHost['apprendre.tv5monde.com'].subject).toBe('Languages')
    expect(byHost['cs50.harvard.edu']).toMatchObject({ subject: 'Computer science', language: 'EN' })
  })

  it('strips chat prefixes, trailing punctuation and tracking parameters', () => {
    const { links } = extractLinks(
      '23/10/2026, 18:42 - Salma: Cours de physique ici: https://example.org/cours?utm_source=wa&id=4.',
    )

    expect(links).toHaveLength(1)
    expect(links[0]).toMatchObject({
      title: 'Cours de physique ici',
      url: 'https://example.org/cours?id=4',
      subject: 'Physics',
      trust: 'Not reviewed',
    })
  })

  it('accepts links without a scheme and ignores non-web text', () => {
    const { links } = extractLinks('see www.geogebra.org/classic and javascript:alert(1) or mail me@test')

    expect(links).toHaveLength(1)
    expect(links[0].url).toBe('https://www.geogebra.org/classic')
    expect(links[0].trust).toBe('Trusted platform')
  })

  it('returns an empty result when there are no links', () => {
    expect(extractLinks('شكون عندو ملخص الفيزياء؟')).toEqual({ links: [], total: 0, duplicates: 0 })
  })
})

describe('linkKey', () => {
  it('treats www, protocol, trailing slashes and tracking parameters as the same link', () => {
    expect(linkKey('https://www.khanacademy.org/math/?utm_source=x')).toBe(linkKey('http://khanacademy.org/math'))
  })
})

describe('classifyLink', () => {
  it('flags insecure links even on known platforms', () => {
    expect(classifyLink('http://www.geogebra.org/')).toEqual({ trust: 'Trusted platform', warning: 'insecure' })
  })

  it('does not trust look-alike domains', () => {
    expect(classifyLink('https://khanacademy.org.example.com/').trust).toBe('Not reviewed')
    expect(classifyLink('https://gov.ma.example.com/').trust).toBe('Not reviewed')
  })
})
