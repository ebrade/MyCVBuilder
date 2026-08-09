# MyCVBuilder

A modern, multi-profile **CV builder** (web app) with live preview, browser editing, and export to PDF or Word.

**Live code:** [github.com/ebrade/MyCVBuilder](https://github.com/ebrade/MyCVBuilder)

## Features

- **Four role profiles:** Audit · Security · Risk · Academic  
  Switch with one click; headline, summary, skills order, certs, and bullets adapt.
- **Live browser editor:** update contact, jobs, certs, education, references without touching code.
- **Optional references:** toggle on when an employer asks.
- **Export:** PDF (print / Save as PDF, A4) and Word (`.docx`).
- **Single source of truth:** [`content/cv.json`](content/cv.json) (browser edits also auto-save in `localStorage`).
- **Modern layout:** single-column editorial design, deep blue accent, print-ready A4.

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).  
**Stop the server with Ctrl+C** when you are done.

```bash
npm run build     # production build → dist/
npm run preview   # preview production build
```

## How to use

| Action | How |
|--------|-----|
| Change target role | Top tabs: **Audit / Security / Risk / Academic** |
| Edit content | **Edit CV** → tabs for Contact, Headline, Jobs, Certs, Refs, Education |
| Add a job / cert / reference | **+ Add …** buttons in the editor |
| Show references on the CV | **Show references** (per profile) |
| Export PDF | **PDF** (browser print → Save as PDF) |
| Export Word | **Word** |
| Backup all data | **Download JSON** |
| Undo browser edits | **Reset** (reloads `content/cv.json`) |

Edits auto-save in this browser. To keep a durable backup, use **Download JSON** or commit updates to `content/cv.json`.

## Project structure

```
content/cv.json     # Default CV data (identity, experience, profiles, …)
src/
  App.tsx           # Profile switch, edit mode, export
  components/       # CV layout, toolbar, editor
  lib/              # Profile merge, docx export, storage, mutations
  index.css         # Design tokens + print styles
```

## Content model (advanced)

Experience bullets can have **per-profile text** under `variants` (`audit` / `security` / `risk` / `academic`).  
Each profile config controls headline, summary, section order, cert order, and max bullets per role.

## Tech stack

- Vite + React + TypeScript  
- Tailwind CSS v4  
- `docx` + `file-saver` for Word export  

## Privacy note

This repo is the **app and CV data JSON** only. Personal Word documents (commitment letters, original Word CVs) are **gitignored** and stay on your machine.
