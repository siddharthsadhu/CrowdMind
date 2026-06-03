import { SignIn } from '@clerk/clerk-react'

const clerkAppearance = {
  baseTheme: undefined,
  variables: {
    colorPrimary: '#b0c6ff',
    colorBackground: '#111319',
    colorInputBackground: '#1e1f26',
    colorInputText: '#e2e2eb',
    colorText: '#e2e2eb',
    colorTextSecondary: '#c2c6d7',
    colorNeutral: '#424654',
    colorDanger: '#ffb4ab',
    colorSuccess: '#b0c6ff',
    colorWarning: '#ffb4ab',
    borderRadius: '0.5rem',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  elements: {
    rootBox: 'bg-surface',
    card: 'bg-surface border border-white/10 shadow-2xl',
    formButtonPrimary:
      'bg-primary text-on-primary hover:bg-primary/90 font-label tracking-wide',
    formFieldInput:
      'bg-surface-container border-outline text-on-surface',
    footerActionLink: 'text-primary hover:text-primary/80',
    identityPreview: 'bg-surface-container',
    formFieldLabel: 'text-on-surface-variant',
    dividerLine: 'bg-outline-variant',
    dividerText: 'text-outline',
    socialButtons: 'gap-2',
    socialButtonsIconButton: 'border-white/10 hover:bg-white/5',
  },
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-surface p-8 shadow-2xl">
        <h1 className="mb-6 text-center font-[family-name:var(--font-headline)] text-2xl font-bold text-primary">
          Sign In to CrowdMind
        </h1>
        <SignIn appearance={clerkAppearance} />
      </div>
    </div>
  )
}
