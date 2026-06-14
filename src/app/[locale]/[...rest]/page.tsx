import { notFound } from 'next/navigation'

// Catch-all route for any unmatched path under a locale (e.g. `/th/does-not-exist`).
// Calling `notFound()` renders the localized `[locale]/not-found.tsx` page.
export default function CatchAllPage() {
  notFound()
}
