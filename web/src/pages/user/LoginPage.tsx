import { SignIn } from '@clerk/clerk-react'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-surface p-8 shadow-2xl">
        <h1 className="mb-6 text-center font-[family-name:var(--font-headline)] text-2xl font-bold text-primary">
          Sign In to CrowdMind
        </h1>
        <SignIn />
      </div>
    </div>
  )
}
