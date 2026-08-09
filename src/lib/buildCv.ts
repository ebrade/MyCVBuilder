import type {
  CvData,
  ProfileId,
  ResolvedCv,
  ResolvedRole,
  ExperienceRole,
} from '../types'

function formatPeriod(start: string, end: string | null): string {
  const fmt = (value: string) => {
    if (/^\d{4}$/.test(value)) return value
    const [y, m] = value.split('-')
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    const mi = Number(m) - 1
    if (!m || Number.isNaN(mi)) return y
    return `${months[mi]} ${y}`
  }
  return `${fmt(start)} – ${end ? fmt(end) : 'Present'}`
}

function resolveRole(role: ExperienceRole, profileId: ProfileId, maxBullets: number): ResolvedRole {
  const sorted = [...role.bullets].sort(
    (a, b) => (a.priority[profileId] ?? 99) - (b.priority[profileId] ?? 99),
  )

  const bullets = sorted.slice(0, maxBullets).map((b) => ({
    id: b.id,
    text: b.variants[profileId] ?? b.variants.audit,
  }))

  return {
    id: role.id,
    category: role.category,
    title: role.title,
    organization: role.organization,
    location: role.location,
    start: role.start,
    end: role.end,
    bullets,
  }
}

export function buildCv(data: CvData, profileId: ProfileId): ResolvedCv {
  const profile = data.profiles[profileId]

  const resolveCategory = (category: ExperienceRole['category']) =>
    data.experience
      .filter((r) => r.category === category)
      .map((role) =>
        resolveRole(role, profileId, profile.maxBulletsByRole[role.id] ?? 3),
      )

  const certMap = new Map(data.certifications.map((c) => [c.id, c]))
  const certifications = profile.certOrder
    .map((id) => certMap.get(id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))

  const skills = profile.skillGroupOrder
    .map((key) => data.skills[key])
    .filter(Boolean)

  // Ensure references appear when enabled, even if older data omitted them from sectionOrder
  let sectionOrder = [...profile.sectionOrder]
  if (profile.showReferences && !sectionOrder.includes('references')) {
    sectionOrder = [...sectionOrder, 'references']
  }
  if (!profile.showReferences) {
    sectionOrder = sectionOrder.filter((s) => s !== 'references')
  }

  // Include any certs not listed in certOrder (e.g. newly added)
  const orderedCertIds = new Set(profile.certOrder)
  const extraCerts = data.certifications.filter((c) => !orderedCertIds.has(c.id))
  const allCerts = [...certifications, ...extraCerts]

  return {
    profileId,
    identity: data.identity,
    headline: profile.headline,
    summary: profile.summary,
    sectionOrder,
    skills,
    experience: {
      professional: resolveCategory('professional'),
      parttime: resolveCategory('parttime'),
      early: resolveCategory('early'),
    },
    certifications: allCerts,
    education: data.education,
    projects: profile.showProjects ? data.projects : [],
    academic: profile.showAcademic ? data.academic : null,
    awards: data.awards,
    languages: data.languages,
    references: profile.showReferences ? data.references : [],
    showProjects: profile.showProjects,
    showAcademic: profile.showAcademic,
    showReferences: profile.showReferences,
  }
}

export { formatPeriod }

export const PROFILE_IDS: ProfileId[] = ['audit', 'security', 'risk', 'academic']
