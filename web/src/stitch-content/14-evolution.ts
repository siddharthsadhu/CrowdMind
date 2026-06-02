// Auto-generated from public/stitch-ref/14-evolution.html — do not edit by hand
export const pageStyles = `
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-card {
            background: rgba(22, 27, 34, 0.7);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease-out;
        }
        .glass-card:hover {
            border-color: rgba(176, 198, 255, 0.3);
            box-shadow: 0 0 20px rgba(176, 198, 255, 0.05);
        }
        .evolution-line {
            background: linear-gradient(to bottom, transparent, #b0c6ff 15%, #b0c6ff 85%, transparent);
            width: 2px;
            filter: drop-shadow(0 0 8px #b0c6ff);
        }
        .node-glow {
            box-shadow: 0 0 15px rgba(176, 198, 255, 0.4);
        }
        ::-webkit-scrollbar {
            width: 6px;
        }
        ::-webkit-scrollbar-track {
            background: #111319;
        }
        ::-webkit-scrollbar-thumb {
            background: #33343b;
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #424654;
        }
    `
export const bodyHtml = `<!-- TopNavBar Shell -->
<nav class="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-xl border-b border-white/10 shadow-sm h-20">
<div class="flex items-center justify-between px-margin-desktop max-w-container-max mx-auto h-full">
<div class="flex items-center gap-12">
<a class="font-display text-display font-semibold text-primary text-[24px]" href="#">CrowdMind</a>
<div class="hidden md:flex items-center gap-8">
<a class="text-on-surface-variant font-medium hover:text-primary transition-all duration-200 ease-out" href="#">FAQs</a>
<a class="text-on-surface-variant font-medium hover:text-primary transition-all duration-200 ease-out" href="#">Discussions</a>
<a class="text-on-surface-variant font-medium hover:text-primary transition-all duration-200 ease-out" href="#">Ask Question</a>
<a class="text-primary font-bold border-b-2 border-primary pb-1" href="#">Analytics</a>
</div>
</div>
<div class="flex items-center gap-6">
<div class="relative hidden lg:block">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
<input class="bg-surface-container-low border border-outline-variant/30 rounded-lg pl-10 pr-4 py-2 text-label-md focus:ring-1 focus:ring-primary focus:outline-none w-64" placeholder="Search knowledge..." type="text">
</div>
<button class="text-on-surface-variant hover:text-primary transition-colors flex items-center">
<span class="material-symbols-outlined">notifications</span>
</button>
<div class="h-10 w-10 rounded-full bg-surface-container-high border border-outline-variant/50 overflow-hidden">
<img alt="User profile menu" class="w-full h-full object-cover" data-alt="A professional close-up portrait of a thoughtful person in a high-tech environment. The lighting is low-key with soft blue and white highlights, matching a dark-mode UI aesthetic. The person has a neutral, intelligent expression, and the background is a soft-focus laboratory or modern office space." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWb1nTowRWf29ZVB6IVmnAVlO5IFL-i_GRJLYP9SFOa_vFOkzPhsAsXg2XCFDyTSuHUQ5z-8arq0tAZp6_asDnwrJ_UN011AEiWqkgvJOlDLY8Ruvgp57BJuxk2QbmFLBR_JKXezTFmjzQWsyEmA-EV0D9JCjouExCXP5yYc4LlqknNyU_weoi3xUqd9g5NB3wESVVLo9Cz6ZMR0fba53tUzXkTGWGRAdfEmQyqaG0FvyuDVADJREJ2kwd5eZVo6jdeFTD4zMu6gCv">
</div>
</div>
</div>
</nav>
<main class="pt-32 pb-section-gap px-margin-desktop max-w-container-max mx-auto">
<!-- Header Section -->
<header class="mb-12 text-center md:text-left">
<h1 class="font-display text-headline-lg text-on-surface mb-2">Self-Evolving Knowledge Engine</h1>
<p class="font-body-md text-on-surface-variant">Knowledge improves as the community learns.</p>
</header>
<div class="grid grid-cols-1 md:grid-cols-12 gap-gutter">
<!-- Left Panel: Evolution Events -->
<aside class="md:col-span-3 space-y-6"><div class="flex items-center justify-between mb-4">
<h2 class="font-headline-md text-on-surface text-[18px]">Evolution Insights</h2>
<span class="material-symbols-outlined text-primary">insight_spark</span>
</div>
<div class="glass-card rounded-xl p-4 space-y-4">
<div class="border-l-2 border-primary pl-4">
<p class="text-label-sm text-primary mb-1 uppercase tracking-wider">Policy-Driven</p>
<p class="font-body-md text-[14px] text-on-surface-variant leading-relaxed">FAQ updated due to Q3 structural realignment.</p>
</div>
<div class="border-l-2 border-secondary-fixed-dim pl-4">
<p class="text-label-sm text-secondary-fixed-dim mb-1 uppercase tracking-wider">Consensus-Driven</p>
<p class="font-body-md text-[14px] text-on-surface-variant leading-relaxed">Definition refined following community disagreement in Thread #882.</p>
</div>
<div class="border-l-2 border-tertiary pl-4">
<p class="text-label-sm text-tertiary mb-1 uppercase tracking-wider">Admin-Led</p>
<p class="font-body-md text-[14px] text-on-surface-variant leading-relaxed">Accuracy improved via manual expert validation.</p>
</div>
</div></aside>
<!-- Center Visualization (Hero) -->
<section class="md:col-span-6 relative flex flex-col items-center"><div class="relative z-10 w-full mb-12">
<div class="flex flex-col items-center">
<div class="h-16 w-16 rounded-full bg-secondary-container flex items-center justify-center node-glow border-4 border-surface ring-2 ring-secondary-container/20 animate-pulse">
<span class="material-symbols-outlined text-on-secondary-container text-[32px]" data-weight="fill">auto_awesome</span>
</div>
<div class="mt-4 glass-card p-6 rounded-2xl border-secondary-container/50 w-full max-w-sm text-center">
<div class="flex justify-between items-center mb-2">
<span class="text-secondary-fixed-dim font-label-md">VERSION 4.0</span>
<span class="text-[10px] text-outline px-2 py-0.5 rounded-full border border-outline/30">Oct 24, 2024</span>
</div>
<h4 class="font-headline-md text-on-surface mb-2">Neural Synthesis</h4>
<div class="flex flex-wrap justify-center gap-3 text-[12px] text-on-surface-variant">
<span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">thumb_up</span> 482 votes</span>
<span>•</span>
<span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">forum</span> 14 threads</span>
</div>
<div class="mt-4 bg-surface-container-low p-2 rounded text-[12px] border border-outline-variant/30 text-on-surface-variant">
<span class="text-secondary-fixed-dim font-bold">Reason:</span> Community Consensus Shift.
            </div>
</div>
</div>
</div>
<div class="evolution-line absolute top-0 bottom-0 z-0"></div>
<!-- Node: Version 3 (Active/Newest) -->
<div class="relative z-10 w-full mb-12">
<div class="flex flex-col items-center">
<div class="h-16 w-16 rounded-full bg-primary flex items-center justify-center node-glow border-4 border-surface ring-2 ring-primary/20">
<span class="material-symbols-outlined text-on-primary text-[32px]" data-weight="fill">deployed_code</span>
</div>
<div class="mt-4 glass-card p-6 rounded-2xl border-primary/50 w-full max-w-sm text-center"><div class="flex justify-between items-center mb-2">
<span class="text-primary font-label-md">VERSION 3.0</span>
<span class="text-[10px] text-outline">Sept 15, 2024</span>
</div>
<h4 class="font-headline-md text-on-surface mb-2">Cognitive Integration</h4>
<div class="flex justify-center gap-4 text-[12px] text-on-surface-variant">
<span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">thumb_up</span> 312 votes</span>
<span>•</span>
<span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">forum</span> 8 threads</span>
</div>
<p class="mt-4 font-body-md text-[14px] italic text-primary/80 leading-snug">"Advanced neural mapping for complex queries."</p></div>
</div>
</div>
<!-- Node: Version 2 -->
<div class="relative z-10 w-full mb-12">
<div class="flex flex-col items-center">
<div class="h-12 w-12 rounded-full bg-surface-container-high border-2 border-outline-variant flex items-center justify-center hover:bg-surface-variant transition-colors group">
<span class="material-symbols-outlined text-outline group-hover:text-on-surface">history</span>
</div>
<div class="mt-4 glass-card p-4 rounded-xl w-full max-w-xs text-center"><div class="flex justify-between items-center mb-1">
<span class="text-on-surface-variant font-label-md">VERSION 2.0</span>
<span class="text-[10px] text-outline">Aug 02, 2024</span>
</div>
<div class="flex justify-center gap-3 text-[11px] text-outline mb-2">
<span>124 votes</span>
<span>•</span>
<span>5 threads</span>
</div>
<div class="bg-surface-container-low p-2 rounded text-[12px] border border-outline-variant/30 text-on-surface-variant">
<span class="text-primary font-bold">Reason:</span> New internship policy update.
</div></div>
</div>
</div>
<!-- Node: Version 1 -->
<div class="relative z-10 w-full">
<div class="flex flex-col items-center">
<div class="h-10 w-10 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant">
<span class="material-symbols-outlined text-outline text-[20px]">inventory_2</span>
</div>
<div class="mt-4 glass-card p-4 rounded-xl w-full max-w-xs text-center opacity-60">
<div class="text-on-surface-variant font-label-md">VERSION 1.0</div>
<div class="text-label-sm">Team size = 3</div>
</div>
</div>
</div>
</section>
<!-- Right Panel: Knowledge Health Metrics -->
<aside class="md:col-span-3 space-y-6">
<h2 class="font-headline-md text-on-surface text-[18px] mb-2">Health Metrics</h2>
<div class="glass-card rounded-xl p-5">
<div class="flex justify-between items-start mb-4">
<div>
<p class="text-label-md text-on-surface-variant">FAQ Accuracy</p>
<p class="text-headline-md text-primary">98.4%</p>
</div>
<div class="relative h-12 w-12">
<svg class="h-full w-full -rotate-90" viewBox="0 0 36 36">
<circle class="stroke-surface-variant" cx="18" cy="18" fill="none" r="16" stroke-width="3"></circle>
<circle class="stroke-primary" cx="18" cy="18" fill="none" r="16" stroke-dasharray="98.4, 100" stroke-linecap="round" stroke-width="3"></circle>
</svg>
</div>
</div>
<div class="h-10 w-full bg-surface-container-low rounded flex items-end gap-1 px-2 pb-1">
<div class="w-1/6 bg-primary/40 h-2 rounded-t-sm"></div>
<div class="w-1/6 bg-primary/40 h-4 rounded-t-sm"></div>
<div class="w-1/6 bg-primary/40 h-3 rounded-t-sm"></div>
<div class="w-1/6 bg-primary/40 h-6 rounded-t-sm"></div>
<div class="w-1/6 bg-primary/40 h-5 rounded-t-sm"></div>
<div class="w-1/6 bg-primary h-8 rounded-t-sm"></div>
</div>
</div>
<div class="glass-card rounded-xl p-5">
<div class="flex justify-between items-center mb-2">
<p class="text-label-md text-on-surface-variant">Community Agreement</p>
<span class="text-secondary-fixed-dim text-label-sm">+2.1%</span>
</div>
<p class="text-headline-md text-on-surface">89%</p>
</div>
<div class="glass-card rounded-xl p-5">
<div class="flex justify-between items-center mb-2">
<p class="text-label-md text-on-surface-variant">Evolution Frequency</p>
<span class="material-symbols-outlined text-outline text-sm">info</span>
</div>
<p class="text-headline-md text-on-surface">3.2 <span class="text-label-sm text-on-surface-variant">v/mo</span></p>
</div>
<div class="glass-card rounded-xl p-5"><div class="flex justify-between items-center mb-4">
<p class="text-label-md text-on-surface-variant">Knowledge Stability</p>
<span class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold ring-1 ring-primary/20">
<span class="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
        STABLE
    </span>
</div>
<div class="w-full bg-surface-variant h-2 rounded-full mt-3 overflow-hidden">
<div class="bg-primary h-full w-[76%] shadow-[0_0_10px_rgba(176,198,255,0.5)]"></div>
</div>
<div class="flex justify-between items-center mt-3">
<p class="text-label-sm text-outline">Trend: +4.2%</p>
<p class="text-label-sm text-on-surface font-bold">76% Score</p>
</div></div>
</aside>
</div>
<!-- Bottom Section: Interactive Version Comparison -->
<section class="mt-section-gap">
<div class="flex items-center justify-between mb-6">
<div>
<h2 class="font-headline-lg text-on-surface text-[24px]">Knowledge Diff Viewer</h2>
<p class="font-body-md text-on-surface-variant">Comparing Version 2.0 vs Version 3.0</p>
</div>
<div class="flex gap-3">
<button class="bg-surface-container-high border border-outline-variant px-4 py-2 rounded-lg text-label-md flex items-center gap-2 hover:bg-surface-variant transition-all">
<span class="material-symbols-outlined text-sm">settings_backup_restore</span>
                        Rollback
                    </button>
<button class="bg-primary text-on-primary px-4 py-2 rounded-lg text-label-md font-bold hover:brightness-110 transition-all">
                        Approve Change
                    </button>
</div>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-px bg-outline-variant/30 rounded-2xl overflow-hidden border border-outline-variant/30">
<div class="glass-card !border-0 p-8">
<div class="flex items-center gap-2 mb-4">
<span class="h-2 w-2 rounded-full bg-outline"></span>
<span class="font-label-md text-outline">v2.0 · Legacy</span>
</div>
<h5 class="font-headline-md text-on-surface mb-4">Security Policy &amp; Access Control</h5>
<div class="font-body-md text-on-surface-variant space-y-4 leading-relaxed">
<p>All employees are granted access to the internal data lake upon completing the standard onboarding sequence. <span class="bg-error/20 text-error px-1 rounded line-through">Access levels are managed by regional department heads through a manual ticket system.</span></p>
<p>Credentials must be rotated every 90 days. <span class="bg-error/20 text-error px-1 rounded line-through">Security patches are applied weekly on Sundays.</span></p>
</div>
</div>
<div class="glass-card !border-0 p-8 bg-primary-container/5">
<div class="flex items-center gap-2 mb-4">
<span class="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
<span class="font-label-md text-primary">v3.0 · Active Evolution</span>
</div>
<h5 class="font-headline-md text-on-surface mb-4">Security Policy &amp; Access Control</h5>
<div class="font-body-md text-on-surface-variant space-y-4 leading-relaxed">
<p>All employees are granted access to the internal data lake upon completing the standard onboarding sequence. <span class="bg-primary/20 text-primary px-1 rounded">Dynamic RBAC (Role-Based Access Control) now automates permissions based on project metadata.</span></p>
<p>Credentials must be rotated every 90 days. <span class="bg-primary/20 text-primary px-1 rounded">Real-time patch management enables continuous vulnerability remediation without downtime.</span></p>
</div>
</div>
</div>
</section>
</main>
<!-- Footer -->
<footer class="w-full py-section-gap bg-background border-t border-outline-variant/30">
<div class="grid grid-cols-1 md:grid-cols-12 gap-gutter px-margin-desktop max-w-container-max mx-auto">
<div class="md:col-span-4">
<div class="font-headline-md text-headline-md font-bold text-on-surface mb-4">CrowdMind</div>
<p class="font-body-md text-on-surface-variant max-w-xs">Cognitive Clarity in Crowd Intelligence. Empowering analysts with evolved AI knowledge systems.</p>
</div>
<div class="md:col-span-2">
<h6 class="font-label-md text-primary mb-4">Product</h6>
<ul class="space-y-2 text-on-surface-variant font-label-sm">
<li><a class="hover:text-secondary transition-colors" href="#">Evolution</a></li>
<li><a class="hover:text-secondary transition-colors" href="#">Analytics</a></li>
<li><a class="hover:text-secondary transition-colors" href="#">Integrations</a></li>
</ul>
</div>
<div class="md:col-span-2">
<h6 class="font-label-md text-primary mb-4">Community</h6>
<ul class="space-y-2 text-on-surface-variant font-label-sm">
<li><a class="hover:text-secondary transition-colors" href="#">Discussions</a></li>
<li><a class="hover:text-secondary transition-colors" href="#">Events</a></li>
<li><a class="hover:text-secondary transition-colors" href="#">Guidelines</a></li>
</ul>
</div>
<div class="md:col-span-2">
<h6 class="font-label-md text-primary mb-4">Resources</h6>
<ul class="space-y-2 text-on-surface-variant font-label-sm">
<li><a class="hover:text-secondary transition-colors" href="#">Documentation</a></li>
<li><a class="hover:text-secondary transition-colors" href="#">API Reference</a></li>
<li><a class="hover:text-secondary transition-colors" href="#">Privacy</a></li>
</ul>
</div>
<div class="md:col-span-12 mt-12 pt-8 border-t border-outline-variant/10 text-center">
<p class="font-label-sm text-on-surface-variant">© 2024 CrowdMind AI. Cognitive Clarity in Crowd Intelligence.</p>
</div>
</div>
</footer>`
