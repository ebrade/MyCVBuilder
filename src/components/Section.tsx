import type { ReactNode } from 'react'

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="cv-section">
      <h2 className="cv-section-title">
        <span className="cv-section-title-mark" aria-hidden />
        <span>{title}</span>
        <span className="cv-section-rule" aria-hidden />
      </h2>
      {children}
    </section>
  )
}
