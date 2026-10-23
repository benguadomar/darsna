import { useRef } from 'react'
import { Copy as CopyIcon, MessageCircle, Share2, X } from 'lucide-react'
import type { Copy } from '../i18n'
import { format } from '../i18n'

type ShareDialogProps = {
  link: string
  count: number
  t: Copy
  onClose: () => void
  onCopied: () => void
}

export function ShareDialog({ link, count, t, onClose, onCopied }: ShareDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${t.whatsappMessage} ${link}`)}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link)
      onCopied()
    } catch {
      inputRef.current?.select()
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" type="button" onClick={onClose} aria-label={t.close}><X /></button>
        <span className="modal-icon"><Share2 aria-hidden="true" /></span>
        <h2 id="share-title">{t.shareTitle}</h2>
        <p>{format(t.shareBody, { count })}</p>
        <label className="share-field">
          {t.shareLinkLabel}
          <input ref={inputRef} readOnly value={link} dir="ltr" onFocus={(event) => event.currentTarget.select()} />
        </label>
        <div className="modal-actions">
          <button className="button button--ghost" type="button" onClick={copyLink}>
            <CopyIcon aria-hidden="true" />
            {t.copyLink}
          </button>
          <a className="button button--whatsapp" href={whatsappHref} target="_blank" rel="noreferrer">
            <MessageCircle aria-hidden="true" />
            {t.shareWhatsApp}
          </a>
        </div>
      </div>
    </div>
  )
}
