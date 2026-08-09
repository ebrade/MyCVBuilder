import type { ResolvedCv, ResolvedRole } from '../types'
import { formatPeriod } from '../lib/buildCv'
import { Section } from './Section'
import { IconLinkedIn, IconMail, IconPhone, IconPin } from './icons'

function RoleBlock({ role }: { role: ResolvedRole }) {
  return (
    <article className="cv-role">
      <div className="cv-role-top">
        <h3 className="cv-role-title">{role.title}</h3>
        <span className="cv-role-date">{formatPeriod(role.start, role.end)}</span>
      </div>
      <p className="cv-role-meta">
        <span className="cv-role-org">{role.organization}</span>
        <span> · {role.location}</span>
      </p>
      <ul className="cv-bullets">
        {role.bullets.map((b) => (
          <li key={b.id} className="cv-bullet">
            {b.text}
          </li>
        ))}
      </ul>
    </article>
  )
}

function linkedInHref(value: string) {
  if (!value) return undefined
  if (value.startsWith('http')) return value
  return `https://${value.replace(/^\/+/, '')}`
}

export function CvDocument({ cv }: { cv: ResolvedCv }) {
  const { identity } = cv

  const renderSection = (key: string) => {
    switch (key) {
      case 'summary':
        return (
          <Section key="summary" title="Professional Summary">
            <div className="cv-summary">
              {cv.summary.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </Section>
        )

      case 'skills':
        return (
          <Section key="skills" title="Core Competencies">
            {cv.skills.map((group) => (
              <div key={group.label} className="cv-skill-block">
                <span className="cv-skill-label">{group.label}</span>
                <div className="cv-chip-row">
                  {group.items.map((item) => (
                    <span key={item} className="cv-chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </Section>
        )

      case 'experience':
        return (
          <div key="experience">
            <Section title="Professional Experience">
              {cv.experience.professional.map((role) => (
                <RoleBlock key={role.id} role={role} />
              ))}
            </Section>

            {cv.experience.parttime.length > 0 && (
              <Section title="Part-Time & Consulting">
                {cv.experience.parttime.map((role) => (
                  <RoleBlock key={role.id} role={role} />
                ))}
              </Section>
            )}

            {cv.experience.early.length > 0 && (
              <Section title="Early Career">
                {cv.experience.early.map((role) => (
                  <RoleBlock key={role.id} role={role} />
                ))}
              </Section>
            )}
          </div>
        )

      case 'academic':
        if (!cv.academic) return null
        return (
          <Section key="academic" title="Teaching & Research Interests">
            <p
              className="cv-bullet"
              style={{
                marginBottom: '2.2mm',
                fontStyle: 'italic',
                color: 'var(--color-ink-muted)',
                paddingLeft: 0,
              }}
            >
              {cv.academic.teachingExperienceNote}
            </p>
            <div style={{ marginBottom: '2.5mm' }}>
              <span className="cv-skill-label">Teaching interests</span>
              <ul className="cv-bullets">
                {cv.academic.teachingInterests.map((t) => (
                  <li key={t} className="cv-bullet">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="cv-skill-label">Research interests</span>
              <ul className="cv-bullets">
                {cv.academic.researchInterests.map((t) => (
                  <li key={t} className="cv-bullet">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Section>
        )

      case 'certifications':
        return (
          <Section key="certifications" title="Certifications">
            <div className="cv-cert-grid">
              {cv.certifications.map((c) => (
                <div key={c.id} className="cv-cert">
                  <span className="cv-cert-mark" aria-hidden />
                  <div>
                    <div className="cv-cert-name">{c.name}</div>
                    <div className="cv-cert-issuer">{c.issuer}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )

      case 'education':
        return (
          <Section key="education" title="Education">
            {cv.education.map((e) => (
              <div key={e.id} className="cv-edu">
                <div>
                  <div className="cv-edu-degree">{e.credential}</div>
                  <div className="cv-edu-school">
                    {e.institution}
                    {e.location ? ` · ${e.location}` : ''}
                  </div>
                </div>
                <div className="cv-edu-date">
                  {e.start} – {e.end}
                </div>
              </div>
            ))}
          </Section>
        )

      case 'projects':
        if (!cv.showProjects || !cv.projects.length) return null
        return (
          <Section key="projects" title="Projects & Research">
            {cv.projects.map((p) => (
              <article key={p.id} className="cv-role">
                <div className="cv-role-top">
                  <h3 className="cv-role-title">{p.title}</h3>
                  <span className="cv-role-date">{formatPeriod(p.start, p.end)}</span>
                </div>
                <p className="cv-role-meta">
                  <span className="cv-role-org">{p.organization}</span>
                </p>
                <ul className="cv-bullets">
                  {p.bullets.map((b) => (
                    <li key={b} className="cv-bullet">
                      {b}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </Section>
        )

      case 'awards':
        return (
          <Section key="awards" title="Awards">
            {cv.awards.map((a) => (
              <div key={a.id} className="cv-award">
                <div className="cv-award-year">{a.year}</div>
                <div>
                  <div className="cv-award-title">{a.title}</div>
                  <div className="cv-award-detail">
                    {a.organization}. {a.detail}
                  </div>
                </div>
              </div>
            ))}
          </Section>
        )

      case 'languages':
        return (
          <Section key="languages" title="Languages">
            <div className="cv-lang-row">
              {cv.languages.map((l) => (
                <span key={l.name} className="cv-lang">
                  <span className="cv-lang-name">{l.name}</span>
                  <span className="cv-lang-level">{l.level}</span>
                </span>
              ))}
            </div>
          </Section>
        )

      case 'references':
        if (!cv.showReferences || !cv.references.length) return null
        return (
          <Section key="references" title="References">
            <div className="cv-ref-grid">
              {cv.references.map((r) => (
                <div key={`${r.name}-${r.email}`} className="cv-ref">
                  <div className="cv-ref-name">{r.name}</div>
                  <div className="cv-ref-title">
                    {r.title}
                    {r.organization ? ` · ${r.organization}` : ''}
                  </div>
                  <div className="cv-ref-contact">
                    {[r.phone, r.email].filter(Boolean).join(' · ')}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )

      default:
        return null
    }
  }

  return (
    <article className="cv-page relative mx-auto overflow-hidden rounded-sm bg-white text-ink shadow-page print:rounded-none print:shadow-none">
      <div className="cv-rail" aria-hidden />

      <div className="cv-page-inner">
        <header className="cv-header">
          <h1 className="cv-name">{identity.fullName}</h1>
          <p className="cv-headline">{cv.headline}</p>

          <div className="cv-contact">
            {identity.location && (
              <span className="cv-contact-item">
                <IconPin className="cv-contact-icon" />
                {identity.location}
              </span>
            )}
            {identity.email && (
              <a className="cv-contact-item" href={`mailto:${identity.email}`}>
                <IconMail className="cv-contact-icon" />
                {identity.email}
              </a>
            )}
            {identity.phone && (
              <a className="cv-contact-item" href={`tel:${identity.phone.replace(/\s+/g, '')}`}>
                <IconPhone className="cv-contact-icon" />
                {identity.phone}
              </a>
            )}
            {identity.linkedin && (
              <a
                className="cv-contact-item"
                href={linkedInHref(identity.linkedin)}
                target="_blank"
                rel="noreferrer"
              >
                <IconLinkedIn className="cv-contact-icon" />
                {identity.linkedin.replace(/^https?:\/\//, '')}
              </a>
            )}
            {identity.website && (
              <a
                className="cv-contact-item"
                href={
                  identity.website.startsWith('http')
                    ? identity.website
                    : `https://${identity.website}`
                }
                target="_blank"
                rel="noreferrer"
              >
                {identity.website}
              </a>
            )}
          </div>
        </header>

        {cv.sectionOrder.map((key) => renderSection(key))}
      </div>
    </article>
  )
}
