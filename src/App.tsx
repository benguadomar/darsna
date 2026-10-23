import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Check,
  ChevronDown,
  Clock3,
  ExternalLink,
  FileText,
  Globe2,
  GraduationCap,
  Languages,
  Menu,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
} from 'lucide-react'
import './App.css'

type Language = 'en' | 'fr' | 'ar'
type Subject = 'All' | 'Mathematics' | 'Physics' | 'Languages' | 'Computer science'
type Resource = {
  id: number
  title: string
  description: string
  subject: Exclude<Subject, 'All'>
  level: string
  language: string
  type: string
  source: string
  href: string
  trust: 'Official source' | 'Trusted platform' | 'Community reviewed' | 'New submission'
  checks: number
  updated: string
  accent: string
  icon: 'book' | 'formula' | 'atom' | 'code' | 'language'
}

const copy = {
  en: {
    navDiscover: 'Discover',
    navTrust: 'How trust works',
    navAbout: 'Our mission',
    add: 'Share a resource',
    eyebrow: 'Built by students, for students',
    heroTitleA: 'Good study resources.',
    heroTitleB: 'One trusted place.',
    heroBody:
      'Darsna turns scattered links, PDFs and videos into a clear, multilingual library students can actually trust.',
    explore: 'Explore resources',
    how: 'See how we verify',
    resourceCount: 'curated resources',
    languages: 'languages',
    noAccount: 'no account needed',
    spotlight: 'Today’s study path',
    spotlightTitle: 'Bac Physics · 45 min',
    spotlightMeta: '3 verified resources',
    searchTitle: 'Find what helps you learn',
    searchBody: 'Search by subject, level, language or format.',
    searchPlaceholder: 'Try “Bac physics” or “French grammar”…',
    all: 'All',
    mathematics: 'Mathematics',
    physics: 'Physics',
    languagesSubject: 'Languages',
    computerScience: 'Computer science',
    showing: 'Showing',
    resources: 'resources',
    saved: 'Saved',
    open: 'Open resource',
    save: 'Save resource',
    empty: 'No resources match those filters yet.',
    reset: 'Reset filters',
    trustEyebrow: 'A calmer way to study',
    trustTitle: 'Know why a resource deserves your time.',
    trustBody:
      'Every card shows where it came from, when it was checked and what kind of review it received. No mystery links.',
    sourceTitle: 'Source first',
    sourceBody: 'The original publisher is always visible before you open a resource.',
    freshTitle: 'Freshness check',
    freshBody: 'Outdated or broken materials are flagged instead of silently staying in the library.',
    communityTitle: 'Community context',
    communityBody: 'Students can suggest resources; transparent review labels prevent false authority.',
    missionEyebrow: 'Why Darsna',
    missionTitle: 'A small fix for a problem we see every school week.',
    missionBody:
      'Useful study material is spread across WhatsApp chats, old Drive folders and websites in different languages. Links get lost and students cannot quickly tell what is current or credible. Darsna makes the path visible.',
    builtFor: 'Designed for Moroccan high-school students',
    privacy: 'Favorites stay on your device',
    accessible: 'Arabic, French and English interface',
    modalTitle: 'Suggest a resource',
    modalBody: 'Add a useful link. In this prototype, submissions stay on your device.',
    titleLabel: 'Resource title',
    urlLabel: 'Resource URL',
    subjectLabel: 'Subject',
    languageLabel: 'Language',
    cancel: 'Cancel',
    submit: 'Add suggestion',
    added: 'Resource added to your library.',
    required: 'Please add a title and a valid URL.',
    prototype: 'Hackathon prototype',
    footerLine: 'Learning should feel clear, not scattered.',
    disclosure: 'Built with React, TypeScript and Cursor. AI assistance disclosed.',
  },
  fr: {
    navDiscover: 'Découvrir',
    navTrust: 'Notre méthode',
    navAbout: 'Notre mission',
    add: 'Partager une ressource',
    eyebrow: 'Créé par des élèves, pour les élèves',
    heroTitleA: 'De bonnes ressources.',
    heroTitleB: 'Un seul endroit fiable.',
    heroBody:
      'Darsna transforme les liens, PDF et vidéos dispersés en une bibliothèque claire, multilingue et vérifiable.',
    explore: 'Explorer les ressources',
    how: 'Voir notre méthode',
    resourceCount: 'ressources sélectionnées',
    languages: 'langues',
    noAccount: 'sans compte',
    spotlight: 'Parcours du jour',
    spotlightTitle: 'Physique Bac · 45 min',
    spotlightMeta: '3 ressources vérifiées',
    searchTitle: 'Trouvez ce qui vous aide à apprendre',
    searchBody: 'Recherchez par matière, niveau, langue ou format.',
    searchPlaceholder: 'Essayez « physique Bac » ou « grammaire »…',
    all: 'Tout',
    mathematics: 'Mathématiques',
    physics: 'Physique',
    languagesSubject: 'Langues',
    computerScience: 'Informatique',
    showing: 'Affichage de',
    resources: 'ressources',
    saved: 'Enregistrées',
    open: 'Ouvrir',
    save: 'Enregistrer',
    empty: 'Aucune ressource ne correspond à ces filtres.',
    reset: 'Réinitialiser',
    trustEyebrow: 'Une façon plus sereine d’étudier',
    trustTitle: 'Sachez pourquoi une ressource mérite votre temps.',
    trustBody:
      'Chaque fiche indique sa source, sa date de vérification et son niveau de confiance.',
    sourceTitle: 'La source d’abord',
    sourceBody: 'L’éditeur original est toujours visible avant d’ouvrir une ressource.',
    freshTitle: 'Contenu à jour',
    freshBody: 'Les liens obsolètes ou cassés sont signalés au lieu de rester cachés.',
    communityTitle: 'Contexte communautaire',
    communityBody: 'Les élèves proposent; des labels transparents évitent la fausse autorité.',
    missionEyebrow: 'Pourquoi Darsna',
    missionTitle: 'Une solution simple à un problème vécu chaque semaine.',
    missionBody:
      'Les ressources utiles sont dispersées entre WhatsApp, Drive et des sites en plusieurs langues. Les liens se perdent et leur fiabilité reste floue. Darsna rend le parcours visible.',
    builtFor: 'Pensé pour les lycéens marocains',
    privacy: 'Les favoris restent sur votre appareil',
    accessible: 'Interface arabe, française et anglaise',
    modalTitle: 'Proposer une ressource',
    modalBody: 'Ajoutez un lien utile. Dans ce prototype, il reste sur votre appareil.',
    titleLabel: 'Titre',
    urlLabel: 'Adresse URL',
    subjectLabel: 'Matière',
    languageLabel: 'Langue',
    cancel: 'Annuler',
    submit: 'Ajouter',
    added: 'Ressource ajoutée à votre bibliothèque.',
    required: 'Ajoutez un titre et une URL valide.',
    prototype: 'Prototype de hackathon',
    footerLine: 'Apprendre doit être clair, pas dispersé.',
    disclosure: 'Créé avec React, TypeScript et Cursor. Assistance IA déclarée.',
  },
  ar: {
    navDiscover: 'استكشف',
    navTrust: 'كيف نتحقق',
    navAbout: 'مهمتنا',
    add: 'شارك مورداً',
    eyebrow: 'من الطلاب، للطلاب',
    heroTitleA: 'موارد دراسية جيدة.',
    heroTitleB: 'في مكان واحد موثوق.',
    heroBody:
      'تحوّل درسنا الروابط والملفات والفيديوهات المتناثرة إلى مكتبة واضحة ومتعددة اللغات يمكن للطلاب الوثوق بها.',
    explore: 'استكشف الموارد',
    how: 'كيف نتحقق',
    resourceCount: 'موارد منتقاة',
    languages: 'لغات',
    noAccount: 'دون حساب',
    spotlight: 'مسار اليوم',
    spotlightTitle: 'فيزياء الباك · 45 دقيقة',
    spotlightMeta: '3 موارد موثقة',
    searchTitle: 'اعثر على ما يساعدك على التعلم',
    searchBody: 'ابحث حسب المادة أو المستوى أو اللغة أو النوع.',
    searchPlaceholder: 'جرّب «فيزياء الباك» أو «قواعد الفرنسية»…',
    all: 'الكل',
    mathematics: 'الرياضيات',
    physics: 'الفيزياء',
    languagesSubject: 'اللغات',
    computerScience: 'المعلوميات',
    showing: 'نعرض',
    resources: 'موارد',
    saved: 'المحفوظة',
    open: 'افتح المورد',
    save: 'احفظ المورد',
    empty: 'لا توجد موارد مطابقة لهذه الفلاتر.',
    reset: 'إعادة الضبط',
    trustEyebrow: 'طريقة أهدأ للدراسة',
    trustTitle: 'اعرف لماذا يستحق المورد وقتك.',
    trustBody:
      'تُظهر كل بطاقة المصدر وتاريخ الفحص ونوع المراجعة. لا مزيد من الروابط الغامضة.',
    sourceTitle: 'المصدر أولاً',
    sourceBody: 'يظهر الناشر الأصلي دائماً قبل فتح أي مورد.',
    freshTitle: 'فحص الحداثة',
    freshBody: 'نوضح المواد القديمة أو الروابط المعطلة بدلاً من تركها في المكتبة.',
    communityTitle: 'سياق المجتمع',
    communityBody: 'يقترح الطلاب الموارد وتمنع علامات المراجعة الواضحة الادعاءات الزائفة.',
    missionEyebrow: 'لماذا درسنا؟',
    missionTitle: 'حل صغير لمشكلة نعيشها كل أسبوع دراسي.',
    missionBody:
      'تتوزع المواد المفيدة بين محادثات واتساب ومجلدات Drive القديمة ومواقع بلغات مختلفة. تضيع الروابط ويصعب معرفة ما هو حديث وموثوق. درسنا تجعل الطريق واضحاً.',
    builtFor: 'مصممة لطلاب الثانوي في المغرب',
    privacy: 'تبقى المفضلة على جهازك',
    accessible: 'واجهة عربية وفرنسية وإنجليزية',
    modalTitle: 'اقترح مورداً',
    modalBody: 'أضف رابطاً مفيداً. في هذا النموذج، يبقى الاقتراح على جهازك.',
    titleLabel: 'عنوان المورد',
    urlLabel: 'رابط المورد',
    subjectLabel: 'المادة',
    languageLabel: 'اللغة',
    cancel: 'إلغاء',
    submit: 'أضف الاقتراح',
    added: 'تمت إضافة المورد إلى مكتبتك.',
    required: 'أضف عنواناً ورابطاً صحيحاً.',
    prototype: 'نموذج الهاكاثون',
    footerLine: 'يجب أن يكون التعلم واضحاً، لا مبعثراً.',
    disclosure: 'بُني باستخدام React وTypeScript وCursor مع التصريح بمساعدة الذكاء الاصطناعي.',
  },
} as const

