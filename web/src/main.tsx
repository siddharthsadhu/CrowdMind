import { Component, StrictMode, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { AuthProvider, GuestOnlyProvider } from './context/AuthContext'
import { QueryProvider } from './providers/QueryProvider'
import { ClerkTokenSync } from './components/ClerkTokenSync'
import App from './App'
import './index.css'

class ErrorB extends Component<{ children: ReactNode }> {
  state = { error: null as Error | null, info: '' }
  static getDerivedStateFromError(e: Error) { return { error: e } }
  componentDidCatch(_e: Error, info: any) { this.setState({ info: info.componentStack }) }
  render() {
    if (this.state.error) {
      return <pre style={{ color: 'red', padding: 20, whiteSpace: 'pre-wrap', fontSize: 14 }}>{this.state.error.stack}{'\n\n'}{this.state.info}</pre>
    }
    return this.props.children
  }
}

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const hasClerk = CLERK_KEY && CLERK_KEY.startsWith('pk_') && !CLERK_KEY.includes('placeholder')

function ClerkProviders({ children }: { children: ReactNode }) {
  if (!hasClerk) {
    return <GuestOnlyProvider>{children}</GuestOnlyProvider>
  }
  return (
    <ClerkProvider publishableKey={CLERK_KEY}>
      <AuthProvider>
        <ClerkTokenSync />
        {children}
      </AuthProvider>
    </ClerkProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorB>
      <BrowserRouter>
        <QueryProvider>
          <ClerkProviders>
            <App />
          </ClerkProviders>
        </QueryProvider>
      </BrowserRouter>
    </ErrorB>
  </StrictMode>,
)
