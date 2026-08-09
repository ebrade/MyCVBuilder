# Dynamic CV Generator

Modern, multi-profile CV for **Jean Sauveur Rukundo Mizerere**.

Switch between **Audit**, **Security**, **Risk**, and **Academic** versions, edit in the browser, then export **PDF** or **Word (.docx)**.

## Quick start

```bash
npm install
npm run dev
```

Open the local URL (usually `http://localhost:5173`). Stop the server with **Ctrl+C** when done.

```bash
npm run build    # production build
npm run preview  # preview production build (stop with Ctrl+C)
```

## Edit in the browser

1. Click **Edit CV**.
2. Tabs: **Contact · Headline · Jobs · Certs · Refs · Education**.
3. **+ Add job**, **+ Add certification**, **+ Add reference** as needed.
4. Toggle **Show references** when an employer asks (per profile).
5. Edits **auto-save in this browser** (localStorage).
6. **Download JSON** for a file backup (optional: replace `content/cv.json`).
7. **Reset** restores the original `content/cv.json` and clears browser edits.

## Profiles

| Profile | Emphasis |
|---------|----------|
| **Audit** | IT/systems audit, integrated assurance, ITGC, migrations |
| **Security** | Cyber posture, ISO 27001, CEH/CISM order, projects/research |
| **Risk** | Residual risk, resilience, awards, vendor/third-party risk |
| **Academic** | Teaching & research interests, GTA experience, projects |

## Export

- **PDF:** Print → Save as PDF (A4 styles).
- **Word:** downloads a `.docx` for the active profile.
- **JSON:** full content backup of your live data.

## Source file (advanced)

Default content: [`content/cv.json`](content/cv.json). Browser edits override this until you Reset or replace the file and Reset.

## Design

- Deep professional blue accent
- Single-column editorial layout
- Manrope + Source Serif 4
- Print-ready A4