const subjects: Subject[] = ['All', 'Mathematics', 'Physics', 'Languages', 'Computer science']

const seedResources: Resource[] = [
  {
    id: 1,
    title: 'TelmidTICE — National learning portal',
    description: 'Official lessons, exercises and exam preparation materials from Morocco’s education ministry.',
    subject: 'Mathematics',
    level: 'Baccalaureate',
    language: 'AR · FR',
    type: 'Course library',
    source: 'Ministry of Education',
    href: 'https://telmidtice.men.gov.ma/',
    trust: 'Official source',
    checks: 3,
    updated: 'Checked Oct 2026',
    accent: '#ff6b35',
    icon: 'book',
  },
  {
    id: 2,
    title: 'Bac mathematics practice path',
    description: 'A focused set of algebra, functions and probability exercises with step-by-step explanations.',
    subject: 'Mathematics',
    level: 'Baccalaureate',
    language: 'FR',
    type: 'Exercises',
    source: 'Khan Academy',
    href: 'https://fr.khanacademy.org/math',
    trust: 'Trusted platform',
    checks: 3,
    updated: 'Checked Oct 2026',
    accent: '#2b7a67',
    icon: 'formula',
  },
  {
    id: 3,
    title: 'Interactive physics simulations',
    description: 'Explore electricity, waves and mechanics through free simulations that work in the browser.',
    subject: 'Physics',
    level: 'High school',
    language: 'AR · FR · EN',
    type: 'Interactive',
    source: 'PhET Colorado',
    href: 'https://phet.colorado.edu/',
    trust: 'Trusted platform',
    checks: 3,
    updated: 'Checked Oct 2026',
    accent: '#5b5bd6',
    icon: 'atom',
  },
  {
    id: 4,
    title: 'Geometry you can move',
    description: 'Build and manipulate graphs, geometry and 3D objects instead of memorizing static diagrams.',
    subject: 'Mathematics',
    level: 'All high school',
    language: 'AR · FR · EN',
    type: 'Interactive',
    source: 'GeoGebra',
    href: 'https://www.geogebra.org/',
    trust: 'Trusted platform',
    checks: 3,
    updated: 'Checked Oct 2026',
    accent: '#8f4f9f',
    icon: 'formula',
  },
  {
    id: 5,
    title: 'French grammar essentials',
    description: 'Short reference lessons for verb agreement, sentence structure and common writing mistakes.',
    subject: 'Languages',
    level: 'High school',
    language: 'FR',
    type: 'Reference',
    source: 'TV5MONDE',
    href: 'https://apprendre.tv5monde.com/fr',
    trust: 'Trusted platform',
    checks: 3,
    updated: 'Checked Oct 2026',
    accent: '#e24a6a',
    icon: 'language',
  },
  {
    id: 6,
    title: 'Computer science foundations',
    description: 'A visual introduction to algorithms, programming concepts and how the internet works.',
    subject: 'Computer science',
    level: 'Beginner',
    language: 'EN',
    type: 'Course',
    source: 'CS50 · Harvard',
    href: 'https://cs50.harvard.edu/x/',
    trust: 'Trusted platform',
    checks: 3,
    updated: 'Checked Oct 2026',
    accent: '#2773c8',
    icon: 'code',
  },
  {
    id: 7,
    title: 'Arabic writing and expression guide',
    description: 'Example of a student suggestion. It stays labeled as unreviewed until a teacher or moderator checks it.',
    subject: 'Languages',
    level: 'Baccalaureate',
    language: 'AR',
    type: 'Study guide',
    source: 'Demo example',
    href: '#trust',
    trust: 'New submission',
    checks: 1,
    updated: 'Not yet reviewed',
    accent: '#b2762c',
    icon: 'language',
  },
  {
    id: 8,
    title: 'Physics formula revision deck',
    description: 'Example of a suggested revision checklist for mechanics, electricity and waves, shown as unreviewed until it is checked.',
    subject: 'Physics',
    level: 'Baccalaureate',
    language: 'AR · FR',
    type: 'Revision',
    source: 'Demo example',
    href: '#study-path',
    trust: 'New submission',
    checks: 1,
    updated: 'Not yet reviewed',
    accent: '#16828f',
    icon: 'atom',
  },
]

