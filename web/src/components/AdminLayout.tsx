import { Link, NavLink, Outlet } from 'react-router-dom'
import { Icon } from './Icon'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all ${
    isActive ? 'bg-primary/15 text-primary' : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'
  }`

export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-background pt-20">
      <aside className="hidden w-64 flex-shrink-0 border-r border-white/10 bg-surface-container-lowest p-6 lg:block">
        <p className="mb-6 font-[family-name:var(--font-label)] text-xs tracking-widest text-primary uppercase">
          Mission Control
        </p>
        <nav className="flex flex-col gap-1">
          <NavLink to="/admin" end className={linkClass}>
            <Icon name="dashboard" /> Overview
          </NavLink>
          <NavLink to="/admin/faq-review" className={linkClass}>
            <Icon name="fact_check" /> FAQ Review
          </NavLink>
          <NavLink to="/admin/faq" className={linkClass}>
            <Icon name="library_books" /> FAQ Management
          </NavLink>
          <NavLink to="/admin/moderation" className={linkClass}>
            <Icon name="gavel" /> Moderation Queue
          </NavLink>
          <NavLink to="/admin/analytics" className={linkClass}>
            <Icon name="analytics" /> Analytics
          </NavLink>
        </nav>
        <Link to="/home" className="mt-8 flex items-center gap-2 text-sm text-outline hover:text-primary">
          <Icon name="arrow_back" className="text-base" /> Back to app
        </Link>
      </aside>
      <main className="custom-scrollbar flex-1 overflow-y-auto p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  )
}
