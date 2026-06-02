// Auto-generated from public/stitch-ref/15-mission-control.html — do not edit by hand
export const pageStyles = `
        :root {
            --glass-bg: rgba(22, 27, 34, 0.7);
            --glass-border: rgba(255, 255, 255, 0.08);
        }
        body {
            background-color: #0A0C12;
            color: #e2e2eb;
            font-family: 'Inter', sans-serif;
        }
        .glass-card {
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-top: 1px solid rgba(255, 255, 255, 0.12);
            transition: all 0.3s ease-out;
        }
        .glass-card:hover {
            border-color: rgba(176, 198, 255, 0.3);
            background: rgba(26, 31, 39, 0.8);
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #33343b;
            border-radius: 10px;
        }
        @keyframes pulse-dot {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(176, 198, 255, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(176, 198, 255, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(176, 198, 255, 0); }
        }
        .pulse-live {
            animation: pulse-dot 2s infinite;
        }
        .funnel-step::after {
            content: "→";
            position: absolute;
            right: -1rem;
            top: 50%;
            transform: translateY(-50%);
            color: rgba(255,255,255,0.2);
            font-size: 1.5rem;
        }
        .funnel-step:last-child::after { content: none; }
    `
export const bodyHtml = `<!-- TopNavBar -->
<nav class="fixed top-0 w-full z-50 bg-surface/70 dark:bg-surface-container-lowest/70 backdrop-blur-xl border-b border-white/10 shadow-sm">
<div class="max-w-container-max mx-auto px-margin-desktop flex items-center justify-between h-20">
<div class="flex items-center gap-10">
<span class="text-headline-md font-display font-semibold tracking-tight text-primary">CrowdMind</span>
<div class="hidden md:flex gap-8">
<a class="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" href="#">FAQs</a>
<a class="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" href="#">Discussions</a>
<a class="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" href="#">Ask Question</a>
<a class="font-body-md text-body-md text-primary font-bold border-b-2 border-primary pb-1 flex items-center gap-2" href="#">
                    Analytics
                    <span class="w-1.5 h-1.5 rounded-full bg-primary pulse-live"></span>
</a>
</div>
</div>
<div class="flex items-center gap-6">
<button class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-all duration-200 active:scale-95" data-icon="notifications">notifications</button>
<div class="w-10 h-10 rounded-full border border-white/10 overflow-hidden cursor-pointer active:scale-95 duration-200">
<img alt="User Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeF92pVGfIM9M46Io6Djpezxfa36l7nNvR7rrS6dQHZRuZUzydq3P2-TtDOOUxLL7y5KyKwPF11zyWDbCjykrCTYdfu4Lsf6axiDi_UL37bwhJBRGLmxfqspdQeyW4F8ePToSnuS5vq8BnwlHdozkzTg3Xwtedelpo1hDcNnmoHmqkUSsIjrEely-sS8asVI4Sceb5F51w7QU2DR9h5qFIMUQg4gxlASvlKUc8CxWfKYA3-tARb7dkNTGOeVo9uRq1q0aTn8Dn3M1J">
</div>
</div>
</div>
</nav>
<main class="pt-32 pb-20 max-w-container-max mx-auto px-margin-desktop">
<!-- Header -->
<header class="mb-12 flex justify-between items-end">
<div>
<div class="flex items-center gap-3 mb-2">
<h1 class="font-display text-headline-lg text-on-surface">Mission Control</h1>
<span class="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5">
<span class="w-1 h-1 rounded-full bg-primary pulse-live"></span>
                    Live Dashboard
                </span>
</div>
<p class="font-body-md text-body-md text-on-surface-variant">Real-time governance and knowledge synthesis monitoring.</p>
</div>
<div class="text-right">
<p class="font-label-sm text-outline mb-1">System Uptime</p>
<p class="font-headline-md text-secondary-fixed-dim">99.98%</p>
</div>
</header>
<!-- 1. FAQ Conversion Funnel -->
<section class="mb-12">
<div class="glass-card p-8 rounded-2xl relative overflow-hidden border-l-4 border-primary">
<div class="flex justify-between items-center mb-8">
<h3 class="font-headline-md text-on-surface flex items-center gap-3">
                    Knowledge Conversion Funnel
                    <span class="material-symbols-outlined text-primary/50 text-xl" data-icon="filter_alt">filter_alt</span>
</h3>
<div class="flex items-center gap-3">
<span class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-label-sm text-outline">
<span class="w-2 h-2 rounded-full bg-primary pulse-live"></span>
                        Real-time Data Stream
                    </span>
<span class="text-label-sm text-outline">Updated: 12s ago</span>
</div>
</div>
<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative">
<!-- Funnel Step 1 -->
<div class="funnel-step relative text-center">
<p class="font-label-sm text-outline mb-2">Questions</p>
<p class="font-display text-3xl font-bold mb-1">12.4k</p>
<div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
<div class="h-full bg-primary/30 w-full"></div>
</div>
</div>
<!-- Funnel Step 2 -->
<div class="funnel-step relative text-center">
<p class="font-label-sm text-outline mb-2">Discussions</p>
<p class="font-display text-3xl font-bold mb-1 text-primary-fixed-dim">3.1k</p>
<div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
<div class="h-full bg-primary/50 w-[25%]"></div>
</div>
<p class="text-[10px] mt-2 font-bold text-primary">25% CONV</p>
</div>
<!-- Funnel Step 3 -->
<div class="funnel-step relative text-center">
<p class="font-label-sm text-outline mb-2">Consensus</p>
<p class="font-display text-3xl font-bold mb-1 text-secondary-container">1.9k</p>
<div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
<div class="h-full bg-secondary-container w-[61%]"></div>
</div>
<p class="text-[10px] mt-2 font-bold text-secondary-container">61% CONV</p>
</div>
<!-- Funnel Step 4 -->
<div class="funnel-step relative text-center">
<p class="font-label-sm text-outline mb-2">Synthesized</p>
<p class="font-display text-3xl font-bold mb-1 text-tertiary">842</p>
<div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
<div class="h-full bg-tertiary w-[44%]"></div>
</div>
<p class="text-[10px] mt-2 font-bold text-tertiary">44% CONV</p>
</div>
<!-- Funnel Step 5 -->
<div class="funnel-step relative text-center">
<p class="font-label-sm text-outline mb-2">Candidates</p>
<p class="font-display text-3xl font-bold mb-1 text-primary">156</p>
<div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
<div class="h-full bg-primary w-[18%]"></div>
</div>
<p class="text-[10px] mt-2 font-bold text-primary">18% CONV</p>
</div>
<!-- Funnel Step 6 -->
<div class="text-center">
<p class="font-label-sm text-outline mb-2">Published</p>
<p class="font-display text-3xl font-bold mb-1 text-secondary-fixed">1,284</p>
<div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
<div class="h-full bg-secondary-fixed w-[8%]"></div>
</div>
<p class="text-[10px] mt-2 font-bold text-secondary-fixed">8% CONV</p>
</div>
</div>
</div>
</section>
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
<!-- Left Column -->
<div class="lg:col-span-8 space-y-8">
<!-- 2. Priority Review Queue Metrics Row -->
<section class="grid grid-cols-2 md:grid-cols-4 gap-4">
<div class="glass-card p-4 rounded-xl border-l-4 border-primary">
<p class="font-label-sm text-outline mb-1">AI Confidence</p>
<div class="flex items-end justify-between">
<p class="font-headline-md text-primary">98%</p>
<span class="text-[10px] text-primary bg-primary/10 px-1 rounded">PEAK</span>
</div>
</div>
<div class="glass-card p-4 rounded-xl border-l-4 border-secondary-container">
<p class="font-label-sm text-outline mb-1">Agreement</p>
<div class="flex items-end justify-between">
<p class="font-headline-md text-secondary-container">94%</p>
<span class="text-[10px] text-secondary-container bg-secondary-container/10 px-1 rounded">ELITE</span>
</div>
</div>
<div class="glass-card p-4 rounded-xl border-l-4 border-primary-fixed-dim">
<p class="font-label-sm text-outline mb-1">Most Viewed</p>
<div class="flex items-end justify-between">
<p class="font-headline-md text-primary-fixed-dim">12.4k</p>
<span class="text-[10px] text-primary-fixed-dim bg-primary/10 px-1 rounded">TRENDING</span>
</div>
</div>
<div class="glass-card p-4 rounded-xl border-l-4 border-error">
<p class="font-label-sm text-outline mb-1">Most Reported</p>
<div class="flex items-end justify-between">
<p class="font-headline-md text-error">17</p>
<span class="text-[10px] text-error bg-error/10 px-1 rounded">PRIORITY</span>
</div>
</div>
</section>
<!-- Pending FAQ Candidates Table -->
<section class="glass-card rounded-2xl overflow-hidden">
<div class="p-6 border-b border-white/5 flex justify-between items-center">
<h3 class="font-headline-md text-on-surface">Queue: FAQ Candidates</h3>
<div class="flex gap-4">
<button class="text-outline hover:text-primary transition-colors flex items-center gap-1 font-label-md">
<span class="material-symbols-outlined text-sm" data-icon="filter_list">filter_list</span> Filter
                        </button>
<button class="text-primary font-label-md text-label-md hover:underline">View All Candidates</button>
</div>
</div>
<div class="overflow-x-auto">
<table class="w-full text-left">
<thead class="bg-surface-container-low/50">
<tr>
<th class="px-6 py-4 font-label-sm text-label-sm text-outline">ID</th>
<th class="px-6 py-4 font-label-sm text-label-sm text-outline">Title</th>
<th class="px-6 py-4 font-label-sm text-label-sm text-outline">Confidence</th>
<th class="px-6 py-4 font-label-sm text-label-sm text-outline">Status</th>
<th class="px-6 py-4 font-label-sm text-label-sm text-outline text-right">Action</th>
</tr>
</thead>
<tbody class="divide-y divide-white/5">
<tr class="hover:bg-white/5 transition-colors">
<td class="px-6 py-4 font-label-md text-label-md">#FC-902</td>
<td class="px-6 py-4 font-body-md text-body-md font-medium">Neural Drift Patterns in LLMs</td>
<td class="px-6 py-4">
<div class="flex items-center gap-2">
<div class="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
<div class="w-[94%] h-full bg-primary shadow-[0_0_8px_rgba(176,198,255,0.5)]"></div>
</div>
<span class="font-label-sm text-label-sm">94%</span>
</div>
</td>
<td class="px-6 py-4">
<span class="px-2 py-0.5 rounded-full bg-secondary-container/10 border border-secondary-container/20 text-secondary-container text-[10px] font-bold">READY</span>
</td>
<td class="px-6 py-4 text-right">
<button class="bg-primary text-on-primary px-4 py-1.5 rounded-lg font-label-md text-label-md hover:brightness-110 active:scale-95 transition-all">Review</button>
</td>
</tr>
<tr class="hover:bg-white/5 transition-colors">
<td class="px-6 py-4 font-label-md text-label-md">#FC-899</td>
<td class="px-6 py-4 font-body-md text-body-md font-medium">Community Governance Protocols</td>
<td class="px-6 py-4">
<div class="flex items-center gap-2">
<div class="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
<div class="w-[82%] h-full bg-primary shadow-[0_0_8px_rgba(176,198,255,0.5)]"></div>
</div>
<span class="font-label-sm text-label-sm">82%</span>
</div>
</td>
<td class="px-6 py-4">
<span class="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-outline text-[10px] font-bold">PENDING</span>
</td>
<td class="px-6 py-4 text-right">
<button class="bg-primary text-on-primary px-4 py-1.5 rounded-lg font-label-md text-label-md hover:brightness-110 active:scale-95 transition-all">Review</button>
</td>
</tr>
<tr class="hover:bg-white/5 transition-colors">
<td class="px-6 py-4 font-label-md text-label-md">#FC-887</td>
<td class="px-6 py-4 font-body-md text-body-md font-medium">Quantum Consensus Benchmarks</td>
<td class="px-6 py-4">
<div class="flex items-center gap-2">
<div class="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
<div class="w-[97%] h-full bg-primary shadow-[0_0_8px_rgba(176,198,255,0.5)]"></div>
</div>
<span class="font-label-sm text-label-sm">97%</span>
</div>
</td>
<td class="px-6 py-4">
<span class="px-2 py-0.5 rounded-full bg-secondary-container/10 border border-secondary-container/20 text-secondary-container text-[10px] font-bold">READY</span>
</td>
<td class="px-6 py-4 text-right">
<button class="bg-primary text-on-primary px-4 py-1.5 rounded-lg font-label-md text-label-md hover:brightness-110 active:scale-95 transition-all">Review</button>
</td>
</tr>
</tbody>
</table>
</div>
</section>
<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
<!-- 3. Live Platform Activity Feed -->
<section class="glass-card rounded-2xl p-6 relative">
<div class="flex justify-between items-center mb-6">
<h3 class="font-headline-md text-on-surface">Live Activity Feed</h3>
<span class="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold tracking-tighter">LIVE FEED</span>
</div>
<div class="relative pl-6 border-l border-white/10 space-y-6">
<div class="relative">
<span class="absolute -left-[29px] top-1 w-2 h-2 rounded-full bg-primary pulse-live"></span>
<p class="font-body-md text-body-md text-on-surface">New Discussion Created</p>
<p class="font-label-sm text-label-sm text-outline flex items-center gap-2">
                                Topic: Neural Architectures • 2m ago
                            </p>
</div>
<div class="relative">
<span class="absolute -left-[29px] top-1 w-2 h-2 rounded-full bg-secondary-container"></span>
<p class="font-body-md text-body-md text-on-surface">Consensus reached on #901</p>
<p class="font-label-sm text-label-sm text-outline">Promoted to AI Synthesis • 15m ago</p>
</div>
<div class="relative">
<span class="absolute -left-[29px] top-1 w-2 h-2 rounded-full bg-tertiary"></span>
<p class="font-body-md text-body-md text-on-surface">FAQ Candidate Generated</p>
<p class="font-label-sm text-label-sm text-outline">Candidate #FC-912 • 45m ago</p>
</div>
<div class="relative">
<span class="absolute -left-[29px] top-1 w-2 h-2 rounded-full bg-secondary-fixed"></span>
<p class="font-body-md text-body-md text-on-surface">FAQ #402 Published</p>
<p class="font-label-sm text-label-sm text-outline">By Admin: Sarah K. • 1h ago</p>
</div>
<div class="relative">
<span class="absolute -left-[29px] top-1 w-2 h-2 rounded-full bg-error"></span>
<p class="font-body-md text-body-md text-on-surface">Report Submitted</p>
<p class="font-label-sm text-label-sm text-outline">Thread #12,392 • 2h ago</p>
</div>
</div>
</section>
<!-- 4. Moderator Activity Today -->
<section class="glass-card rounded-2xl p-6 flex flex-col">
<h3 class="font-headline-md text-on-surface mb-6">Moderator Activity Today</h3>
<div class="grid grid-cols-2 gap-4 mb-auto">
<div class="p-4 bg-white/5 rounded-xl border border-white/10">
<p class="font-display text-2xl font-bold text-primary">142</p>
<p class="font-label-sm text-outline uppercase text-[10px]">FAQs Approved</p>
</div>
<div class="p-4 bg-white/5 rounded-xl border border-white/10">
<p class="font-display text-2xl font-bold text-error">18</p>
<p class="font-label-sm text-outline uppercase text-[10px]">FAQs Rejected</p>
</div>
<div class="p-4 bg-white/5 rounded-xl border border-white/10">
<p class="font-display text-2xl font-bold text-secondary-container">56</p>
<p class="font-label-sm text-outline uppercase text-[10px]">Reports Resolved</p>
</div>
<div class="p-4 bg-white/5 rounded-xl border border-white/10">
<p class="font-display text-2xl font-bold text-tertiary">89</p>
<p class="font-label-sm text-outline uppercase text-[10px]">Disc. Moderated</p>
</div>
</div>
<div class="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
<div class="flex items-center gap-2 text-error">
<span class="material-symbols-outlined text-sm" data-icon="report_problem">report_problem</span>
<span class="text-label-sm font-bold">3 High Priority Alerts</span>
</div>
<button class="text-label-sm text-outline hover:text-on-surface underline">View All Alerts</button>
</div>
</section>
</div>
</div>
<!-- Right Column -->
<aside class="lg:col-span-4 space-y-8">
<!-- 5. System Status Panel -->
<section class="glass-card p-6 rounded-2xl border-t-2 border-secondary-container">
<div class="flex justify-between items-center mb-4">
<h4 class="font-label-md text-label-md text-on-surface uppercase font-bold tracking-widest flex items-center gap-2">
<span class="material-symbols-outlined text-secondary-container text-lg" data-icon="terminal">terminal</span>
                        System Health
                    </h4>
<span class="text-[10px] text-secondary-container flex items-center gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-secondary-container pulse-live"></span>
                        SYNCED
                    </span>
</div>
<div class="space-y-4">
<div class="flex justify-between items-center p-2 rounded bg-white/5">
<span class="font-label-sm text-outline">AI Engine</span>
<div class="flex items-center gap-2">
<span class="text-label-sm text-secondary-container font-mono">OPERATIONAL</span>
<span class="w-2 h-2 rounded-full bg-secondary-container"></span>
</div>
</div>
<div class="flex justify-between items-center p-2 rounded bg-white/5">
<span class="font-label-sm text-outline">Validation Engine</span>
<div class="flex items-center gap-2">
<span class="text-label-sm text-secondary-container font-mono">OPERATIONAL</span>
<span class="w-2 h-2 rounded-full bg-secondary-container"></span>
</div>
</div>
<div class="flex justify-between items-center p-2 rounded bg-white/5">
<span class="font-label-sm text-outline">Evolution Engine</span>
<div class="flex items-center gap-2">
<span class="text-label-sm text-secondary-container font-mono">OPERATIONAL</span>
<span class="w-2 h-2 rounded-full bg-secondary-container"></span>
</div>
</div>
<div class="flex justify-between items-center p-2 rounded bg-white/5">
<span class="font-label-sm text-outline">Moderation System</span>
<div class="flex items-center gap-2">
<span class="text-label-sm text-secondary-container font-mono">OPERATIONAL</span>
<span class="w-2 h-2 rounded-full bg-secondary-container"></span>
</div>
</div>
</div>
</section>
<!-- Quick Actions (Control Center) -->
<section class="glass-card p-6 rounded-2xl">
<h4 class="font-label-md text-label-md text-primary mb-4 uppercase tracking-wider font-bold">Control Center</h4>
<div class="grid grid-cols-1 gap-3">
<button class="w-full text-left p-3 rounded-xl bg-primary text-on-primary flex items-center justify-between group transition-all hover:brightness-110 active:scale-95">
<span class="font-body-md font-semibold">Review FAQ Candidates</span>
<span class="material-symbols-outlined transition-transform group-hover:translate-x-1" data-icon="arrow_forward">arrow_forward</span>
</button>
<button class="w-full text-left p-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 flex items-center justify-between group transition-all active:scale-95">
<span class="font-body-md">FAQ Management</span>
<span class="material-symbols-outlined text-outline" data-icon="settings">settings</span>
</button>
<button class="w-full text-left p-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 flex items-center justify-between group transition-all active:scale-95">
<span class="font-body-md">Moderation Queue</span>
<span class="material-symbols-outlined text-outline" data-icon="shield">shield</span>
</button>
<button class="w-full text-left p-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 flex items-center justify-between group transition-all active:scale-95">
<span class="font-body-md">View Analytics</span>
<span class="material-symbols-outlined text-outline" data-icon="bar_chart">bar_chart</span>
</button>
</div>
</section>
<!-- Knowledge Stability Gauge -->
<section class="glass-card p-6 rounded-2xl">
<div class="flex justify-between items-center mb-6">
<h4 class="font-label-md text-label-md text-outline font-bold">KNOWLEDGE STABILITY</h4>
<span class="bg-secondary-container/20 text-secondary-container px-2 py-1 rounded-full text-[10px] font-bold border border-secondary-container/30">STABLE</span>
</div>
<div class="relative h-24 flex items-end justify-center">
<div class="w-full h-2 bg-white/10 rounded-full relative overflow-hidden">
<div class="absolute inset-0 bg-gradient-to-r from-error via-primary to-secondary-container opacity-20"></div>
<div class="h-full bg-primary w-[88%] shadow-[0_0_12px_#b0c6ff] relative">
<span class="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-xl flex items-center justify-center">
<span class="w-1 h-1 rounded-full bg-primary"></span>
</span>
</div>
</div>
</div>
<p class="text-center font-label-sm text-label-sm text-outline mt-4">Growth rate at <span class="text-secondary-container">+12.4%</span> vs last week</p>
</section>
<!-- AI Governance Panel -->
<section class="glass-card p-6 rounded-2xl border-l-4 border-primary">
<div class="flex items-center gap-2 mb-4">
<span class="material-symbols-outlined text-primary" data-icon="smart_toy">smart_toy</span>
<h4 class="font-label-md text-label-md text-on-surface uppercase font-bold tracking-widest">AI Governance</h4>
</div>
<div class="space-y-4">
<div class="flex justify-between items-center">
<span class="font-label-sm text-outline">AI Accuracy</span>
<span class="font-label-md text-label-md text-primary">99.1%</span>
</div>
<div class="flex justify-between items-center">
<span class="font-label-sm text-outline">Validation Rate</span>
<span class="font-label-md text-label-md text-primary">84%</span>
</div>
<div class="flex justify-between items-center">
<span class="font-label-sm text-outline">Drift Detection</span>
<span class="font-label-md text-label-md text-secondary-fixed-dim">Nominal</span>
</div>
</div>
</section>
<!-- Community Health -->
<section class="glass-card p-6 rounded-2xl">
<h4 class="font-label-md text-label-md text-on-surface mb-6 uppercase font-bold tracking-widest">Community Health</h4>
<div class="grid grid-cols-2 gap-4">
<div class="text-center p-3 bg-white/5 rounded-xl border border-white/5">
<p class="font-display text-xl font-bold text-secondary-container">88%</p>
<p class="font-label-sm text-[10px] text-outline uppercase">Agreement</p>
</div>
<div class="text-center p-3 bg-white/5 rounded-xl border border-white/5">
<p class="font-display text-xl font-bold">242</p>
<p class="font-label-sm text-[10px] text-outline uppercase">Active Disc.</p>
</div>
<div class="text-center p-3 bg-white/5 rounded-xl border border-white/5">
<p class="font-display text-xl font-bold">56</p>
<p class="font-label-sm text-[10px] text-outline uppercase">New Qs</p>
</div>
<div class="text-center p-3 bg-white/5 rounded-xl border border-white/5">
<p class="font-display text-xl font-bold">12%</p>
<p class="font-label-sm text-[10px] text-outline uppercase">Conv. Rate</p>
</div>
</div>
</section>
</aside>
</div>
</main>
<!-- Footer -->
<footer class="bg-surface-container-lowest dark:bg-surface-dim border-t border-white/5 w-full py-8 mt-20">
<div class="max-w-container-max mx-auto px-margin-desktop flex flex-col md:flex-row justify-between items-center">
<div class="flex items-center gap-4 mb-4 md:mb-0">
<span class="font-display font-bold text-primary">CrowdMind</span>
<span class="font-label-sm text-label-sm text-outline">© 2024 CrowdMind. Cognitive Clarity for the Modern Era.</span>
</div>
<div class="flex gap-8">
<a class="font-label-sm text-label-sm text-outline hover:text-primary transition-colors cursor-pointer" href="#">Privacy</a>
<a class="font-label-sm text-label-sm text-outline hover:text-primary transition-colors cursor-pointer" href="#">Terms</a>
<a class="font-label-sm text-label-sm text-outline hover:text-primary transition-colors cursor-pointer" href="#">Research Ethics</a>
</div>
</div>
</footer>`
