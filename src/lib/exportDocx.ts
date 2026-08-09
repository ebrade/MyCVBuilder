import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  LevelFormat,
} from 'docx'
import { saveAs } from 'file-saver'
import type { ResolvedCv } from '../types'
import { formatPeriod } from './buildCv'

const ACCENT = '1E3A5F'
const MUTED = '475569'

function heading(text: string) {
  return new Paragraph({
    spacing: { before: 240, after: 80 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 12, color: ACCENT, space: 4 },
    },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 20,
        font: 'Calibri',
        color: ACCENT,
        characterSpacing: 60,
      }),
    ],
  })
}

function bullet(text: string, reference: string) {
  return new Paragraph({
    numbering: { reference, level: 0 },
    spacing: { after: 40 },
    children: [
      new TextRun({ text, size: 20, font: 'Calibri', color: '0F172A' }),
    ],
  })
}

function body(text: string, opts?: { bold?: boolean; italic?: boolean; color?: string; size?: number }) {
  return new Paragraph({
    spacing: { after: 60 },
    children: [
      new TextRun({
        text,
        bold: opts?.bold,
        italics: opts?.italic,
        size: opts?.size ?? 20,
        font: 'Calibri',
        color: opts?.color ?? '0F172A',
      }),
    ],
  })
}

