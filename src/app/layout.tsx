import type { ReactNode } from 'react'

// A root layout is required because of the root-level `not-found.tsx`.
// The actual `<html>`/`<body>` is rendered by `[locale]/layout.tsx` for
// localized routes and by `not-found.tsx` for the global fallback, so this
// layout simply passes children through.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
