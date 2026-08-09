import type {
  Bullet,
  Certification,
  CvData,
  ExperienceRole,
  ProfileId,
  Reference,
} from '../types'
import { PROFILE_IDS } from './buildCv'

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

const defaultPriority = (): Record<ProfileId, number> => ({
  audit: 1,
  security: 1,
  risk: 1,
  academic: 1,
})

export function createBullet(text = 'What you delivered, and the result.'): Bullet {
  const id = uid('bullet')
  return {
    id,
    priority: defaultPriority(),
    variants: {
      audit: text,
      security: text,
      risk: text,
      academic: text,
    },
  }
}

export function createRole(
  category: ExperienceRole['category'] = 'professional',
): ExperienceRole {
  return {
    id: uid('role'),
    category,
    title: 'New Position Title',
    organization: 'Organization',
    location: 'City, Country',
    start: new Date().toISOString().slice(0, 7),
    end: null,
    bullets: [createBullet()],
  }
}

export function createCertification(): Certification {
  return {
    id: uid('cert'),
    name: 'New Certification',
    issuer: 'Issuing Body',
  }
}

export function createReference(): Reference {
  return {
    name: 'Full Name',
    title: 'Title',
    organization: 'Organization',
    phone: '',
    email: '',
  }
}

/** Register max bullets for a new role across all profiles */
export function withNewRole(data: CvData, role: ExperienceRole, maxBullets = 4): CvData {
  const profiles = { ...data.profiles }
  for (const id of PROFILE_IDS) {
    profiles[id] = {
      ...profiles[id],
      maxBulletsByRole: {
        ...profiles[id].maxBulletsByRole,
        [role.id]: maxBullets,
      },
    }
  }
  return {
    ...data,
    profiles,
    experience: [role, ...data.experience],
  }
}

export function withNewCertification(data: CvData, cert: Certification): CvData {
  const profiles = { ...data.profiles }
  for (const id of PROFILE_IDS) {
    profiles[id] = {
      ...profiles[id],
      certOrder: [cert.id, ...profiles[id].certOrder],
    }
  }
  return {
    ...data,
    profiles,
    certifications: [cert, ...data.certifications],
  }
}

export function setShowReferences(
  data: CvData,
  profileId: ProfileId,
  show: boolean,
): CvData {
  const profile = data.profiles[profileId]
  let sectionOrder = [...profile.sectionOrder]
  if (show && !sectionOrder.includes('references')) {
    sectionOrder = [...sectionOrder, 'references']
  }
  if (!show) {
    sectionOrder = sectionOrder.filter((s) => s !== 'references')
  }
  return {
    ...data,
    profiles: {
      ...data.profiles,
      [profileId]: {
        ...profile,
        showReferences: show,
        sectionOrder,
      },
    },
  }
}

export function updateBulletText(
  role: ExperienceRole,
  bulletId: string,
  profileId: ProfileId,
  text: string,
  applyAllProfiles: boolean,
): ExperienceRole {
  return {
    ...role,
    bullets: role.bullets.map((b) => {
      if (b.id !== bulletId) return b
      if (applyAllProfiles) {
        return {
          ...b,
          variants: {
            audit: text,
            security: text,
            risk: text,
            academic: text,
          },
        }
      }
      return {
        ...b,
        variants: { ...b.variants, [profileId]: text, audit: b.variants.audit ?? text },
      }
    }),
  }
}
