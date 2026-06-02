import { useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'

export function ClerkTokenSync() {
  const { getToken, isSignedIn } = useAuth()

  useEffect(() => {
    if (isSignedIn) {
      getToken().then((token) => {
        if (token) localStorage.setItem('clerk-token', token)
      })
    } else {
      localStorage.removeItem('clerk-token')
    }
  }, [isSignedIn, getToken])

  return null
}
