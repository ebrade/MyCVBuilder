export type ProfileId = 'audit' | 'security' | 'risk' | 'academic'

export type ProfileIdMap = Record<ProfileId, number>

export interface Identity {
  fullName: string
  location: string
  email: string
  phone: string
  linkedin: string
  website: string
}

export interface ProfileConfig {
  id: ProfileId
  label: string
  headline: string
  summary: string
  sectionOrder: string[]
  showProjects: boolean
  showAcademic: boolean
  showReferences: boolean
  maxBulletsByRole: Record<string, number>
  certOrder: string[]
  skillGroupOrder: string[]
}

export interface Bullet {
  id: string
  priority: ProfileIdMap
  variants: Partial<Record<ProfileId, string>> & { audit: string }
}

export interface ExperienceRole {
  id: string
  category: 'professional' | 'parttime' | 'early'
  title: string
  organization: string
  location: string
  start: string
  end: string | null
  bullets: Bullet[]
}

export interface Education {
  id: string
  institution: string
  credential: string
  location: string
  start: string
  end: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
}

export interface SkillGroup {
  label: string
  items: string[]
}

export interface Project {
  id: string
  title: string
  organization: string
  start: string
  end: string
  bullets: string[]
}

export interface Award {
  id: string
  year: string
  title: string
  organization: string
  detail: string
}

export interface Language {
  name: string
  level: string
}

export interface Reference {
  name: string
  title: string
  organization: string
  phone: string
  email: string
}

export interface AcademicBlock {
  teachingInterests: string[]
  researchInterests: string[]
  teachingExperienceNote: string
}

export interface CvData {
  identity: Identity
  profiles: Record<ProfileId, ProfileConfig>
  experience: ExperienceRole[]
  education: Education[]
  certifications: Certification[]
  skills: Record<string, SkillGroup>
  projects: Project[]
  academic: AcademicBlock
  awards: Award[]
  languages: Language[]
  references: Reference[]
}

export interface ResolvedBullet {
  id: string
  text: string
}

export interface ResolvedRole {
  id: string
  category: ExperienceRole['category']
  title: string
  organization: string
  location: string
  start: string
  end: string | null
  bullets: ResolvedBullet[]
}

export interface ResolvedCv {
  profileId: ProfileId
  identity: Identity
  headline: string
  summary: string
  sectionOrder: string[]
  skills: SkillGroup[]
  experience: {
    professional: ResolvedRole[]
    parttime: ResolvedRole[]
    early: ResolvedRole[]
  }
  certifications: Certification[]
  education: Education[]
  projects: Project[]
  academic: AcademicBlock | null
  awards: Award[]
  languages: Language[]
  references: Reference[]
  showProjects: boolean
  showAcademic: boolean
  showReferences: boolean
}
