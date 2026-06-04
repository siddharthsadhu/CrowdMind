/** Real footer with working links. Replaces the broken <a href="#"> links in every Stitch page. */
import { useNavigate } from 'react-router-dom'

export function PageFooter() {
  const navigate = useNavigate()

  const columns = [
    {
      title: 'Product',
      links: [
        { label: 'Library', to: '/library' },
        { label: 'Discussions', to: '/discussions' },
        { label: 'Ask Question', to: '/ask' },
        { label: 'Knowledge Evolution', to: '/evolution' },
      ],
    },
    {
      title: 'Account',
      links: [
        { label: 'Profile', to: '/home' },
        { label: 'Saved', to: '/saved' },
        { label: 'Notifications', to: '/notifications' },
        { label: 'Settings', to: '/settings' },
      ],
    },
    {
      title: 'Admin',
      links: [
        { label: 'Mission Control', to: '/admin' },
        { label: 'FAQ Management', to: '/admin/faq' },
        { label: 'Moderation', to: '/admin/moderation' },
        { label: 'Analytics', to: '/admin/analytics' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'About', to: '/' },
        { label: 'Status', to: '/' },
        { label: 'Privacy', to: '/' },
        { label: 'Terms', to: '/' },
      ],
    },
  ]

  return (
    <footer className="w-full py-16 bg-background border-t border-outline-variant/30 mt-16">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-6 md:px-12 max-w-[1280px] mx-auto">
        <div className="md:col-span-4">
          <p className="font-headline-md text-xl font-bold text-on-surface mb-4">CrowdMind</p>
          <p className="text-on-surface-variant text-sm max-w-xs leading-relaxed">
            Advancing cognitive clarity through crowdsourced AI intelligence and rigorous validation.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title} className="md:col-span-2">
            <h5 className="font-label-md text-primary mb-4 uppercase tracking-widest text-xs">
              {col.title}
            </h5>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <button
                    onClick={() => navigate(l.to)}
                    className="text-on-surface-variant hover:text-secondary transition-colors text-sm text-left"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="md:col-span-12 mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-on-surface-variant text-sm">
            &copy; {new Date().getFullYear()} CrowdMind AI. Cognitive Clarity in Crowd Intelligence.
          </p>
        </div>
      </div>
    </footer>
  )
}
