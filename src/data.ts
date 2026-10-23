import type { Copy, Language } from './i18n'
import { classifyLink, hostOf } from './rescue'

export type Subject = 'All' | 'General' | 'Mathematics' | 'Physics' | 'Languages' | 'Computer science'
export type ResourceSubject = Exclude<Subject, 'All'>
export type Trust = 'Official source' | 'Trusted platform' | 'Not reviewed'
export type LinkWarning = 'shortened' | 'file' | 'insecure'
export type ResourceIcon = 'book' | 'formula' | 'atom' | 'code' | 'language'
export type DescriptionKey = 'suggestionDescription' | 'rescuedDescription' | 'sharedDescription'

export type Resource = {
  id: number
  title: string
  description: string
  descriptionKey?: DescriptionKey
  i18n?: Partial<Record<Language, { title: string; description: string }>>
  subject: ResourceSubject
  level?: string
  language: string
  type: string
  source: string
  href: string
  trust: Trust
  updated: string
  accent: string
  icon: ResourceIcon
  warning?: LinkWarning
}

export const subjects: Subject[] = ['All', 'General', 'Mathematics', 'Physics', 'Languages', 'Computer science']
export const resourceSubjects = subjects.filter((subject): subject is ResourceSubject => subject !== 'All')

export const subjectCopyKey: Record<Subject, keyof Copy> = {
  All: 'all',
  General: 'general',
  Mathematics: 'mathematics',
  Physics: 'physics',
  Languages: 'languagesSubject',
  'Computer science': 'computerScience',
}

export const subjectStyles: Record<ResourceSubject, { accent: string; icon: ResourceIcon }> = {
  General: { accent: '#ff6b35', icon: 'book' },
  Mathematics: { accent: '#8f4f9f', icon: 'formula' },
  Physics: { accent: '#5b5bd6', icon: 'atom' },
  Languages: { accent: '#e24a6a', icon: 'language' },
  'Computer science': { accent: '#2773c8', icon: 'code' },
}

