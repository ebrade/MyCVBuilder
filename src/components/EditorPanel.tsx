import { useState, type ReactNode } from 'react'
import type {
  Certification,
  CvData,
  ExperienceRole,
  ProfileId,
  Reference,
} from '../types'
import {
  createBullet,
  createCertification,
  createReference,
  createRole,
  updateBulletText,
  withNewCertification,
  withNewRole,
} from '../lib/mutations'
import { PROFILE_IDS } from '../lib/buildCv'

type Tab = 'contact' | 'profile' | 'experience' | 'certs' | 'references' | 'education'

interface EditorPanelProps {
  data: CvData
  profileId: ProfileId
  onChange: (data: CvData) => void
  onClose: () => void
}

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15'
const labelClass = 'mb-1 block text-[0.68rem] font-bold uppercase tracking-wide text-slate-500'
const sectionCard =
  'rounded-xl border border-slate-200/90 bg-white p-3 shadow-sm space-y-2.5'

export function EditorPanel({ data, profileId, onChange, onClose }: EditorPanelProps) {
  const [tab, setTab] = useState<Tab>('contact')
  const profile = data.profiles[profileId]

  const setIdentity = (key: keyof CvData['identity'], value: string) => {
    onChange({ ...data, identity: { ...data.identity, [key]: value } })
  }

  const setProfileField = (key: 'headline' | 'summary', value: string) => {
    onChange({
      ...data,
      profiles: {
        ...data.profiles,
        [profileId]: { ...profile, [key]: value },
      },
    })
  }

  const updateRole = (roleId: string, next: ExperienceRole) => {
    onChange({
      ...data,
      experience: data.experience.map((r) => (r.id === roleId ? next : r)),
    })
  }

  const removeRole = (roleId: string) => {
    if (!confirm('Remove this role from your CV?')) return
    onChange({
      ...data,
      experience: data.experience.filter((r) => r.id !== roleId),
    })
  }

  const addRole = (category: ExperienceRole['category']) => {
    onChange(withNewRole(data, createRole(category)))
  }

  const addBullet = (role: ExperienceRole) => {
    updateRole(role.id, { ...role, bullets: [...role.bullets, createBullet()] })
  }

  const removeBullet = (role: ExperienceRole, bulletId: string) => {
    updateRole(role.id, {
      ...role,
      bullets: role.bullets.filter((b) => b.id !== bulletId),
    })
  }

  const updateCert = (id: string, patch: Partial<Certification>) => {
    onChange({
      ...data,
      certifications: data.certifications.map((c) =>
        c.id === id ? { ...c, ...patch } : c,
      ),
    })
  }

  const removeCert = (id: string) => {
    if (!confirm('Remove this certification?')) return
    const profiles = { ...data.profiles }
    for (const pid of PROFILE_IDS) {
      profiles[pid] = {
        ...profiles[pid],
        certOrder: profiles[pid].certOrder.filter((x) => x !== id),
      }
    }
    onChange({
      ...data,
      profiles,
      certifications: data.certifications.filter((c) => c.id !== id),
    })
  }

  const addCert = () => {
    onChange(withNewCertification(data, createCertification()))
  }

  const updateRef = (index: number, patch: Partial<Reference>) => {
    onChange({
      ...data,
      references: data.references.map((r, i) => (i === index ? { ...r, ...patch } : r)),
    })
  }

  const removeRef = (index: number) => {
    if (!confirm('Remove this reference?')) return
    onChange({
      ...data,
      references: data.references.filter((_, i) => i !== index),
    })
  }

  const addRef = () => {
    onChange({
      ...data,
      references: [...data.references, createReference()],
    })
  }

  const updateEducation = (
    id: string,
    key: 'institution' | 'credential' | 'location' | 'start' | 'end',
    value: string,
  ) => {
    onChange({
      ...data,
      education: data.education.map((e) => (e.id === id ? { ...e, [key]: value } : e)),
    })
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'contact', label: 'Contact' },
    { id: 'profile', label: 'Headline' },
    { id: 'experience', label: 'Jobs' },
    { id: 'certs', label: 'Certs' },
    { id: 'references', label: 'Refs' },
    { id: 'education', label: 'Education' },
  ]

  return (
    <aside className="editor-panel no-print">
      <div className="editor-panel-head">
        <div>
          <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-accent">
            Live editor
          </p>
          <p className="text-xs text-slate-500">
            Changes save in this browser · download JSON to keep a file backup
          </p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>

      <div className="editor-tabs" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={['editor-tab', tab === t.id ? 'is-active' : ''].join(' ')}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="editor-body">
        {tab === 'contact' && (
          <div className={sectionCard}>
            <Field label="Full name">
              <input
                className={inputClass}
                value={data.identity.fullName}
                onChange={(e) => setIdentity('fullName', e.target.value)}
              />
            </Field>
            <Field label="Location">
              <input
                className={inputClass}
                value={data.identity.location}
                onChange={(e) => setIdentity('location', e.target.value)}
              />
            </Field>
            <Field label="Email">
              <input
                className={inputClass}
                value={data.identity.email}
                onChange={(e) => setIdentity('email', e.target.value)}
              />
            </Field>
            <Field label="Phone">
              <input
                className={inputClass}
                value={data.identity.phone}
                onChange={(e) => setIdentity('phone', e.target.value)}
              />
            </Field>
            <Field label="LinkedIn">
              <input
                className={inputClass}
                value={data.identity.linkedin}
                onChange={(e) => setIdentity('linkedin', e.target.value)}
              />
            </Field>
            <Field label="Website (optional)">
              <input
                className={inputClass}
                value={data.identity.website}
                onChange={(e) => setIdentity('website', e.target.value)}
              />
            </Field>
          </div>
        )}

        {tab === 'profile' && (
          <div className={sectionCard}>
            <p className="text-xs text-slate-500">
              Editing headline & summary for <strong className="text-accent">{profile.label}</strong>{' '}
              profile only.
            </p>
            <Field label="Headline (under your name)">
              <input
                className={inputClass}
                value={profile.headline}
                onChange={(e) => setProfileField('headline', e.target.value)}
              />
            </Field>
            <Field label="Professional summary">
              <textarea
                className={`${inputClass} min-h-[10rem] resize-y leading-relaxed`}
                value={profile.summary}
                onChange={(e) => setProfileField('summary', e.target.value)}
              />
            </Field>
          </div>
        )}

        {tab === 'experience' && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn btn-primary" onClick={() => addRole('professional')}>
                + Add job
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => addRole('parttime')}
              >
                + Part-time / consulting
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => addRole('early')}>
                + Early career
              </button>
            </div>

            {data.experience.map((role) => (
              <div key={role.id} className={sectionCard}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-accent">
                    {role.category}
                  </p>
                  <button
                    type="button"
                    className="text-xs font-semibold text-red-600 hover:underline"
                    onClick={() => removeRole(role.id)}
                  >
                    Remove role
                  </button>
                </div>
                <Field label="Title">
                  <input
                    className={inputClass}
                    value={role.title}
                    onChange={(e) => updateRole(role.id, { ...role, title: e.target.value })}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Organization">
                    <input
                      className={inputClass}
                      value={role.organization}
                      onChange={(e) =>
                        updateRole(role.id, { ...role, organization: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Location">
                    <input
                      className={inputClass}
                      value={role.location}
                      onChange={(e) =>
                        updateRole(role.id, { ...role, location: e.target.value })
                      }
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Start (YYYY-MM)">
                    <input
                      className={inputClass}
                      value={role.start}
                      onChange={(e) => updateRole(role.id, { ...role, start: e.target.value })}
                    />
                  </Field>
                  <Field label="End (YYYY-MM or blank = Present)">
                    <input
                      className={inputClass}
                      value={role.end ?? ''}
                      placeholder="Present"
                      onChange={(e) =>
                        updateRole(role.id, {
                          ...role,
                          end: e.target.value.trim() ? e.target.value : null,
                        })
                      }
                    />
                  </Field>
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-2">
                  <p className={labelClass}>
                    Bullets (editing text for {profile.label} profile)
                  </p>
                  {role.bullets.map((b, idx) => {
                    const text = b.variants[profileId] ?? b.variants.audit
                    return (
                      <div key={b.id} className="flex gap-2">
                        <textarea
                          className={`${inputClass} min-h-[4.2rem] flex-1 resize-y`}
                          value={text}
                          onChange={(e) =>
                            updateRole(
                              role.id,
                              updateBulletText(role, b.id, profileId, e.target.value, false),
                            )
                          }
                          placeholder={`Bullet ${idx + 1}`}
                        />
                        <button
                          type="button"
                          className="shrink-0 self-start text-xs font-semibold text-red-600"
                          onClick={() => removeBullet(role, b.id)}
                        >
                          ✕
                        </button>
                      </div>
                    )
                  })}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => addBullet(role)}
                  >
                    + Add bullet
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'certs' && (
          <div className="space-y-3">
            <button type="button" className="btn btn-primary" onClick={addCert}>
              + Add certification
            </button>
            {data.certifications.map((c) => (
              <div key={c.id} className={sectionCard}>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-xs font-semibold text-red-600 hover:underline"
                    onClick={() => removeCert(c.id)}
                  >
                    Remove
                  </button>
                </div>
                <Field label="Certification name">
                  <input
                    className={inputClass}
                    value={c.name}
                    onChange={(e) => updateCert(c.id, { name: e.target.value })}
                  />
                </Field>
                <Field label="Issuer">
                  <input
                    className={inputClass}
                    value={c.issuer}
                    onChange={(e) => updateCert(c.id, { issuer: e.target.value })}
                  />
                </Field>
              </div>
            ))}
          </div>
        )}

        {tab === 'references' && (
          <div className="space-y-3">
            <p className="rounded-lg bg-accent-soft/80 px-3 py-2 text-xs leading-relaxed text-slate-600">
              References are <strong>optional</strong>. Use the toolbar toggle “Show references”
              to include them on the current profile when an employer asks.
            </p>
            <button type="button" className="btn btn-primary" onClick={addRef}>
              + Add reference
            </button>
            {data.references.map((r, i) => (
              <div key={`${r.name}-${i}`} className={sectionCard}>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-xs font-semibold text-red-600 hover:underline"
                    onClick={() => removeRef(i)}
                  >
                    Remove
                  </button>
                </div>
                <Field label="Name">
                  <input
                    className={inputClass}
                    value={r.name}
                    onChange={(e) => updateRef(i, { name: e.target.value })}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Title">
                    <input
                      className={inputClass}
                      value={r.title}
                      onChange={(e) => updateRef(i, { title: e.target.value })}
                    />
                  </Field>
                  <Field label="Organization">
                    <input
                      className={inputClass}
                      value={r.organization}
                      onChange={(e) => updateRef(i, { organization: e.target.value })}
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Phone">
                    <input
                      className={inputClass}
                      value={r.phone}
                      onChange={(e) => updateRef(i, { phone: e.target.value })}
                    />
                  </Field>
                  <Field label="Email">
                    <input
                      className={inputClass}
                      value={r.email}
                      onChange={(e) => updateRef(i, { email: e.target.value })}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'education' && (
          <div className="space-y-3">
            {data.education.map((e) => (
              <div key={e.id} className={sectionCard}>
                <Field label="Credential / degree">
                  <input
                    className={inputClass}
                    value={e.credential}
                    onChange={(ev) => updateEducation(e.id, 'credential', ev.target.value)}
                  />
                </Field>
                <Field label="Institution">
                  <input
                    className={inputClass}
                    value={e.institution}
                    onChange={(ev) => updateEducation(e.id, 'institution', ev.target.value)}
                  />
                </Field>
                <Field label="Location">
                  <input
                    className={inputClass}
                    value={e.location}
                    onChange={(ev) => updateEducation(e.id, 'location', ev.target.value)}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Start year">
                    <input
                      className={inputClass}
                      value={e.start}
                      onChange={(ev) => updateEducation(e.id, 'start', ev.target.value)}
                    />
                  </Field>
                  <Field label="End year">
                    <input
                      className={inputClass}
                      value={e.end}
                      onChange={(ev) => updateEducation(e.id, 'end', ev.target.value)}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  )
}
