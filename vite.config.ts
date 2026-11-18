import { readFileSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://ebrade.github.io/MyCVBuilder/ — local dev stays at `/`.
const publicSite = process.env.GITHUB_PAGES === 'true'

/** Drop referee records from the Pages bundle. The source file is unchanged. */
function stripReferencesForPublic(): Plugin {
  return {
    name: 'strip-cv-references',
    enforce: 'pre',
    load(id) {
      const path = id.split('?')[0].replace(/\\/g, '/')
      if (!path.endsWith('/content/cv.json')) return null
      const data = JSON.parse(readFileSync(path, 'utf8')) as {
        references?: unknown[]
        profiles?: Record<string, { showReferences?: boolean; sectionOrder?: string[] }>
      }
      data.references = []
      for (const profile of Object.values(data.profiles ?? {})) {
        profile.showReferences = false
        profile.sectionOrder = (profile.sectionOrder ?? []).filter((section) => section !== 'references')
      }
      return JSON.stringify(data)
    },
  }
}

export default defineConfig({
  base: publicSite ? '/MyCVBuilder/' : '/',
  define: {
    'import.meta.env.VITE_PUBLIC_SITE': JSON.stringify(publicSite ? 'true' : 'false'),
  },
  plugins: [publicSite ? stripReferencesForPublic() : null, react(), tailwindcss()],
})
