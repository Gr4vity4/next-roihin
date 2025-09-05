import { Suspense } from 'react'
import Navigation from './Navigation'

interface NavigationWithSuspenseProps {
  position?: 'fixed' | 'static'
}

export default function NavigationWithSuspense(props: NavigationWithSuspenseProps) {
  return (
    <Suspense fallback={<div className="h-20 bg-black" />}>
      <Navigation {...props} />
    </Suspense>
  )
}