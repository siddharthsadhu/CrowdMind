import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { AuthProvider } from './context/AuthContext'
import { QueryProvider } from './providers/QueryProvider'
import { ClerkTokenSync } from './components/ClerkTokenSync'
import App from './App'
import './index.css'

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={CLERK_KEY}>
        <QueryProvider>
          <AuthProvider>
            <ClerkTokenSync />
            <App />
          </AuthProvider>
        </QueryProvider>
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>,
)