export const seedResources: Resource[] = [
  {
    id: 1,
    title: 'TelmidTICE — National learning portal',
    description: 'Official lessons, exercises and exam preparation materials from Morocco’s education ministry.',
    i18n: {
      fr: {
        title: 'TelmidTICE — Portail national d’apprentissage',
        description: 'Cours, exercices et préparation aux examens proposés par le ministère de l’Éducation nationale.',
      },
      ar: {
        title: 'TelmidTICE — البوابة الوطنية للتعلم',
        description: 'دروس وتمارين وموارد للتحضير للامتحانات من وزارة التربية الوطنية.',
      },
    },
    subject: 'General',
    level: 'Baccalaureate',
    language: 'AR · FR',
    type: 'Course library',
    source: 'Ministry of Education',
    href: 'https://telmidtice.men.gov.ma/',
    trust: 'Official source',
    updated: 'Checked Oct 2026',
    accent: '#ff6b35',
    icon: 'book',
  },
  {
    id: 2,
    title: 'Mathematics practice with explanations',
    description: 'Algebra, functions and probability exercises with step-by-step video explanations, in French.',
    i18n: {
      fr: {
        title: 'Mathématiques : exercices expliqués',
        description: 'Exercices d’algèbre, de fonctions et de probabilités avec des explications vidéo pas à pas.',
      },
      ar: {
        title: 'تمارين رياضيات مع الشرح',
        description: 'تمارين في الجبر والدوال والاحتمالات مع شروحات بالفيديو خطوة بخطوة، باللغة الفرنسية.',
      },
    },
    subject: 'Mathematics',
    level: 'High school',
    language: 'FR',
    type: 'Exercises',
    source: 'Khan Academy',
    href: 'https://fr.khanacademy.org/math',
    trust: 'Trusted platform',
    updated: 'Checked Oct 2026',
    accent: '#2b7a67',
    icon: 'formula',
  },
  {
    id: 3,
    title: 'Interactive physics simulations',
    description: 'Explore electricity, waves and mechanics through free simulations that work in the browser.',
    i18n: {
      fr: {
        title: 'Simulations interactives de physique',
        description: 'Explorez l’électricité, les ondes et la mécanique grâce à des simulations gratuites dans le navigateur.',
      },
      ar: {
        title: 'محاكاة تفاعلية للفيزياء',
        description: 'استكشف الكهرباء والموجات والميكانيك عبر محاكاة مجانية تعمل في المتصفح.',
      },
    },
    subject: 'Physics',
    level: 'High school',
    language: 'AR · FR · EN',
    type: 'Interactive',
    source: 'PhET Colorado',
    href: 'https://phet.colorado.edu/',
    trust: 'Trusted platform',
    updated: 'Checked Oct 2026',
    accent: '#5b5bd6',
    icon: 'atom',
  },
  {
    id: 4,
    title: 'Geometry you can move',
    description: 'Build and manipulate graphs, geometry and 3D objects instead of memorizing static diagrams.',
    i18n: {
      fr: {
        title: 'La géométrie en mouvement',
        description: 'Construisez et manipulez des graphiques, des figures et des objets 3D au lieu de mémoriser des schémas.',
      },
      ar: {
        title: 'هندسة يمكنك تحريكها',
        description: 'ارسم وحرّك المنحنيات والأشكال الهندسية والمجسمات بدلاً من حفظ رسوم ثابتة.',
      },
    },
    subject: 'Mathematics',
    level: 'All high school',
    language: 'AR · FR · EN',
    type: 'Interactive',
    source: 'GeoGebra',
    href: 'https://www.geogebra.org/',
    trust: 'Trusted platform',
    updated: 'Checked Oct 2026',
    accent: '#8f4f9f',
    icon: 'formula',
  },
  {
    id: 5,
    title: 'Learn French with TV5MONDE',
    description: 'Free French lessons and exercises by level, built around real videos and news.',
    i18n: {
      fr: {
        title: 'Apprendre le français avec TV5MONDE',
        description: 'Leçons et exercices de français gratuits par niveau, à partir de vraies vidéos et d’actualités.',
      },
      ar: {
        title: 'تعلّم الفرنسية مع TV5MONDE',
        description: 'دروس وتمارين مجانية في الفرنسية حسب المستوى، مبنية على فيديوهات وأخبار حقيقية.',
      },
    },
    subject: 'Languages',
    level: 'High school',
    language: 'FR',
    type: 'Exercises',
    source: 'TV5MONDE',
    href: 'https://apprendre.tv5monde.com/fr',
    trust: 'Trusted platform',
    updated: 'Checked Oct 2026',
    accent: '#e24a6a',
    icon: 'language',
  },
  {
    id: 6,
    title: 'Computer science foundations',
    description: 'Harvard’s free introduction to algorithms, programming and how computers work.',
    i18n: {
      fr: {
        title: 'Les bases de l’informatique',
        description: 'L’introduction gratuite de Harvard aux algorithmes, à la programmation et au fonctionnement des ordinateurs.',
      },
      ar: {
        title: 'أساسيات علوم الحاسوب',
        description: 'مقدمة مجانية من جامعة هارفارد في الخوارزميات والبرمجة وطريقة عمل الحواسيب.',
      },
    },
    subject: 'Computer science',
    level: 'Beginner',
    language: 'EN',
    type: 'Course',
    source: 'CS50 · Harvard',
    href: 'https://cs50.harvard.edu/x/',
    trust: 'Trusted platform',
    updated: 'Checked Oct 2026',
    accent: '#2773c8',
    icon: 'code',
  },
  {
    id: 7,
    title: 'Arabic writing and expression guide',
    description: 'Example of a student suggestion. It stays labeled as unreviewed until a teacher or moderator checks it.',
    i18n: {
      fr: {
        title: 'Guide d’expression écrite en arabe',
        description: 'Exemple de suggestion d’élève. Elle reste « non vérifiée » jusqu’à ce qu’un enseignant ou un modérateur la contrôle.',
      },
      ar: {
        title: 'دليل التعبير والإنشاء بالعربية',
        description: 'مثال على اقتراح من طالب. يبقى «غير مراجَع» حتى يراجعه أستاذ أو مشرف.',
      },
    },
    subject: 'Languages',
    level: 'Baccalaureate',
    language: 'AR',
    type: 'Study guide',
    source: 'Demo example',
    href: '#trust',
    trust: 'Not reviewed',
    updated: 'Not yet reviewed',
    accent: '#b2762c',
    icon: 'language',
  },
  {
    id: 8,
    title: 'Physics formula revision deck',
    description: 'Example of a suggested revision checklist, shown as unreviewed until it is checked.',
    i18n: {
      fr: {
        title: 'Fiches de formules de physique',
        description: 'Exemple de fiche de révision suggérée, affichée comme non vérifiée tant qu’elle n’a pas été contrôlée.',
      },
      ar: {
        title: 'بطاقات مراجعة قوانين الفيزياء',
        description: 'مثال على ورقة مراجعة مقترحة، تظهر كغير مراجَعة إلى أن يتم فحصها.',
      },
    },
    subject: 'Physics',
    level: 'Baccalaureate',
    language: 'AR · FR',
    type: 'Revision',
    source: 'Demo example',
    href: '#study-path',
    trust: 'Not reviewed',
    updated: 'Not yet reviewed',
    accent: '#16828f',
    icon: 'atom',
  },
]

export const seedIds = new Set(seedResources.map((resource) => resource.id))

export const warningCopyKey: Record<LinkWarning, keyof Copy> = {
  shortened: 'warnShortened',
  file: 'warnFile',
  insecure: 'warnInsecure',
}

export function trustTone(trust: Trust) {
  if (trust === 'Official source') return 'official'
  if (trust === 'Trusted platform') return 'trusted'
  return 'unreviewed'
}

export function localizedText(resource: Resource, language: Language, t: Copy) {
  const translated = resource.i18n?.[language]
  if (translated) return translated
  return {
    title: resource.title,
    description: resource.descriptionKey ? t[resource.descriptionKey] : resource.description,
  }
}

type CustomResourceInput = {
  id: number
  title: string
  url: string
  subject: ResourceSubject
  language: string
  kind: 'suggested' | 'rescued' | 'shared'
}

const descriptionKeys: Record<CustomResourceInput['kind'], DescriptionKey> = {
  suggested: 'suggestionDescription',
  rescued: 'rescuedDescription',
  shared: 'sharedDescription',
}

export function createCustomResource({ id, title, url, subject, language, kind }: CustomResourceInput): Resource {
  const { trust, warning } = classifyLink(url)
  const style = subjectStyles[subject]
  return {
    id,
    title,
    description: '',
    descriptionKey: descriptionKeys[kind],
    subject,
    language,
    type: kind === 'rescued' ? 'Rescued link' : 'Suggested link',
    source: hostOf(url),
    href: url,
    trust,
    updated: kind === 'shared' ? 'Shared with you' : 'Added today',
    accent: style.accent,
    icon: style.icon,
    warning,
  }
}
