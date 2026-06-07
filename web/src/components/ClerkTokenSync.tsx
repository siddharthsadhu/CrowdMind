import { useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'

export function ClerkTokenSync() {
  const { getToken, isSignedIn } = useAuth()

  useEffect(() => {
    if (!isSignedIn) {
      localStorage.removeItem('clerk-token')
      return
    }

    const updateToken = () => {
      getToken().then((token) => {
        if (token) localStorage.setItem('clerk-token', token)
      })
    }

    updateToken()
    const interval = setInterval(updateToken, 30000)

    return () => clearInterval(interval)
  }, [isSignedIn, getToken])

  return null
}

