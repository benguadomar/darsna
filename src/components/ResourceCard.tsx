import type { CSSProperties } from 'react'
import { Bookmark, BookmarkCheck, Clock3, ExternalLink, FileText, Languages, ShieldCheck, TriangleAlert } from 'lucide-react'
import type { Resource } from '../data'
import { localizedText, subjectCopyKey, trustTone, warningCopyKey } from '../data'
import type { Copy, Language } from '../i18n'
import { term } from '../i18n'
import { ResourceIcon } from './ResourceIcon'

type ResourceCardProps = {
  resource: Resource
  language: Language
  t: Copy
  saved: boolean
  onToggleSave: (id: number) => void
}

export function ResourceCard({ resource, language, t, saved, onToggleSave }: ResourceCardProps) {
  const text = localizedText(resource, language, t)
  const external = resource.href.startsWith('http')

  return (
    <article className="resource-card">
      <div className="resource-card__header">
        <span className="resource-icon" style={{ '--resource-accent': resource.accent } as CSSProperties}>
          <ResourceIcon name={resource.icon} />
        </span>
        <button
          className={saved ? 'save-button save-button--active' : 'save-button'}
          type="button"
          onClick={() => onToggleSave(resource.id)}
          aria-label={saved ? t.unsave : t.save}
          aria-pressed={saved}
        >
          {saved ? <BookmarkCheck /> : <Bookmark />}
        </button>
      </div>
      <div className="resource-tags">
        <span>{t[subjectCopyKey[resource.subject]]}</span>
        {resource.level && <span>{term(language, resource.level)}</span>}
      </div>
      <h3 dir="auto">{text.title}</h3>
      <p dir="auto">{text.description}</p>
      {resource.warning && (
        <span className="chip chip--warning resource-warning">
          <TriangleAlert aria-hidden="true" />
          {t[warningCopyKey[resource.warning]]}
        </span>
      )}
      <div className="resource-meta">
        <span><Languages aria-hidden="true" />{resource.language}</span>
        <span><FileText aria-hidden="true" />{term(language, resource.type)}</span>
      </div>
      <div className="trust-row">
        <div className={`trust-badge trust-badge--${trustTone(resource.trust)}`}>
          <ShieldCheck aria-hidden="true" />
          <span>
            <strong>{term(language, resource.trust)}</strong>
            <small><bdi>{term(language, resource.source)}</bdi></small>
          </span>
        </div>
        <span className="updated"><Clock3 aria-hidden="true" />{term(language, resource.updated)}</span>
      </div>
      <a
        className="resource-link"
        href={resource.href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
      >
        {t.open}
        <ExternalLink aria-hidden="true" />
      </a>
    </article>
  )
}
