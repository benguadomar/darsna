import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  Check,
  ChevronDown,
  Clock3,
  FileText,
  Globe,
  Inbox,
  Languages,
  Menu,
  Plus,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
} from 'lucide-react'
import './App.css'
import { LinkRescue } from './components/LinkRescue'
import { ResourceCard } from './components/ResourceCard'
import { ShareDialog } from './components/ShareDialog'
import type { Resource, ResourceSubject, Subject } from './data'
import {
  createCustomResource,
  localizedText,
  resourceSubjects,
  seedIds,
  seedResources,
  subjectCopyKey,
  subjects,
} from './data'
import type { Language } from './i18n'
import { copy, format, languages, term } from './i18n'
import type { RescuedLink } from './rescue'
import { linkKey } from './rescue'
import type { SharedItem } from './share'
import { decodeCollection, encodeCollection, isWebUrl } from './share'

const STORAGE = { saved: 'darsna-saved', custom: 'darsna-custom', language: 'darsna-language' }

type Incoming = { ids: number[]; extra: Resource[] }

function readJson(key: string): unknown {
  try {
    return JSON.parse(localStorage.getItem(key) ?? 'null')
  } catch {
    return null
  }
}

function readLanguage(): Language {
  const stored = localStorage.getItem(STORAGE.language)
  return languages.find((code) => code === stored) ?? 'en'
}

function readSaved(): number[] {
  const stored = readJson(STORAGE.saved)
  return Array.isArray(stored) ? stored.filter((id): id is number => typeof id === 'number') : []
}

function isStoredResource(value: unknown): value is Resource {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<Resource>
  return (
    typeof item.id === 'number' &&
    typeof item.title === 'string' &&
    typeof item.href === 'string' &&
    isWebUrl(item.href) &&
    resourceSubjects.some((subject) => subject === item.subject)
  )
}

function readCustom(): Resource[] {
  const stored = readJson(STORAGE.custom)
  return Array.isArray(stored) ? stored.filter(isStoredResource) : []
}