export async function exportDocx(cv: ResolvedCv) {
  const { identity } = cv
  const contact = [identity.location, identity.email, identity.phone, identity.linkedin]
    .filter((x) => x && !x.includes('YOUR') && !x.includes('XXX'))
    .join('  ·  ')

  const children: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: identity.fullName,
          bold: true,
          size: 36,
          font: 'Calibri',
          color: ACCENT,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: cv.headline,
          size: 22,
          font: 'Calibri',
          color: MUTED,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 160 },
      children: [
        new TextRun({
          text: contact || [identity.location, identity.email, identity.phone, identity.linkedin].join('  ·  '),
          size: 18,
          font: 'Calibri',
          color: MUTED,
        }),
      ],
    }),
  ]

  for (const section of cv.sectionOrder) {
    if (section === 'summary') {
      children.push(heading('Professional Summary'))
      for (const para of cv.summary.split('\n\n')) {
        children.push(
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({ text: para, size: 20, font: 'Calibri', color: '0F172A' }),
            ],
          }),
        )
      }
    }

    if (section === 'skills') {
      children.push(heading('Core Competencies'))
      for (const group of cv.skills) {
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({ text: `${group.label}: `, bold: true, size: 20, font: 'Calibri', color: ACCENT }),
              new TextRun({ text: group.items.join(' · '), size: 20, font: 'Calibri', color: '0F172A' }),
            ],
          }),
        )
      }
    }

    if (section === 'experience') {
      children.push(heading('Professional Experience'))
      for (const role of cv.experience.professional) {
        children.push(
          new Paragraph({
            spacing: { before: 100, after: 20 },
            children: [
              new TextRun({ text: role.title, bold: true, size: 21, font: 'Calibri', color: '0F172A' }),
              new TextRun({ text: `  ·  ${role.organization}`, size: 20, font: 'Calibri', color: MUTED }),
            ],
          }),
        )
        children.push(
          body(`${formatPeriod(role.start, role.end)}  ·  ${role.location}`, {
            italic: true,
            color: MUTED,
            size: 18,
          }),
        )
        for (const b of role.bullets) {
          children.push(bullet(b.text, 'bullets'))
        }
      }

      if (cv.experience.parttime.length) {
        children.push(heading('Part-Time & Consulting'))
        for (const role of cv.experience.parttime) {
          children.push(
            new Paragraph({
              spacing: { before: 80, after: 20 },
              children: [
                new TextRun({ text: role.title, bold: true, size: 21, font: 'Calibri' }),
                new TextRun({ text: `  ·  ${role.organization}`, size: 20, font: 'Calibri', color: MUTED }),
              ],
            }),
          )
          children.push(
            body(`${formatPeriod(role.start, role.end)}  ·  ${role.location}`, {
              italic: true,
              color: MUTED,
              size: 18,
            }),
          )
          for (const b of role.bullets) children.push(bullet(b.text, 'bullets'))
        }
      }

      if (cv.experience.early.length) {
        children.push(heading('Early Career'))
        for (const role of cv.experience.early) {
          children.push(
            new Paragraph({
              spacing: { before: 80, after: 20 },
              children: [
                new TextRun({ text: role.title, bold: true, size: 21, font: 'Calibri' }),
                new TextRun({ text: `  ·  ${role.organization}`, size: 20, font: 'Calibri', color: MUTED }),
              ],
            }),
          )
          children.push(
            body(`${formatPeriod(role.start, role.end)}  ·  ${role.location}`, {
              italic: true,
              color: MUTED,
              size: 18,
            }),
          )
          for (const b of role.bullets) children.push(bullet(b.text, 'bullets'))
        }
      }
    }

    if (section === 'academic' && cv.academic) {
      children.push(heading('Teaching & Research Interests'))
      children.push(body(cv.academic.teachingExperienceNote, { italic: true, color: MUTED }))
      children.push(body('Teaching interests', { bold: true, color: ACCENT }))
      for (const t of cv.academic.teachingInterests) children.push(bullet(t, 'bullets'))
      children.push(body('Research interests', { bold: true, color: ACCENT }))
      for (const t of cv.academic.researchInterests) children.push(bullet(t, 'bullets'))
    }

    if (section === 'certifications') {
      children.push(heading('Certifications'))
      for (const c of cv.certifications) {
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({ text: c.name, bold: true, size: 20, font: 'Calibri' }),
              new TextRun({ text: `  ·  ${c.issuer}`, size: 20, font: 'Calibri', color: MUTED }),
            ],
          }),
        )
      }
    }

    if (section === 'education') {
      children.push(heading('Education'))
      for (const e of cv.education) {
        children.push(
          new Paragraph({
            spacing: { before: 60, after: 20 },
            children: [
              new TextRun({ text: e.credential, bold: true, size: 20, font: 'Calibri' }),
            ],
          }),
        )
        children.push(
          body(`${e.institution}  ·  ${e.start} – ${e.end}`, { color: MUTED, size: 18 }),
        )
      }
    }

    if (section === 'projects' && cv.showProjects) {
      children.push(heading('Projects & Research'))
      for (const p of cv.projects) {
        children.push(
          new Paragraph({
            spacing: { before: 80, after: 20 },
            children: [
              new TextRun({ text: p.title, bold: true, size: 20, font: 'Calibri' }),
            ],
          }),
        )
        children.push(
          body(`${p.organization}  ·  ${formatPeriod(p.start, p.end)}`, {
            italic: true,
            color: MUTED,
            size: 18,
          }),
        )
        for (const b of p.bullets) children.push(bullet(b, 'bullets'))
      }
    }

    if (section === 'awards') {
      children.push(heading('Awards'))
      for (const a of cv.awards) {
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({ text: `${a.year} — ${a.title}`, bold: true, size: 20, font: 'Calibri' }),
              new TextRun({
                text: `  ·  ${a.organization}. ${a.detail}`,
                size: 20,
                font: 'Calibri',
                color: MUTED,
              }),
            ],
          }),
        )
      }
    }

    if (section === 'languages') {
      children.push(heading('Languages'))
      children.push(
        body(cv.languages.map((l) => `${l.name} (${l.level})`).join('  ·  ')),
      )
    }

    if (section === 'references' && cv.showReferences && cv.references.length) {
      children.push(heading('References'))
      for (const r of cv.references) {
        children.push(
          new Paragraph({
            spacing: { before: 60, after: 20 },
            children: [
              new TextRun({ text: r.name, bold: true, size: 20, font: 'Calibri' }),
            ],
          }),
        )
        children.push(
          body(
            [r.title, r.organization].filter(Boolean).join(' · '),
            { color: MUTED, size: 18 },
          ),
        )
        children.push(
          body([r.phone, r.email].filter(Boolean).join(' · '), {
            color: MUTED,
            size: 18,
          }),
        )
      }
    }
  }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Calibri', size: 20 },
        },
      },
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: { size: 20, bold: true, font: 'Calibri', color: ACCENT },
          paragraph: { spacing: { before: 240, after: 80 }, outlineLevel: 0 },
        },
      ],
    },
    numbering: {
      config: [
        {
          reference: 'bullets',
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: '•',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: 360, hanging: 180 },
                },
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children,
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  const safeName = cv.identity.fullName.replace(/\s+/g, '-')
  saveAs(blob, `${safeName}-CV-${cv.profileId}.docx`)
}
