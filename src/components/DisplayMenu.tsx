import { useEffect, useRef, useState } from 'react'
import { Accessibility } from 'lucide-react'
import type { Copy } from '../i18n'

export type DisplaySettings = { largeText: boolean; highContrast: boolean }

type DisplayMenuProps = {
  t: Copy
  settings: DisplaySettings
  onChange: (settings: DisplaySettings) => void
}

export function DisplayMenu({ t, settings, onChange }: DisplayMenuProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  const options: Array<[keyof DisplaySettings, string]> = [
    ['largeText', t.largerText],
    ['highContrast', t.highContrast],
  ]

  return (
    <div className="display-menu" ref={containerRef}>
      <button
        className="icon-button"
        type="button"
        aria-label={t.displayLabel}
        aria-expanded={open}
        aria-controls="display-panel"
        onClick={() => setOpen((current) => !current)}
      >
        <Accessibility aria-hidden="true" />
      </button>
      {open && (
        <div className="display-panel" id="display-panel" role="group" aria-label={t.displayLabel}>
          <strong>{t.displayLabel}</strong>
          {options.map(([key, label]) => (
            <button
              key={key}
              className="switch-row"
              type="button"
              role="switch"
              aria-checked={settings[key]}
              onClick={() => onChange({ ...settings, [key]: !settings[key] })}
            >
              <span>{label}</span>
              <span className="switch" aria-hidden="true"><span /></span>
            </button>
          ))}
          <p>{t.displayNote}</p>
        </div>
      )}
    </div>
  )
}
