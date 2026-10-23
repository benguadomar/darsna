import { Atom, BookOpen, Calculator, Code, Languages } from 'lucide-react'
import type { ResourceIcon as ResourceIconName } from '../data'

export function ResourceIcon({ name }: { name: ResourceIconName }) {
  if (name === 'atom') return <Atom aria-hidden="true" />
  if (name === 'code') return <Code aria-hidden="true" />
  if (name === 'language') return <Languages aria-hidden="true" />
  if (name === 'formula') return <Calculator aria-hidden="true" />
  return <BookOpen aria-hidden="true" />
}
