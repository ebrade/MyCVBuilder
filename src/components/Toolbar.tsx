import type { ProfileId } from '../types'
import { PROFILE_IDS } from '../lib/buildCv'
import { IconDoc, IconDownload } from './icons'

const LABELS: Record<ProfileId, string> = {
  audit: 'Audit',
  security: 'Security',
  risk: 'Risk',
  academic: 'Academic',
}

interface ToolbarProps {
  profileId: ProfileId
  onProfileChange: (id: ProfileId) => void
  onPrint: () => void
  onDocx: () => void
  editMode: boolean
  onToggleEdit: () => void
  showReferences: boolean
  onToggleReferences: () => void
  onDownloadJson: () => void
  onReset: () => void
  savedFlash: boolean
  publicSite?: boolean
}

export function Toolbar({
  profileId,
  onProfileChange,
  onPrint,
  onDocx,
  editMode,
  onToggleEdit,
  showReferences,
  onToggleReferences,
  onDownloadJson,
  onReset,
  savedFlash,
  publicSite = false,
}: ToolbarProps) {
  return (
    <header className="toolbar no-print">
      <div className="toolbar-inner">
        <div>
          <p className="toolbar-brand-kicker">Professional CV</p>
          <p className="toolbar-brand-sub">
            {publicSite
              ? 'Choose a role, then save a copy'
              : editMode
                ? 'Editing live — preview updates instantly'
                : 'Tailored profiles · edit · PDF & Word'}
          </p>
        </div>

        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
          <div className="profile-tabs" role="tablist" aria-label="CV profile">
            {PROFILE_IDS.map((id) => {
              const active = id === profileId
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onProfileChange(id)}
                  className={['profile-tab', active ? 'is-active' : ''].join(' ')}
                >
                  {LABELS[id]}
                </button>
              )
            })}
          </div>

          <div className="flex flex-wrap gap-2">
            {!publicSite && (
              <button
                type="button"
                onClick={onToggleEdit}
                className={['btn', editMode ? 'btn-primary' : 'btn-secondary'].join(' ')}
              >
                {editMode ? '✓ Editing' : 'Edit CV'}
              </button>
            )}

            {!publicSite && (
              <button
                type="button"
                onClick={onToggleReferences}
                className={[
                  'btn',
                  showReferences ? 'btn-primary' : 'btn-secondary',
                ].join(' ')}
                title="Include references section on this profile"
              >
                {showReferences ? 'Refs: On' : 'Show references'}
              </button>
            )}

            <button type="button" onClick={onPrint} className="btn btn-primary">
              <IconDownload />
              PDF
            </button>
            <button type="button" onClick={onDocx} className="btn btn-secondary">
              <IconDoc />
              Word
            </button>
            {!publicSite && (
              <button
                type="button"
                onClick={onDownloadJson}
                className="btn btn-secondary"
                title="Download full content as JSON backup"
              >
                {savedFlash ? 'Downloaded ✓' : 'Download JSON'}
              </button>
            )}
            {!publicSite && (
              <button
                type="button"
                onClick={onReset}
                className="btn btn-secondary"
                title="Reset to original content file"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
