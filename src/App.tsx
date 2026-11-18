import { useEffect, useMemo, useState } from 'react'
import rawCv from '../content/cv.json'
import { Toolbar } from './components/Toolbar'
import { CvDocument } from './components/CvDocument'
import { EditorPanel } from './components/EditorPanel'
import { buildCv } from './lib/buildCv'
import { setShowReferences } from './lib/mutations'
import { isPublicSite } from './lib/siteMode'
import {
  clearStoredCv,
  downloadCvJson,
  loadStoredCv,
  saveStoredCv,
} from './lib/storage'
import type { CvData, ProfileId } from './types'

const defaultCv = rawCv as CvData

export default function App() {
  const [profileId, setProfileId] = useState<ProfileId>('audit')
  const [editMode, setEditMode] = useState(false)
  const [data, setData] = useState<CvData>(() =>
    isPublicSite ? defaultCv : (loadStoredCv() ?? defaultCv),
  )
  const [savedFlash, setSavedFlash] = useState(false)

  const cv = useMemo(() => buildCv(data, profileId), [data, profileId])
  const showReferences = data.profiles[profileId].showReferences

  // Auto-save edits to this browser. The public site always shows the published CV.
  useEffect(() => {
    if (!isPublicSite) saveStoredCv(data)
  }, [data])

  const handlePrint = () => {
    window.print()
  }

  const handleDocx = () => {
    void import('./lib/exportDocx').then(({ exportDocx }) => exportDocx(cv))
  }

  const handleDownloadJson = () => {
    downloadCvJson(data, 'cv.json')
    setSavedFlash(true)
    window.setTimeout(() => setSavedFlash(false), 2000)
  }

  const handleReset = () => {
    if (
      !confirm(
        'Reset to the original content/cv.json file? This clears browser edits.',
      )
    ) {
      return
    }
    clearStoredCv()
    setData(structuredClone(defaultCv))
  }

  const handleToggleReferences = () => {
    setData((prev) => setShowReferences(prev, profileId, !showReferences))
  }

  return (
    <div className="app-shell">
      <Toolbar
        profileId={profileId}
        onProfileChange={setProfileId}
        onPrint={handlePrint}
        onDocx={handleDocx}
        editMode={editMode}
        onToggleEdit={() => setEditMode((v) => !v)}
        showReferences={showReferences}
        onToggleReferences={handleToggleReferences}
        publicSite={isPublicSite}
        onDownloadJson={handleDownloadJson}
        onReset={handleReset}
        savedFlash={savedFlash}
      />

      <div className={['app-layout', editMode ? 'is-editing' : ''].join(' ')}>
        {editMode && !isPublicSite && (
          <EditorPanel
            data={data}
            profileId={profileId}
            onChange={setData}
            onClose={() => setEditMode(false)}
          />
        )}

        <main className="app-main print:p-0">
          {!editMode && (
            <div className="tip-bar no-print">
              <span aria-hidden>✨</span>
              {isPublicSite ? (
                <p>
                  Four versions of the same CV. Choose the role, then save a PDF
                  or Word file. References are available on request.
                </p>
              ) : (
                <p>
                  Click <strong>Edit CV</strong> to update contact, jobs, certs, or
                  references in the browser. Use <strong>Show references</strong>{' '}
                  when an employer asks. Edits auto-save here; download JSON for a
                  file backup.
                </p>
              )}
            </div>
          )}

          <CvDocument cv={cv} />
        </main>
      </div>
    </div>
  )
}
