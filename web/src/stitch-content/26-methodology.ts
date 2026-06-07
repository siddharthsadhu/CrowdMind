/** Stitch-styled Methodology page content. Theme matches the rest of the app:
 *  dark surface, primary/secondary fixed text, glass-card hover, Material Symbols icons. */

const CYCLE_STEPS = [
  { icon: 'psychology', name: 'Ask', desc: 'Members pose questions grounded in real practice and research.' },
  { icon: 'forum', name: 'Discuss', desc: 'Domain experts and peers debate, refine, and surface nuance.' },
  { icon: 'rule', name: 'Review', desc: 'A rotating panel of moderators evaluates evidence and consensus.' },
  { icon: 'publish', name: 'Publish', desc: 'Curated answers become versioned FAQs in the public library.' },
  { icon: 'autorenew', name: 'Evolve', desc: 'New evidence triggers updates; every change is auditable.' },
]

const PILLARS = [
  {
    icon: 'groups',
    title: 'Crowdsourced intelligence',
    body: 'No single author owns an answer. Every FAQ is the product of dozens of contributors refining a shared truth.',
  },
  {
    icon: 'verified_user',
    title: 'Peer-reviewed by domain experts',
    body: 'Admins and trusted moderators review candidate FAQs against a transparent rubric: sources, agreement, and confidence.',
  },
  {
    icon: 'history_edu',
    title: 'Full audit trail',
    body: 'Every published FAQ carries its full version history. You can see exactly when a claim was added, changed, or reverted, and why.',
  },
  {
    icon: 'insights',
    title: 'Live consensus signals',
    body: 'Vote, save, and discussion activity feed directly into a real-time consensus score that ranks the most reliable answers first.',
  },
]

