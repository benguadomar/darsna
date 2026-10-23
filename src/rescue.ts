import type { LinkWarning, ResourceSubject, Trust } from './data'

export type RescuedLink = {
  key: string
  url: string
  host: string
  title: string
  subject: ResourceSubject
  language: string
  trust: Trust
  warning?: LinkWarning
  count: number
}

export type RescueResult = {
  links: RescuedLink[]
  total: number
  duplicates: number
}

const URL_PATTERN = /(?:https?:\/\/|www\.)[^\s<>"'`]+/giu
const TRAILING_PUNCTUATION = /[.,;:!?)\]}»”’'"…]+$/u
// WhatsApp exports prefix messages with "[21/10/2026, 18:42] Name: " (iOS) or "21/10/2026, 18:42 - Name: " (Android).
const CHAT_PREFIX =
  /^\s*\[?\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4},?\s+\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?\]?\s*(?:-\s*)?(?:[^:\n]{1,40}:\s+)?/u
const EDGE_START = /^[\s\p{P}\p{S}\p{M}]+/u
const EDGE_END = /[\s\p{P}\p{S}\p{M}]+$/u
const TRACKING_PARAM = /^(utm_\w+|fbclid|gclid|igshid|si)$/i

const TRUSTED_HOSTS = [
  'khanacademy.org',
  'phet.colorado.edu',
  'geogebra.org',
  'tv5monde.com',
  'harvard.edu',
  'mit.edu',
  'coursera.org',
  'edx.org',
  'unesco.org',
]
const SHORTENERS = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'cutt.ly', 'shorturl.at', 'rb.gy', 'is.gd', 'ow.ly']
const FILE_HOSTS = ['drive.google.com', 'docs.google.com', 'dropbox.com', 'mega.nz', 'mediafire.com', 'wetransfer.com']
const HOST_LANGUAGES: Record<string, string> = { 'harvard.edu': 'EN', 'mit.edu': 'EN', 'tv5monde.com': 'FR' }

const SUBJECT_KEYWORDS: Array<[ResourceSubject, string[]]> = [
  [
    'Mathematics',
    ['math', 'algèbre', 'algebre', 'algebra', 'fonction', 'function', 'probabil', 'géométrie', 'geometrie',
      'geometry', 'équation', 'equation', 'geogebra', 'رياضيات', 'دوال', 'الدوال', 'جبر', 'هندسة', 'معادلات', 'احتمالات'],
  ],
  [
    'Physics',
    ['physi', 'mécanique', 'mecanique', 'mechanic', 'électricité', 'electricite', 'electric', 'circuit', 'optique',
      'optics', 'phet', 'chimie', 'chemistry', 'فيزياء', 'الفيزياء', 'كهرباء', 'ميكانيك', 'موجات', 'كيمياء'],
  ],
  [
    'Languages',
    ['français', 'francais', 'french', 'grammaire', 'grammar', 'conjugaison', 'anglais', 'english', 'arabe',
      'arabic', 'tv5monde', 'الفرنسية', 'فرنسية', 'العربية', 'الإنجليزية', 'الانجليزية', 'قواعد', 'تعبير', 'إنشاء'],
  ],
  [
    'Computer science',
    ['informatique', 'programm', 'python', 'algorithm', 'algorithme', 'coding', 'cs50', 'معلوميات', 'المعلوميات',
      'برمجة', 'البرمجة', 'خوارزم'],
  ],
]

function hostMatches(host: string, domains: string[]) {
  return domains.some((domain) => host === domain || host.endsWith(`.${domain}`))
}

function bareHost(url: URL) {
  return url.hostname.replace(/^www\./, '')
}