function ResourceIcon({ name }: { name: Resource['icon'] }) {
  if (name === 'atom') return <Sparkles aria-hidden="true" />
  if (name === 'code') return <FileText aria-hidden="true" />
  if (name === 'language') return <Languages aria-hidden="true" />
  if (name === 'formula') return <GraduationCap aria-hidden="true" />
  return <BookOpen aria-hidden="true" />
}

function App() {
  const [language, setLanguage] = useState<Language>('en')
  const [query, setQuery] = useState('')
  const [subject, setSubject] = useState<Subject>('All')
  const [savedOnly, setSavedOnly] = useState(false)
  const [saved, setSaved] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('darsna-saved') || '[]')
    } catch {
      return []
    }
  })
  const [resources, setResources] = useState(seedResources)
  const [menuOpen, setMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    url: '',
    subject: 'Mathematics' as Exclude<Subject, 'All'>,
    language: 'AR · FR',
  })
  const t = copy[language]

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
  }, [language])

  useEffect(() => {
    localStorage.setItem('darsna-saved', JSON.stringify(saved))
  }, [saved])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return resources.filter((resource) => {
      const matchesSubject = subject === 'All' || resource.subject === subject
      const matchesSaved = !savedOnly || saved.includes(resource.id)
      const haystack =
        `${resource.title} ${resource.description} ${resource.subject} ${resource.level} ${resource.language} ${resource.type}`.toLowerCase()
      return matchesSubject && matchesSaved && (!normalized || haystack.includes(normalized))
    })
  }, [query, resources, saved, savedOnly, subject])

  const subjectLabel = (item: Subject) => {
    const labels: Record<Subject, string> = {
      All: t.all,
      Mathematics: t.mathematics,
      Physics: t.physics,
      Languages: t.languagesSubject,
      'Computer science': t.computerScience,
    }
    return labels[item]
  }

  const toggleSaved = (id: number) => {
    setSaved((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    try {
      new URL(form.url)
    } catch {
      setError(t.required)
      return
    }
    if (!form.title.trim()) {
      setError(t.required)
      return
    }

    const newResource: Resource = {
      id: Date.now(),
      title: form.title.trim(),
      description: 'A student suggestion waiting for community review and source verification.',
      subject: form.subject,
      level: 'High school',
      language: form.language,
      type: 'Suggested link',
      source: 'Your device',
      href: form.url,
      trust: 'New submission',
      checks: 1,
      updated: 'Added today',
      accent: '#5b5bd6',
      icon: 'book',
    }
    setResources((current) => [newResource, ...current])
    setSaved((current) => [...current, newResource.id])
    setForm({ title: '', url: '', subject: 'Mathematics', language: 'AR · FR' })
    setModalOpen(false)
    setNotice(t.added)
    window.setTimeout(() => setNotice(''), 3200)
  }

  const scrollToLibrary = () => {
    document.getElementById('discover')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Darsna home">
          <span className="brand-mark"><BookOpen aria-hidden="true" /></span>
          <span>Darsna<span className="brand-dot">.</span></span>
        </a>

        <nav className={menuOpen ? 'nav-links nav-links--open' : 'nav-links'} aria-label="Main navigation">
          <a href="#discover" onClick={() => setMenuOpen(false)}>{t.navDiscover}</a>
          <a href="#trust" onClick={() => setMenuOpen(false)}>{t.navTrust}</a>
          <a href="#mission" onClick={() => setMenuOpen(false)}>{t.navAbout}</a>
        </nav>

        <div className="header-actions">
          <label className="language-picker">
            <Globe2 aria-hidden="true" />
            <span className="sr-only">Interface language</span>
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
            aria-label="Toggle navigation"
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
              <button className="button button--primary" type="button" onClick={scrollToLibrary}>
                {t.explore}<ArrowRight aria-hidden="true" />
              </button>
              <a className="text-link" href="#trust">{t.how}<ArrowRight aria-hidden="true" /></a>
            </div>
            <div className="hero-stats" aria-label="Prototype statistics">
              <div><strong>{resources.length}</strong><span>{t.resourceCount}</span></div>
              <div><strong>3</strong><span>{t.languages}</span></div>
              <div><strong>100%</strong><span>{t.noAccount}</span></div>
            </div>
          </div>

          <div className="hero-visual" aria-label="Example Darsna study path">
            <div className="orbit orbit--one" />
            <div className="orbit orbit--two" />
            <div className="floating-chip floating-chip--top"><ShieldCheck /> Source checked</div>
            <div className="floating-chip floating-chip--bottom"><Languages /> AR · FR · EN</div>
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
                  <div><strong>Concept recap</strong><small>TelmidTICE · 12 min</small></div>
                  <ShieldCheck />
                </div>
                <div className="study-step study-step--active">
                  <span>2</span>
                  <div><strong>Interactive simulation</strong><small>PhET · 18 min</small></div>
                  <Sparkles />
                </div>
                <div className="study-step">
                  <span>3</span>
                  <div><strong>Exam practice</strong><small>Curated set · 15 min</small></div>
                  <FileText />
                </div>
              </div>
              <div className="study-card__footer">
                <div className="avatar-stack"><i>Y</i><i>S</i><i>M</i></div>
                <span>{t.spotlightMeta}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="library-section" id="discover">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Darsna library / 01</span>
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
              {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search"><X /></button>}
            </div>
          </div>

          <div className="filter-row">
            <div className="subject-filters" aria-label="Filter by subject">
              {subjects.map((item) => (
                <button
                  type="button"
                  className={subject === item ? 'filter-pill filter-pill--active' : 'filter-pill'}
                  key={item}
                  onClick={() => setSubject(item)}
                >
                  {subjectLabel(item)}
                </button>
              ))}
            </div>
            <button
              type="button"
              className={savedOnly ? 'saved-filter saved-filter--active' : 'saved-filter'}
              onClick={() => setSavedOnly((current) => !current)}
            >
              <Bookmark aria-hidden="true" />{t.saved}<span>{saved.length}</span>
            </button>
          </div>

          <div className="results-meta">
            <span>{t.showing} <strong>{filtered.length}</strong> {t.resources}</span>
            <span className="prototype-label"><span />{t.prototype}</span>
          </div>

          {filtered.length > 0 ? (
            <div className="resource-grid">
              {filtered.map((resource) => {
                const isSaved = saved.includes(resource.id)
                return (
                  <article className="resource-card" key={resource.id}>
                    <div className="resource-card__header">
                      <span className="resource-icon" style={{ '--resource-accent': resource.accent } as React.CSSProperties}>
                        <ResourceIcon name={resource.icon} />
                      </span>
                      <button
                        className={isSaved ? 'save-button save-button--active' : 'save-button'}
                        type="button"
                        onClick={() => toggleSaved(resource.id)}
                        aria-label={t.save}
                      >
                        {isSaved ? <BookmarkCheck /> : <Bookmark />}
                      </button>
                    </div>
                    <div className="resource-tags">
                      <span>{subjectLabel(resource.subject)}</span>
                      <span>{resource.level}</span>
                    </div>
                    <h3>{resource.title}</h3>
                    <p>{resource.description}</p>
                    <div className="resource-meta">
                      <span><Languages />{resource.language}</span>
                      <span><FileText />{resource.type}</span>
                    </div>
                    <div className="trust-row">
                      <div className={`trust-badge trust-badge--${resource.checks}`}>
                        <ShieldCheck />
                        <span><strong>{resource.trust}</strong><small>{resource.source}</small></span>
                      </div>
                      <span className="updated"><Clock3 />{resource.updated}</span>
                    </div>
                    <a className="resource-link" href={resource.href} target={resource.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                      {t.open}<ExternalLink aria-hidden="true" />
                    </a>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="empty-state">
              <Search />
              <h3>{t.empty}</h3>
              <button type="button" className="text-link" onClick={() => { setQuery(''); setSubject('All'); setSavedOnly(false) }}>{t.reset}</button>
            </div>
          )}
        </section>

        <section className="trust-section" id="trust">
          <div className="trust-intro">
            <span className="section-kicker">{t.trustEyebrow} / 02</span>
            <h2>{t.trustTitle}</h2>
            <p>{t.trustBody}</p>
            <div className="trust-score-card">
              <span className="trust-score-card__icon"><ShieldCheck /></span>
              <div><strong>3 / 3</strong><small>Transparent checks passed</small></div>
              <div className="score-dots"><i /><i /><i /></div>
            </div>
          </div>
          <div className="trust-steps">
            <article>
              <span>01</span>
              <div className="step-icon"><Globe2 /></div>
              <h3>{t.sourceTitle}</h3>
              <p>{t.sourceBody}</p>
            </article>
            <article>
              <span>02</span>
              <div className="step-icon"><Clock3 /></div>
              <h3>{t.freshTitle}</h3>
              <p>{t.freshBody}</p>
            </article>
            <article>
              <span>03</span>
              <div className="step-icon"><Users /></div>
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
              <li><Check />{t.builtFor}</li>
              <li><Check />{t.privacy}</li>
              <li><Check />{t.accessible}</li>
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
        <span>Neighborhood Hacks · 2026</span>
      </footer>

      {modalOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setModalOpen(false)}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setModalOpen(false)} aria-label="Close"><X /></button>
            <span className="modal-icon"><Plus /></span>
            <h2 id="modal-title">{t.modalTitle}</h2>
            <p>{t.modalBody}</p>
            <form onSubmit={handleSubmit}>
              <label>{t.titleLabel}<input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="e.g. Bac chemistry exercises" /></label>
              <label>{t.urlLabel}<input value={form.url} onChange={(event) => setForm({ ...form, url: event.target.value })} placeholder="https://…" inputMode="url" /></label>
              <div className="form-row">
                <label>{t.subjectLabel}
                  <select value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value as Exclude<Subject, 'All'> })}>
                    {subjects.slice(1).map((item) => <option value={item} key={item}>{subjectLabel(item)}</option>)}
                  </select>
                </label>
                <label>{t.languageLabel}
                  <select value={form.language} onChange={(event) => setForm({ ...form, language: event.target.value })}>
                    <option>AR</option><option>FR</option><option>EN</option><option>AR · FR</option>
                  </select>
                </label>
              </div>
              {error && <div className="form-error">{error}</div>}
              <div className="modal-actions">
                <button className="button button--ghost" type="button" onClick={() => setModalOpen(false)}>{t.cancel}</button>
                <button className="button button--primary" type="submit">{t.submit}<ArrowRight /></button>
              </div>
            </form>
          </div>
        </div>
      )}

      {notice && <div className="toast" role="status"><Check />{notice}</div>}
    </div>
  )
}

export default App