export const bodyHtml = `
<!-- Top nav (matches landing/library theme) -->
<nav class="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant/30">
  <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop h-16 flex items-center justify-between">
    <div class="flex items-center gap-8">
      <a class="font-display text-headline-md font-semibold text-primary tracking-tight" href="#">CrowdMind</a>
      <div class="hidden md:flex gap-6 items-center">
        <a class="text-on-surface-variant font-medium hover:text-primary transition-all duration-200 ease-out" href="#">FAQs</a>
        <a class="text-on-surface-variant font-medium hover:text-primary transition-all duration-200 ease-out" href="#">Discussions</a>
        <a class="text-on-surface-variant font-medium hover:text-primary transition-all duration-200 ease-out" href="#">Ask Question</a>
        <a class="text-on-surface-variant font-medium hover:text-primary transition-all duration-200 ease-out" href="#">Analytics</a>
        <a class="text-secondary-container font-medium transition-all duration-200 ease-out" href="#">Methodology</a>
      </div>
    </div>
    <div class="flex items-center gap-4">
      <div class="hidden lg:flex items-center bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/30">
        <span class="material-symbols-outlined text-outline mr-2 text-sm">search</span>
        <input class="bg-transparent border-none focus:ring-0 text-sm w-48 text-on-surface" placeholder="Search knowledge..." type="text">
      </div>
      <button class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">notifications</button>
      <div class="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center overflow-hidden border border-primary/20">
        <img alt="User profile menu" class="w-full h-full object-cover" src="">
      </div>
    </div>
  </div>
</nav>
<main class="pt-16">
<!-- Hero -->
<section class="relative pt-32 pb-20 px-margin-mobile md:px-margin-desktop overflow-hidden">
  <div class="absolute inset-0 -z-10 bg-gradient-to-br from-primary/15 via-transparent to-secondary/15"></div>
  <div class="max-w-container-max mx-auto text-center">
    <span class="inline-flex items-center gap-2 bg-primary-container/30 text-primary-container px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-primary-container/30 mb-6">
      <span class="material-symbols-outlined text-sm">auto_awesome</span> How CrowdMind Works
    </span>
    <h1 class="font-headline-xl text-headline-xl text-on-surface mb-6 leading-tight">
      Cognitive clarity, <span class="text-secondary">crowd-validated</span>
    </h1>
    <p class="text-on-surface-variant text-lg max-w-2xl mx-auto leading-relaxed">
      CrowdMind turns scattered institutional knowledge into a single, versioned, peer-reviewed source of truth.
      Here's how the system works, end to end.
    </p>
  </div>
</section>

<!-- Pillars -->
<section class="py-section-gap px-margin-mobile md:px-margin-desktop">
  <div class="max-w-container-max mx-auto">
    <h2 class="font-headline-lg text-headline-lg text-on-surface mb-2 text-center">The four pillars</h2>
    <p class="text-on-surface-variant text-center mb-12 max-w-2xl mx-auto">
      Every feature in CrowdMind serves one of these four guarantees.
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      ${PILLARS.map(
        (p) => `
      <div class="glass-card p-6 rounded-xl group transition-all hover:border-primary/40">
        <div class="w-12 h-12 rounded-xl bg-primary-container/30 text-primary flex items-center justify-center mb-4">
          <span class="material-symbols-outlined">${p.icon}</span>
        </div>
        <h3 class="font-headline-md text-lg font-bold text-on-surface mb-2">${p.title}</h3>
        <p class="text-on-surface-variant text-sm leading-relaxed">${p.body}</p>
      </div>`,
      ).join('')}
    </div>
  </div>
</section>

<!-- Lifecycle -->
<section class="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-container-lowest/50">
  <div class="max-w-container-max mx-auto">
    <h2 class="font-headline-lg text-headline-lg text-on-surface mb-2 text-center">The knowledge lifecycle</h2>
    <p class="text-on-surface-variant text-center mb-12 max-w-2xl mx-auto">
      A question becomes a trusted, versioned FAQ through five transparent steps.
    </p>
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
      ${CYCLE_STEPS.map(
        (s, i) => `
      <div class="glass-card p-5 rounded-xl text-center group transition-all hover:border-secondary/40">
        <div class="text-secondary-fixed text-xs font-bold tracking-widest mb-3">STEP ${i + 1}</div>
        <div class="w-14 h-14 rounded-full bg-secondary-container/30 text-secondary-container flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
          <span class="material-symbols-outlined text-2xl">${s.icon}</span>
        </div>
        <h3 class="font-headline-md text-base font-bold text-on-surface mb-2">${s.name}</h3>
        <p class="text-on-surface-variant text-xs leading-relaxed">${s.desc}</p>
      </div>`,
      ).join('')}
    </div>
  </div>
</section>

<!-- How a question becomes an FAQ (deep dive) -->
<section class="py-section-gap px-margin-mobile md:px-margin-desktop">
  <div class="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
    <div>
      <h2 class="font-headline-lg text-headline-lg text-on-surface mb-6">From question to consensus</h2>
      <p class="text-on-surface-variant leading-relaxed mb-6">
        When a member asks a question, an AI analysis surfaces candidate answers from the existing library and recent discussions.
        The community then debates, refines, and votes. Once the consensus score crosses a threshold, an admin publishes the answer as a new FAQ.
      </p>
      <ul class="space-y-3">
        <li class="flex items-start gap-3">
          <span class="material-symbols-outlined text-primary mt-0.5">check_circle</span>
          <span class="text-on-surface-variant"><strong class="text-on-surface">Confidence score</strong> &mdash; AI's own certainty, recalculated as the discussion evolves.</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="material-symbols-outlined text-primary mt-0.5">check_circle</span>
          <span class="text-on-surface-variant"><strong class="text-on-surface">Community agreement</strong> &mdash; weighted by member reputation and review history.</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="material-symbols-outlined text-primary mt-0.5">check_circle</span>
          <span class="text-on-surface-variant"><strong class="text-on-surface">Versioning</strong> &mdash; superseded answers remain readable and clearly marked.</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="material-symbols-outlined text-primary mt-0.5">check_circle</span>
          <span class="text-on-surface-variant"><strong class="text-on-surface">Reputation</strong> &mdash; trusted contributors earn moderation rights over time.</span>
        </li>
      </ul>
    </div>
    <div class="glass-card p-8 rounded-2xl">
      <h3 class="font-headline-md text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
        <span class="material-symbols-outlined text-secondary">auto_awesome</span>
        Try it
      </h3>
      <p class="text-on-surface-variant text-sm leading-relaxed mb-6">
        Browse the library, follow a discussion, or ask your own question. The best way to understand the methodology is to participate in it.
      </p>
      <div class="flex flex-col sm:flex-row gap-3">
        <button class="cm-cta-explore flex-1 px-5 py-3 bg-primary text-on-primary font-bold rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2">
          <span class="material-symbols-outlined text-sm">menu_book</span> Explore the library
        </button>
        <button class="cm-cta-join flex-1 px-5 py-3 bg-white/5 border border-white/10 text-on-surface font-bold rounded-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2">
          <span class="material-symbols-outlined text-sm">person_add</span> Join the community
        </button>
      </div>
      <button class="cm-cta-evolution w-full mt-3 px-5 py-3 text-secondary-container font-medium hover:underline flex items-center justify-center gap-2">
        <span class="material-symbols-outlined text-sm">timeline</span> Learn about Knowledge Evolution
      </button>
    </div>
  </div>
</section>
</main>
`

export const pageStyles = `
.cm-cta-explore, .cm-cta-join, .cm-cta-evolution { cursor: pointer; }
`