function parseLink(raw: string): URL | null {
  const candidate = raw.replace(TRAILING_PUNCTUATION, '')
  const withScheme = /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`
  try {
    const url = new URL(withScheme)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    if (!url.hostname.includes('.')) return null
    for (const param of [...url.searchParams.keys()]) {
      if (TRACKING_PARAM.test(param)) url.searchParams.delete(param)
    }
    return url
  } catch {
    return null
  }
}

function keyOf(url: URL) {
  return `${bareHost(url)}${url.pathname.replace(/\/+$/, '')}${url.search}`
}

export function linkKey(value: string) {
  const url = parseLink(value)
  return url ? keyOf(url) : value
}

export function hostOf(value: string) {
  try {
    return bareHost(new URL(value))
  } catch {
    return value
  }
}

export function classifyLink(value: string): { trust: Trust; warning?: LinkWarning } {
  let url: URL
  try {
    url = new URL(value)
  } catch {
    return { trust: 'Not reviewed' }
  }
  const host = bareHost(url)
  if (hostMatches(host, SHORTENERS)) return { trust: 'Not reviewed', warning: 'shortened' }
  if (hostMatches(host, FILE_HOSTS)) return { trust: 'Not reviewed', warning: 'file' }
  const warning: LinkWarning | undefined = url.protocol === 'http:' ? 'insecure' : undefined
  if (host.endsWith('.gov.ma')) return { trust: 'Official source', warning }
  if (hostMatches(host, TRUSTED_HOSTS)) return { trust: 'Trusted platform', warning }
  return { trust: 'Not reviewed', warning }
}

function detectSubject(text: string): ResourceSubject {
  const haystack = text.toLowerCase()
  let best: ResourceSubject = 'General'
  let bestScore = 0
  for (const [subject, keywords] of SUBJECT_KEYWORDS) {
    const score = keywords.filter((keyword) => haystack.includes(keyword)).length
    if (score > bestScore) {
      best = subject
      bestScore = score
    }
  }
  return best
}

function detectLanguage(url: URL, context: string) {
  const host = bareHost(url)
  const hinted = Object.entries(HOST_LANGUAGES).find(([domain]) => hostMatches(host, [domain]))
  if (hinted) return hinted[1]
  const firstLabel = host.split('.')[0]
  const firstPath = url.pathname.split('/')[1]?.toLowerCase()
  for (const code of ['fr', 'ar', 'en']) {
    if (firstLabel === code || firstPath === code) return code.toUpperCase()
  }
  if (/[\u0600-\u06FF]/u.test(context)) return 'AR'
  if (/[àâçéèêëîïôûùüÿœ]|\b(le|la|les|des|pour|cours|exercices)\b/i.test(context)) return 'FR'
  return 'EN'
}

function cleanTitle(text: string) {
  const compact = text.replace(/\s+/g, ' ').replace(EDGE_START, '').replace(EDGE_END, '').trim()
  if (compact.length < 3) return ''
  const capitalized = compact.charAt(0).toLocaleUpperCase() + compact.slice(1)
  return capitalized.length > 80 ? `${capitalized.slice(0, 77).trimEnd()}…` : capitalized
}

function fallbackTitle(url: URL) {
  const path = url.pathname === '/' ? '' : url.pathname
  const title = `${bareHost(url)}${path}`
  return title.length > 60 ? `${title.slice(0, 57)}…` : title
}

export function extractLinks(text: string): RescueResult {
  const found = new Map<string, RescuedLink>()
  let total = 0

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(CHAT_PREFIX, '')
    const matches = line.match(URL_PATTERN) ?? []
    if (matches.length === 0) continue
    const context = cleanTitle(line.replace(URL_PATTERN, ' '))

    for (const match of matches) {
      const url = parseLink(match)
      if (!url) continue
      total += 1
      const key = keyOf(url)
      const existing = found.get(key)
      if (existing) {
        existing.count += 1
        continue
      }
      const href = url.toString()
      found.set(key, {
        key,
        url: href,
        host: bareHost(url),
        title: context || fallbackTitle(url),
        subject: detectSubject(`${line} ${url.hostname}${url.pathname}`),
        language: detectLanguage(url, context),
        ...classifyLink(href),
        count: 1,
      })
    }
  }

  const links = [...found.values()]
  return { links, total, duplicates: total - links.length }
}

export const EXAMPLE_CHAT = `[21/10/2026, 18:42] Yassine: الدرس ديال الدوال هنا https://fr.khanacademy.org/math/algebra
[21/10/2026, 18:45] Salma: Merci! Et pour la physique, la simulation des circuits: https://phet.colorado.edu/fr/simulations/circuit-construction-kit-dc
[21/10/2026, 19:02] Imane: Cours officiels pour le Bac 👉 https://telmidtice.men.gov.ma/
[21/10/2026, 19:10] Yassine: شكون عندو ملخص الفيزياء؟
[21/10/2026, 19:11] Omar: هادا ملخص PDF https://bit.ly/resume-physique-bac
[21/10/2026, 19:15] Salma: re-voici le lien des fonctions https://fr.khanacademy.org/math/algebra/
[21/10/2026, 19:20] Imane: Exercices de grammaire française: https://apprendre.tv5monde.com/fr
[21/10/2026, 19:31] Omar: dossier partagé avec les examens nationaux https://drive.google.com/drive/folders/1AbCdEfGh
[21/10/2026, 19:40] Yassine: الدرس ديال الدوال مرة أخرى https://fr.khanacademy.org/math/algebra?utm_source=whatsapp
[21/10/2026, 20:05] Salma: Python pour débutants: https://cs50.harvard.edu/python/`
