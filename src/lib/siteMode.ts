/** True only for the GitHub Pages build. Local dev and preview stay editable. */
export const isPublicSite = import.meta.env.VITE_PUBLIC_SITE === 'true'
