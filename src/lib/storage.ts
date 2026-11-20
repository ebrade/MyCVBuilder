import type { CvData } from '../types'

// Bump version when default content/cv.json is substantially rewritten so browsers
// pick up the new baseline instead of stale localStorage copy.
const STORAGE_KEY = 'mizerere-cv-data-v3'

export function loadStoredCv(): CvData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as CvData
  } catch {
    return null
  }
}

export function saveStoredCv(data: CvData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function clearStoredCv(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function downloadCvJson(data: CvData, filename = 'cv.json'): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
