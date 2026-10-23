import { useState } from 'react'
import type { CSSProperties } from 'react'
import {
  ArrowRight,
  Check,
  ClipboardPaste,
  Eraser,
  Info,
  Library,
  Link2,
  Repeat2,
  Search,
  ShieldCheck,
  TriangleAlert,
  WandSparkles,
} from 'lucide-react'
import { subjectCopyKey, subjectStyles, trustTone, warningCopyKey } from '../data'
import type { Copy, Language } from '../i18n'
import { format, term } from '../i18n'
import type { RescuedLink, RescueResult } from '../rescue'
import { EXAMPLE_CHAT, extractLinks } from '../rescue'
import { ResourceIcon } from './ResourceIcon'

type LinkRescueProps = {
  language: Language
  t: Copy
  libraryKeys: Set<string>
  onAdd: (links: RescuedLink[]) => void
}

export function LinkRescue({ language, t, libraryKeys, onAdd }: LinkRescueProps) {
  const [text, setText] = useState('')
  const [result, setResult] = useState<RescueResult | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [isExample, setIsExample] = useState(false)

  const rescue = () => {
    const next = extractLinks(text)
    setResult(next)
    setSelected(new Set(next.links.filter((link) => link.warning !== 'shortened').map((link) => link.key)))
  }

  const loadExample = () => {
    setText(EXAMPLE_CHAT)
    setIsExample(true)
    setResult(null)
  }

  const clear = () => {
    setText('')
    setResult(null)
    setSelected(new Set())
    setIsExample(false)
  }

  const toggle = (key: string) => {
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const add = () => {
    if (!result) return
    onAdd(result.links.filter((link) => selected.has(link.key)))
    clear()
  }

  const official = result?.links.filter((link) => link.trust === 'Official source').length ?? 0

  return (
    <section className="rescue-section" id="rescue">
      <div className="rescue-intro">
        <span className="section-kicker">{t.rescueKicker}</span>
        <h2>{t.rescueTitle}</h2>
        <p>{t.rescueBody}</p>
        <div className="rescue-form">
          <label htmlFor="rescue-input">{t.rescueLabel}</label>
          <textarea
            id="rescue-input"
            dir="auto"
            value={text}
            spellCheck={false}
            placeholder={t.rescuePlaceholder}
            onChange={(event) => {
              setText(event.target.value)
              setIsExample(false)
            }}
          />
          {isExample && (
            <p className="example-note">
              <Info aria-hidden="true" />
              {t.exampleNote}
            </p>
          )}
          <div className="rescue-actions">
            <button className="button button--primary" type="button" onClick={rescue} disabled={!text.trim()}>
              <WandSparkles aria-hidden="true" />
              {t.rescueRun}
            </button>
            <button className="button button--ghost" type="button" onClick={loadExample}>
              <ClipboardPaste aria-hidden="true" />
              {t.rescueExample}
            </button>
            {(text || result) && (
              <button className="text-link" type="button" onClick={clear}>
                <Eraser aria-hidden="true" />
                {t.rescueClear}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="rescue-panel" aria-live="polite">
        {!result && (
          <div className="rescue-empty">
            <Link2 aria-hidden="true" />
            <h3>{t.rescueEmptyTitle}</h3>
            <p>{t.rescueEmptyBody}</p>
          </div>
        )}

        {result && result.links.length === 0 && (
          <div className="rescue-empty">
            <Search aria-hidden="true" />
            <h3>{t.rescueNone}</h3>
          </div>
        )}

        {result && result.links.length > 0 && (
          <>
            <div className="rescue-stats">
              <div><strong>{result.links.length}</strong><span>{t.statFound}</span></div>
              <div><strong>{result.duplicates}</strong><span>{t.statDuplicates}</span></div>
              <div><strong>{official}</strong><span>{t.statOfficial}</span></div>
            </div>
            <ul className="rescued-list">
              {result.links.map((link) => {
                const isSelected = selected.has(link.key)
                const style = subjectStyles[link.subject]
                return (
                  <li key={link.key} className={isSelected ? 'rescued-item rescued-item--selected' : 'rescued-item'}>
                    <label className="rescued-toggle">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggle(link.key)}
                        aria-label={`${t.selectLink}: ${link.title}`}
                      />
                      <span className="rescued-box" aria-hidden="true"><Check /></span>
                    </label>
                    <span
                      className="resource-icon resource-icon--small"
                      style={{ '--resource-accent': style.accent } as CSSProperties}
                    >
                      <ResourceIcon name={style.icon} />
                    </span>
                    <div className="rescued-body">
                      <strong dir="auto">{link.title}</strong>
                      <span className="rescued-meta">
                        <bdi>{link.host}</bdi> · {t[subjectCopyKey[link.subject]]} · {link.language}
                      </span>
                      <div className="rescued-tags">
                        <span className={`chip chip--${trustTone(link.trust)}`}>
                          <ShieldCheck aria-hidden="true" />
                          {term(language, link.trust)}
                        </span>
                        {link.count > 1 && (
                          <span className="chip chip--count">
                            <Repeat2 aria-hidden="true" />
                            {format(t.sharedTimes, { count: link.count })}
                          </span>
                        )}
                        {link.warning && (
                          <span className="chip chip--warning">
                            <TriangleAlert aria-hidden="true" />
                            {t[warningCopyKey[link.warning]]}
                          </span>
                        )}
                        {libraryKeys.has(link.key) && (
                          <span className="chip chip--library">
                            <Library aria-hidden="true" />
                            {t.inLibrary}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
            <div className="rescue-footer">
              <button className="button button--primary" type="button" onClick={add} disabled={selected.size === 0}>
                {format(t.rescueAdd, { count: selected.size })}
                <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