function readIncoming(existing: Resource[]): Incoming | null {
  const match = window.location.hash.match(/^#c=([\w-]+)$/)
  if (!match) return null
  const items = decodeCollection(match[1], seedIds)
  if (!items) return null

  const known = new Map(existing.map((resource) => [linkKey(resource.href), resource.id]))
  const stamp = Date.now()
  const extra: Resource[] = []
  const ids = items.map((item, index) => {
    if (typeof item === 'number') return item
    const existingId = known.get(linkKey(item.u))
    if (existingId !== undefined) return existingId
    const resource = createCustomResource({
      id: stamp + index,
      title: item.t,
      url: item.u,
      subject: item.s,
      language: item.l,
      kind: 'shared',
    })
    extra.push(resource)
    return resource.id
  })
  return { ids: [...new Set(ids)], extra }
}

function scrollToSection(id: string) {
  window.requestAnimationFrame(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

const emptyForm = { title: '', url: '', subject: 'General' as ResourceSubject, language: 'AR · FR' }

function App() {
  const [language, setLanguage] = useState<Language>(readLanguage)
  const [query, setQuery] = useState('')
  const [subject, setSubject] = useState<Subject>('All')
  const [savedOnly, setSavedOnly] = useState(false)
  const [saved, setSaved] = useState<number[]>(readSaved)
  const [custom, setCustom] = useState<Resource[]>(readCustom)
  const [incoming, setIncoming] = useState<Incoming | null>(() => readIncoming([...custom, ...seedResources]))
  const [sharedOnly, setSharedOnly] = useState(() => incoming !== null)
  const [bannerOpen, setBannerOpen] = useState(() => incoming !== null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const noticeTimer = useRef<number | undefined>(undefined)
  const handledIncoming = useRef(false)
  const t = copy[language]

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    localStorage.setItem(STORAGE.language, language)
  }, [language])

  useEffect(() => {
    localStorage.setItem(STORAGE.saved, JSON.stringify(saved))
  }, [saved])

  useEffect(() => {
    localStorage.setItem(STORAGE.custom, JSON.stringify(custom))
  }, [custom])

  useEffect(() => {
    if (!incoming || handledIncoming.current) return
    handledIncoming.current = true
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
    scrollToSection('discover')
  }, [incoming])

  useEffect(() => {
    if (!modalOpen && !shareOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setModalOpen(false)
      setShareOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [modalOpen, shareOpen])

  const resources = useMemo(() => [...(incoming?.extra ?? []), ...custom, ...seedResources], [incoming, custom])
  const savedSet = useMemo(() => new Set(saved), [saved])
  const incomingSet = useMemo(() => new Set(incoming?.ids ?? []), [incoming])
  const libraryKeys = useMemo(() => new Set(resources.map((resource) => linkKey(resource.href))), [resources])
  const savedResources = resources.filter((resource) => savedSet.has(resource.id))
  const allIncomingSaved = incoming ? incoming.extra.length === 0 && incoming.ids.every((id) => savedSet.has(id)) : false

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return resources.filter((resource) => {
      if (subject !== 'All' && resource.subject !== subject) return false
      if (savedOnly && !savedSet.has(resource.id)) return false
      if (sharedOnly && !incomingSet.has(resource.id)) return false
      if (!normalized) return true
      const searchable = languages.map((code) => {
        const text = localizedText(resource, code, copy[code])
        return [
          text.title,
          text.description,
          copy[code][subjectCopyKey[resource.subject]],
          term(code, resource.type),
          resource.level ? term(code, resource.level) : '',
        ].join(' ')
      })
      return `${searchable.join(' ')} ${resource.source} ${resource.language} ${resource.href}`
        .toLowerCase()
        .includes(normalized)
    })
  }, [query, resources, savedOnly, savedSet, sharedOnly, incomingSet, subject])

  const showNotice = (message: string) => {
    window.clearTimeout(noticeTimer.current)
    setNotice(message)
    noticeTimer.current = window.setTimeout(() => setNotice(''), 3200)
  }

  const toggleSaved = (id: number) => {
    setSaved((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  const resetFilters = () => {
    setQuery('')
    setSubject('All')
    setSavedOnly(false)
    setSharedOnly(false)
  }

  const handleRescueAdd = (links: RescuedLink[]) => {
    const known = new Map([...custom, ...seedResources].map((resource) => [linkKey(resource.href), resource.id]))
    const stamp = Date.now()
    const created: Resource[] = []
    const ids = links.map((link, index) => {
      const existingId = known.get(link.key)
      if (existingId !== undefined) return existingId
      const resource = createCustomResource({
        id: stamp + index,
        title: link.title,
        url: link.url,
        subject: link.subject,
        language: link.language,
        kind: 'rescued',
      })
      created.push(resource)
      return resource.id
    })
    setCustom((current) => [...created, ...current])
    setSaved((current) => [...new Set([...current, ...ids])])
    resetFilters()
    setSavedOnly(true)
    showNotice(format(t.rescueAdded, { count: links.length }))
    scrollToSection('discover')
  }

  const saveIncoming = () => {
    if (!incoming) return
    setCustom((current) => [...incoming.extra, ...current])
    setSaved((current) => [...new Set([...current, ...incoming.ids])])
    setIncoming({ ids: incoming.ids, extra: [] })
    showNotice(t.sharedSaved)
  }

  const buildShareLink = () => {
    const items: SharedItem[] = savedResources.map((resource) =>
      seedIds.has(resource.id)
        ? resource.id
        : { t: resource.title, u: resource.href, s: resource.subject, l: resource.language },
    )
    return `${window.location.origin}${window.location.pathname}#c=${encodeCollection(items)}`
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const title = form.title.trim()
    const url = form.url.trim()
    if (!title || !isWebUrl(url)) {
      setError(t.required)
      return
    }
    setError('')
    const resource = createCustomResource({
      id: Date.now(),
      title,
      url,
      subject: form.subject,
      language: form.language,
      kind: 'suggested',
    })
    setCustom((current) => [resource, ...current])
    setSaved((current) => [...current, resource.id])
    setForm(emptyForm)
    setModalOpen(false)
    showNotice(t.added)
  }

  const navLinks: Array<[string, string]> = [
    ['rescue', t.navRescue],
    ['discover', t.navDiscover],
    ['trust', t.navTrust],
    ['mission', t.navAbout],
  ]

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Darsna">
          <span className="brand-mark"><BookOpen aria-hidden="true" /></span>
          <span>Darsna<span className="brand-dot">.</span></span>
        </a>

        <nav className={menuOpen ? 'nav-links nav-links--open' : 'nav-links'} aria-label="Main navigation">
          {navLinks.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
        </nav>

        <div className="header-actions">
          <label className="language-picker">
            <Globe aria-hidden="true" />
            <span className="sr-only">{t.languageLabel}</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value as Language)}>
              <option value="en">EN</option>
              <option value="fr">FR</option>
              <option value="ar">AR</option>
            </select>
            <ChevronDown aria-hidden="true" />
          </label>
          <button className="button button--dark header-share" type="button" onClick={() => setModalOpen(true)}>
            <Plus aria-hidden="true" /> {t.add}
          </button>
          <button
            className="menu-button"
            type="button"
            aria-label={t.menuLabel}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" />{t.eyebrow}</div>
            <h1>
              {t.heroTitleA}
              <span>{t.heroTitleB}</span>
            </h1>
            <p>{t.heroBody}</p>
            <div className="hero-actions">
              <button className="button button--primary" type="button" onClick={() => scrollToSection('discover')}>
                {t.explore}
                <ArrowRight aria-hidden="true" />
              </button>
              <a className="text-link" href="#rescue">
                {t.rescueCta}
                <ArrowRight aria-hidden="true" />
              </a>
            </div>
            <div className="hero-stats">
              <div><strong>{resources.length}</strong><span>{t.statResources}</span></div>
              <div><strong>3</strong><span>{t.statLanguages}</span></div>
              <div><strong>100%</strong><span>{t.statAccount}</span></div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="orbit orbit--one" />
            <div className="orbit orbit--two" />
            <div className="floating-chip floating-chip--top"><ShieldCheck aria-hidden="true" /> {t.chipChecked}</div>
            <div className="floating-chip floating-chip--bottom"><Languages aria-hidden="true" /> AR · FR · EN</div>
            <div className="study-card" id="study-path">
              <div className="study-card__top">
                <div>
                  <span className="mini-label">{t.spotlight}</span>
                  <h2>{t.spotlightTitle}</h2>
                </div>
                <span className="progress-ring">68%</span>
              </div>
              <div className="study-progress"><span /></div>
              <div className="study-steps">
                <div className="study-step study-step--done">
                  <span><Check /></span>
                  <div><strong>{t.stepRecap}</strong><small>TelmidTICE · 12 min</small></div>
                  <ShieldCheck aria-hidden="true" />
                </div>
                <div className="study-step study-step--active">
                  <span>2</span>
                  <div><strong>{t.stepSimulation}</strong><small>PhET · 18 min</small></div>
                  <Sparkles aria-hidden="true" />
                </div>
                <div className="study-step">
                  <span>3</span>
                  <div><strong>{t.stepPractice}</strong><small>Khan Academy · 15 min</small></div>
                  <FileText aria-hidden="true" />
                </div>
              </div>
              <div className="study-card__footer">
                <span><ShieldCheck aria-hidden="true" />{t.spotlightMeta}</span>
                <span>AR · FR</span>
              </div>
            </div>
          </div>
        </section>

        <LinkRescue language={language} t={t} libraryKeys={libraryKeys} onAdd={handleRescueAdd} />

        <section className="library-section" id="discover">
          <div className="section-heading">
            <div>
              <span className="section-kicker">{t.libraryKicker}</span>
              <h2>{t.searchTitle}</h2>
              <p>{t.searchBody}</p>
            </div>
            <div className="search-box">
              <Search aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.searchPlaceholder}
                aria-label={t.searchPlaceholder}
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} aria-label={t.clearSearch}><X /></button>
              )}
            </div>
          </div>

          {incoming && bannerOpen && (
            <div className="shared-banner" role="status">
              <span className="shared-banner__icon"><Inbox aria-hidden="true" /></span>
              <div className="shared-banner__text">
                <strong>{format(t.sharedBannerTitle, { count: incoming.ids.length })}</strong>
                <span>{t.sharedBannerBody}</span>
              </div>
              <div className="shared-banner__actions">
                <button className="button button--primary" type="button" onClick={saveIncoming} disabled={allIncomingSaved}>
                  {allIncomingSaved ? <Check aria-hidden="true" /> : <Bookmark aria-hidden="true" />}
                  {allIncomingSaved ? t.savedAll : t.saveAll}
                </button>
                <button
                  className="button button--ghost"
                  type="button"
                  onClick={() => {
                    setSharedOnly(false)
                    setBannerOpen(false)
                  }}
                >
                  {t.showEverything}
                </button>
              </div>
            </div>
          )}

          <div className="filter-row">
            <div className="subject-filters">
              {subjects.map((item) => (
                <button
                  type="button"
                  className={subject === item ? 'filter-pill filter-pill--active' : 'filter-pill'}
                  key={item}
                  aria-pressed={subject === item}
                  onClick={() => setSubject(item)}
                >
                  {t[subjectCopyKey[item]]}
                </button>
              ))}
            </div>
            <div className="filter-actions">
              {incoming && (
                <button
                  type="button"
                  className={sharedOnly ? 'saved-filter saved-filter--active' : 'saved-filter'}
                  aria-pressed={sharedOnly}
                  onClick={() => setSharedOnly((current) => !current)}
                >
                  <Inbox aria-hidden="true" />{t.sharedFilter}<span>{incoming.ids.length}</span>
                </button>
              )}
              <button
                type="button"
                className={savedOnly ? 'saved-filter saved-filter--active' : 'saved-filter'}
                aria-pressed={savedOnly}
                onClick={() => setSavedOnly((current) => !current)}
              >
                <Bookmark aria-hidden="true" />{t.saved}<span>{savedResources.length}</span>
              </button>
              {savedResources.length > 0 && (
                <button type="button" className="share-button" onClick={() => setShareOpen(true)}>
                  <Share2 aria-hidden="true" />{t.shareCollection}
                </button>
              )}
            </div>
          </div>

          <div className="results-meta">
            <span>{format(t.showing, { count: filtered.length })}</span>
            <span className="prototype-label"><span />{t.prototype}</span>
          </div>

          {filtered.length > 0 ? (
            <div className="resource-grid">
              {filtered.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  language={language}
                  t={t}
                  saved={savedSet.has(resource.id)}
                  onToggleSave={toggleSaved}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Search aria-hidden="true" />
              <h3>{t.empty}</h3>
              <button type="button" className="text-link" onClick={resetFilters}>{t.reset}</button>
            </div>
          )}
        </section>

        <section className="trust-section" id="trust">
          <div className="trust-intro">
            <span className="section-kicker">{t.trustKicker}</span>
            <h2>{t.trustTitle}</h2>
            <p>{t.trustBody}</p>
            <div className="trust-score-card">
              <span className="trust-score-card__icon"><ShieldCheck aria-hidden="true" /></span>
              <div><strong>{t.trustCardTitle}</strong><small>{t.trustCardBody}</small></div>
              <div className="score-dots" aria-hidden="true"><i /><i /><i /></div>
            </div>
          </div>
          <div className="trust-steps">
            <article>
              <span>01</span>
              <div className="step-icon"><Globe aria-hidden="true" /></div>
              <h3>{t.sourceTitle}</h3>
              <p>{t.sourceBody}</p>
            </article>
            <article>
              <span>02</span>
              <div className="step-icon"><Clock3 aria-hidden="true" /></div>
              <h3>{t.freshTitle}</h3>
              <p>{t.freshBody}</p>
            </article>
            <article>
              <span>03</span>
              <div className="step-icon"><Users aria-hidden="true" /></div>
              <h3>{t.communityTitle}</h3>
              <p>{t.communityBody}</p>
            </article>
          </div>
        </section>

        <section className="mission-section" id="mission">
          <div className="mission-quote">
            <Star aria-hidden="true" />
            <span>{t.missionEyebrow}</span>
            <h2>{t.missionTitle}</h2>
          </div>
          <div className="mission-content">
            <p>{t.missionBody}</p>
            <ul>
              {[t.builtFor, t.privacy, t.accessible, t.offline].map((item) => (
                <li key={item}><Check aria-hidden="true" />{item}</li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="brand brand--footer">
          <span className="brand-mark"><BookOpen aria-hidden="true" /></span>
          <span>Darsna<span className="brand-dot">.</span></span>
        </div>
        <div><strong>{t.footerLine}</strong><span>{t.disclosure}</span></div>
        <span>{t.footerEvent}</span>
      </footer>

      {modalOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setModalOpen(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="modal-close" type="button" onClick={() => setModalOpen(false)} aria-label={t.close}><X /></button>
            <span className="modal-icon"><Plus aria-hidden="true" /></span>
            <h2 id="modal-title">{t.modalTitle}</h2>
            <p>{t.modalBody}</p>
            <form onSubmit={handleSubmit}>
              <label>
                {t.titleLabel}
                <input
                  dir="auto"
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  placeholder={t.titlePlaceholder}
                />
              </label>
              <label>
                {t.urlLabel}
                <input
                  dir="ltr"
                  value={form.url}
                  onChange={(event) => setForm({ ...form, url: event.target.value })}
                  placeholder="https://…"
                  inputMode="url"
                />
              </label>
              <div className="form-row">
                <label>
                  {t.subjectLabel}
                  <select
                    value={form.subject}
                    onChange={(event) => setForm({ ...form, subject: event.target.value as ResourceSubject })}
                  >
                    {resourceSubjects.map((item) => (
                      <option value={item} key={item}>{t[subjectCopyKey[item]]}</option>
                    ))}
                  </select>
                </label>
                <label>
                  {t.languageField}
                  <select value={form.language} onChange={(event) => setForm({ ...form, language: event.target.value })}>
                    {['AR', 'FR', 'EN', 'AR · FR'].map((code) => <option key={code}>{code}</option>)}
                  </select>
                </label>
              </div>
              {error && <div className="form-error">{error}</div>}
              <div className="modal-actions">
                <button className="button button--ghost" type="button" onClick={() => setModalOpen(false)}>{t.cancel}</button>
                <button className="button button--primary" type="submit">{t.submit}<ArrowRight aria-hidden="true" /></button>
              </div>
            </form>
          </div>
        </div>
      )}

      {shareOpen && (
        <ShareDialog
          link={buildShareLink()}
          count={savedResources.length}
          t={t}
          onClose={() => setShareOpen(false)}
          onCopied={() => showNotice(t.copied)}
        />
      )}

      {notice && <div className="toast" role="status"><Check aria-hidden="true" />{notice}</div>}
    </div>
  )
}

export default App
