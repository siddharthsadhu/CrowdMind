// Auto-generated from public/stitch-ref/10-profile.html — do not edit by hand
export const pageStyles = `
        body {
            background-color: #0A0C12;
            color: #e2e2eb;
            font-family: 'Inter', sans-serif;
        }
        .glass-card {
            background: rgba(22, 27, 34, 0.7);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-top: 1px solid rgba(255, 255, 255, 0.15);
            transition: all 0.3s ease;
        }
        .glass-card:hover {
            border-color: rgba(176, 198, 255, 0.3);
            background: rgba(26, 31, 40, 0.8);
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
        .contribution-cell {
            width: 12px;
            height: 12px;
            border-radius: 2px;
        }
        .tab-active {
            color: #b0c6ff;
            border-bottom: 2px solid #b0c6ff;
        }
        .glow-cyan {
            box-shadow: 0 0 15px rgba(46, 123, 255, 0.2);
        }
    `
export const bodyHtml = `<!-- TopNavBar -->
<header class="fixed top-0 w-full z-50 bg-surface/70 dark:bg-surface/70 backdrop-blur-xl border-b border-white/10 shadow-none">
<div class="max-w-container-max mx-auto px-gutter h-20 flex items-center justify-between">
<div class="flex items-center gap-10">
<span class="font-display text-headline-md font-bold text-primary tracking-tight">CrowdMind</span>
<nav class="hidden md:flex items-center gap-8 font-body-md text-body-md">
<a class="text-on-surface-variant font-medium hover:text-on-surface transition-colors" href="/library">FAQs</a>
<a class="text-on-surface-variant font-medium hover:text-on-surface transition-colors" href="/discussions">Discussions</a>
<a class="text-on-surface-variant font-medium hover:text-on-surface transition-colors" href="/ask">Ask Question</a>
<a class="text-on-surface-variant font-medium hover:text-on-surface transition-colors" href="/analysis">Analytics</a>
</nav>
</div>
<div class="flex items-center gap-4">
<div class="relative hidden sm:block">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
<input class="bg-surface-container border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary w-64 transition-all" placeholder="Search knowledge base..." type="text">
</div>
<button class="material-symbols-outlined text-on-surface-variant p-2 hover:bg-white/5 rounded-full transition-all">notifications</button>
<button class="material-symbols-outlined text-on-surface-variant p-2 hover:bg-white/5 rounded-full transition-all">settings</button>
<img alt="Researcher Profile" class="w-10 h-10 rounded-full border border-white/10 ml-2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPd-N5R6nRz2nnKivxPx36AZ9K0C_Ba86kUF4XRkdmX8d2SSAhfay8eIRaMwjC03uRcVDMUVQqgfPqaGuye2ycsdb8Y-Yy7RsAlyF-mW-8ZGHKGymXBnFf1mnVlmWeAnvYjULeWRKptDEW_Xr8lM9KDzEURkCzND62wIV-KXTKQq8Cu2a1pdpbWe4VbDpg7wxbsyZIY67cGVKZ_GG2P5YrwlJkW6rKvDnGMv9zn9OgT_UayOEQzWm8ffk4B9nQFSEwdIiyUTECJF9q">
</div>
</div>
</header>
<main class="max-w-container-max mx-auto px-gutter py-12">
<!-- Profile Header Section -->
<section class="mb-12">
<div class="glass-card p-8 rounded-2xl relative overflow-hidden">
<div class="absolute top-0 right-0 p-8 flex gap-3">
<button class="bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-6 py-2.5 rounded-xl font-label-md flex items-center gap-2 transition-all">
<span class="material-symbols-outlined text-sm">edit</span> Edit Profile
                    </button>
<button class="bg-surface-container-high hover:bg-surface-container-highest text-on-surface p-2.5 rounded-xl transition-all">
<span class="material-symbols-outlined text-sm">share</span>
</button>
</div>
<div class="flex flex-col md:flex-row gap-8 items-start md:items-center">
<div class="relative">
<img data-cm-avatar alt="Alex Rivera" class="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-surface shadow-2xl object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPd-N5R6nRz2nnKivxPx36AZ9K0C_Ba86kUF4XRkdmX8d2SSAhfay8eIRaMwjC03uRcVDMUVQqgfPqaGuye2ycsdb8Y-Yy7RsAlyF-mW-8ZGHKGymXBnFf1mnVlmWeAnvYjULeWRKptDEW_Xr8lM9KDzEURkCzND62wIV-KXTKQq8Cu2a1pdpbWe4VbDpg7wxbsyZIY67cGVKZ_GG2P5YrwlJkW6rKvDnGMv9zn9OgT_UayOEQzWm8ffk4B9nQFSEwdIiyUTECJF9q">
<div class="absolute -bottom-2 -right-2 bg-primary text-on-primary p-1.5 rounded-lg border-2 border-surface">
<span class="material-symbols-outlined text-xl" style="font-variation-settings: 'FILL' 1;">verified</span>
</div>
</div>
<div class="flex-1">
<div class="flex flex-wrap items-center gap-4 mb-2">
<h1 data-cm-profile-name class="font-display text-headline-lg text-on-surface">Alex Rivera</h1>
<span data-cm-username class="text-on-surface-variant font-label-md">@arivera</span>
<span data-cm-rank-badge class="px-3 py-1 bg-primary/10 text-primary text-xs font-label-sm rounded-full border border-primary/20">Knowledge Curator</span>
</div>
<p data-cm-bio class="font-body-md text-on-surface-variant mb-4 max-w-2xl">
                            Dedicated to building transparent AI knowledge ecosystems through community-driven consensus.
                        </p>
<div class="flex flex-wrap gap-6 text-sm text-on-surface-variant">
<span data-cm-joined class="flex items-center gap-2"><span class="material-symbols-outlined text-base">calendar_today</span> Joined Oct 2023</span>
<span data-cm-reputation class="flex items-center gap-2"><span class="material-symbols-outlined text-base">military_tech</span> 1,280 Reputation</span>
</div>
</div>
</div>
<div class="mt-8 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
<div>
<h4 class="text-label-sm uppercase tracking-widest text-on-surface-variant mb-4">Expertise</h4>
<div class="flex flex-wrap gap-2">
<span class="px-3 py-1 bg-surface-container-high text-on-surface text-xs rounded-lg border border-white/5">AI Ethics</span>
<span class="px-3 py-1 bg-surface-container-high text-on-surface text-xs rounded-lg border border-white/5">Machine Learning</span>
<span class="px-3 py-1 bg-surface-container-high text-on-surface text-xs rounded-lg border border-white/5">Data Governance</span>
</div>
</div>
<div>
<h4 class="text-label-sm uppercase tracking-widest text-on-surface-variant mb-4">Followed Categories</h4>
<div class="flex flex-wrap gap-2">
<span class="px-3 py-1 bg-secondary-container/10 text-secondary-fixed-dim text-xs rounded-lg border border-secondary-fixed-dim/20">Neural Networks</span>
<span class="px-3 py-1 bg-secondary-container/10 text-secondary-fixed-dim text-xs rounded-lg border border-secondary-fixed-dim/20">LLM Training</span>
<span class="px-3 py-1 bg-secondary-container/10 text-secondary-fixed-dim text-xs rounded-lg border border-secondary-fixed-dim/20">Policy</span>
</div>
</div>
</div>
</div>
</section>
<!-- Contribution Metrics Stats Grid -->
<section class="mb-12">
<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
<div class="glass-card p-4 rounded-xl text-center">
<span class="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block mb-1">Reputation</span>
<span class="font-display text-headline-md text-primary">1,280</span>
</div>
<div class="glass-card p-4 rounded-xl text-center">
<span class="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block mb-1">Questions</span>
<span class="font-display text-headline-md text-on-surface">14</span>
</div>
<div class="glass-card p-4 rounded-xl text-center">
<span class="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block mb-1">Answers</span>
<span class="font-display text-headline-md text-on-surface">42</span>
</div>
<div class="glass-card p-4 rounded-xl text-center">
<span class="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block mb-1">Accepted</span>
<span class="font-display text-headline-md text-secondary-fixed-dim">32</span>
</div>
<div class="glass-card p-4 rounded-xl text-center">
<span class="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block mb-1">Discussions</span>
<span class="font-display text-headline-md text-on-surface">15</span>
</div>
<div class="glass-card p-4 rounded-xl text-center">
<span class="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block mb-1">FAQs</span>
<span class="font-display text-headline-md text-tertiary">8</span>
</div>
<div class="glass-card p-4 rounded-xl text-center">
<span class="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block mb-1">Upvotes</span>
<span class="font-display text-headline-md text-on-surface">1.2k</span>
</div>
<div class="glass-card p-4 rounded-xl text-center border-l-2 border-primary">
<span class="font-label-sm text-[10px] text-primary uppercase tracking-wider block mb-1">Impact</span>
<span class="font-display text-headline-md text-on-surface">88<span class="text-xs text-on-surface-variant ml-0.5">/100</span></span>
</div>
</div>
</section>
<div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
<!-- Left Column: Content Tabs & Heatmap -->
<div class="lg:col-span-2 space-y-gutter">
<div class="glass-card rounded-xl overflow-hidden">
<div class="flex border-b border-white/5 bg-surface-container-low px-4 overflow-x-auto scrollbar-hide">
<button class="px-6 py-4 font-label-md text-sm tab-active transition-all whitespace-nowrap">Questions</button>
<button class="px-6 py-4 font-label-md text-sm text-on-surface-variant hover:text-on-surface transition-all whitespace-nowrap">Answers</button>
<button class="px-6 py-4 font-label-md text-sm text-on-surface-variant hover:text-on-surface transition-all whitespace-nowrap">Discussions</button>
<button class="px-6 py-4 font-label-md text-sm text-on-surface-variant hover:text-on-surface transition-all whitespace-nowrap">Approved FAQs</button>
<button class="px-6 py-4 font-label-md text-sm text-on-surface-variant hover:text-on-surface transition-all whitespace-nowrap">Timeline</button>
</div>
<div class="p-8 space-y-4">
<!-- Questions Tab Content -->
<div class="p-6 bg-surface-container-low rounded-xl border border-white/5 hover:border-primary/20 transition-all cursor-pointer">
<div class="flex flex-wrap items-center gap-3 mb-3">
<span class="px-2 py-0.5 bg-secondary-container/20 text-secondary-fixed-dim text-[10px] font-label-sm rounded uppercase">Answered</span>
<span class="px-2 py-0.5 bg-tertiary-container/20 text-tertiary-fixed-dim text-[10px] font-label-sm rounded uppercase">FAQ Generated</span>
<span class="ml-auto text-on-surface-variant text-[10px] font-label-sm">2 hours ago</span>
</div>
<h4 class="font-headline-md text-on-surface mb-4">Can I change my team after Phase 1? <span class="ml-2 px-2 py-0.5 bg-primary/20 text-primary text-[10px] rounded">v2.1</span></h4>
<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-on-surface-variant">
<span class="flex items-center gap-2 text-xs font-label-md"><span class="material-symbols-outlined text-sm">visibility</span> 1.2k views</span>
<span class="flex items-center gap-2 text-xs font-label-md"><span class="material-symbols-outlined text-sm">comment</span> 8 responses</span>
<span class="flex items-center gap-2 text-xs font-label-md"><span class="material-symbols-outlined text-sm">psychology</span> AI: 94%</span>
<span class="flex items-center gap-2 text-xs font-label-md"><span class="material-symbols-outlined text-sm">handshake</span> 88% Agreement</span>
</div>
</div>
<div class="p-6 bg-surface-container-low rounded-xl border border-white/5 hover:border-primary/20 transition-all cursor-pointer">
<div class="flex flex-wrap items-center gap-3 mb-3">
<span class="px-2 py-0.5 bg-surface-variant text-on-surface-variant text-[10px] font-label-sm rounded uppercase">Pending</span>
<span class="ml-auto text-on-surface-variant text-[10px] font-label-sm">Yesterday</span>
</div>
<h4 class="font-headline-md text-on-surface mb-4">Best practices for dataset normalization in LLM training?</h4>
<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-on-surface-variant">
<span class="flex items-center gap-2 text-xs font-label-md"><span class="material-symbols-outlined text-sm">visibility</span> 450 views</span>
<span class="flex items-center gap-2 text-xs font-label-md"><span class="material-symbols-outlined text-sm">comment</span> 3 responses</span>
<span class="flex items-center gap-2 text-xs font-label-md"><span class="material-symbols-outlined text-sm">psychology</span> AI: 72%</span>
<span class="flex items-center gap-2 text-xs font-label-md"><span class="material-symbols-outlined text-sm">handshake</span> 45% Agreement</span>
</div>
</div>
</div>
</div>
<!-- Contribution Heatmap Section -->
<div class="glass-card p-8 rounded-xl overflow-hidden">
<div class="flex items-center justify-between mb-8">
<h2 class="font-headline-md text-on-surface">Contribution Activity</h2>
<div class="flex items-center gap-2 text-[10px] font-label-sm text-on-surface-variant uppercase">
<span>Less</span>
<div class="flex gap-1">
<div class="contribution-cell bg-surface-variant"></div>
<div class="contribution-cell bg-primary/20"></div>
<div class="contribution-cell bg-primary/50"></div>
<div class="contribution-cell bg-primary"></div>
</div>
<span>More</span>
</div>
</div>
<div class="overflow-x-auto pb-4 custom-scrollbar">
<div data-cm-heatmap class="flex gap-[4px] justify-between min-w-[700px]">

</div>
</div>
<div class="mt-2 text-xs text-on-surface-variant font-label-sm mb-8">
                        <span data-cm-total-contributions>382 contributions in the last year</span>
                    </div>
<!-- New Metrics Row -->
<div class="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/5">
<div class="flex flex-col">
<span class="text-[10px] font-label-sm text-on-surface-variant uppercase tracking-wider">Current Streak</span>
<span data-cm-streak="current" class="text-headline-md text-on-surface">18 Days</span>
</div>
<div class="flex flex-col">
<span class="text-[10px] font-label-sm text-on-surface-variant uppercase tracking-wider">Longest Streak</span>
<span data-cm-streak="longest" class="text-headline-md text-on-surface">47 Days</span>
</div>
<div class="flex flex-col">
<span class="text-[10px] font-label-sm text-on-surface-variant uppercase tracking-wider">Monthly Contributions</span>
<span data-cm-streak="monthly" class="text-headline-md text-on-surface">32</span>
</div>
<div class="flex flex-col">
<span class="text-[10px] font-label-sm text-on-surface-variant uppercase tracking-wider">Knowledge Impact</span>
<span data-cm-streak="impact" class="text-headline-md text-primary">+284 Reputation</span>
</div>
</div>
</div>
</div>
<!-- Right Column: Profile Sidebar -->
<div class="space-y-gutter">
<!-- Rank Progress Card -->
<div class="glass-card rounded-xl p-8 relative overflow-hidden">
<div class="absolute -right-4 -top-4 w-32 h-32 bg-primary/10 blur-3xl rounded-full"></div>
<h3 class="font-label-sm text-[10px] text-on-surface-variant mb-6 uppercase tracking-widest">Rank Progress</h3>
<div class="flex items-center gap-4 mb-6">
<div class="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 1;">workspace_premium</span>
</div>
<div>
<p data-cm-rank-name class="font-headline-md text-on-surface text-lg">Knowledge Curator</p>
<p data-cm-rank-percent class="text-on-surface-variant text-xs font-label-sm">Top 5% of community</p>
</div>
</div>
<div class="space-y-3 mb-6">
<div class="flex justify-between text-[10px] font-label-sm uppercase">
<span data-cm-rank-next>To Expert Contributor</span>
<span data-cm-rank-progress-pct class="text-primary font-bold">82%</span>
</div>
<div class="h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
<div data-cm-rank-bar class="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(176,198,255,0.6)]" style="width: 82%"></div>
</div>
</div>
<div class="p-4 bg-surface-container rounded-lg flex justify-between items-center">
<span class="text-on-surface-variant text-xs font-label-sm uppercase">Community Ranking</span>
<span data-cm-community-rank class="text-primary font-display text-xl">#248</span>
</div>
</div>
<!-- Trust Metrics Card (New) -->
<div class="glass-card rounded-xl p-8">
<h3 class="font-label-sm text-[10px] text-on-surface-variant mb-6 uppercase tracking-widest">Trust Metrics</h3>
<div class="grid grid-cols-2 gap-4">
<div class="p-4 bg-surface-container-high rounded-xl border border-white/5">
<p class="text-[9px] font-label-sm text-on-surface-variant uppercase mb-1">Acceptance Rate</p>
<p class="text-lg font-headline-md text-on-surface">82%</p>
</div>
<div class="p-4 bg-surface-container-high rounded-xl border border-white/5">
<p class="text-[9px] font-label-sm text-on-surface-variant uppercase mb-1">Agreement Score</p>
<p class="text-lg font-headline-md text-on-surface">89%</p>
</div>
<div class="p-4 bg-surface-container-high rounded-xl border border-white/5">
<p class="text-[9px] font-label-sm text-on-surface-variant uppercase mb-1">FAQ Success</p>
<p class="text-lg font-headline-md text-on-surface">71%</p>
</div>
<div class="p-4 bg-surface-container-high rounded-xl border border-white/5">
<p class="text-[9px] font-label-sm text-on-surface-variant uppercase mb-1">Accuracy</p>
<p class="text-lg font-headline-md text-on-surface">94%</p>
</div>
</div>
</div>
<!-- Achievements & Badges (Expanded) -->
<div class="glass-card rounded-xl p-8">
<h3 class="font-label-sm text-[10px] text-on-surface-variant mb-6 uppercase tracking-widest">Achievements</h3>
<div class="space-y-6">
<!-- Badge 1 -->
<div class="flex gap-4 items-start">
<div class="w-10 h-10 rounded-full bg-tertiary/10 flex-shrink-0 flex items-center justify-center text-tertiary border border-tertiary/20">
<span class="material-symbols-outlined text-xl">auto_awesome</span>
</div>
<div class="flex-1">
<h4 class="text-sm font-medium text-on-surface leading-tight">FAQ Creator</h4>
<p class="text-xs text-on-surface-variant mt-0.5">Generated 10+ verified FAQs</p>
<p class="text-[10px] font-label-sm text-on-surface-variant/60 mt-1 uppercase">Earned: Jan 12, 2024</p>
</div>
</div>
<!-- Badge 2 -->
<div class="flex gap-4 items-start">
<div class="w-10 h-10 rounded-full bg-secondary-fixed-dim/10 flex-shrink-0 flex items-center justify-center text-secondary-fixed-dim border border-secondary-fixed-dim/20">
<span class="material-symbols-outlined text-xl">military_tech</span>
</div>
<div class="flex-1">
<h4 class="text-sm font-medium text-on-surface leading-tight">Top Contributor</h4>
<p class="text-xs text-on-surface-variant mt-0.5">Top 1% of community by reputation</p>
<p class="text-[10px] font-label-sm text-on-surface-variant/60 mt-1 uppercase">Earned: Feb 05, 2024</p>
</div>
</div>
<!-- Badge 3 -->
<div class="flex gap-4 items-start">
<div class="w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary border border-primary/20">
<span class="material-symbols-outlined text-xl">fact_check</span>
</div>
<div class="flex-1">
<h4 class="text-sm font-medium text-on-surface leading-tight">Knowledge Curator</h4>
<p class="text-xs text-on-surface-variant mt-0.5">Reviewed 100+ FAQ candidates</p>
<p class="text-[10px] font-label-sm text-on-surface-variant/60 mt-1 uppercase">Earned: Mar 15, 2024</p>
</div>
</div>
<!-- Badge 4 -->
<div class="flex gap-4 items-start">
<div class="w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary border border-primary/20">
<span class="material-symbols-outlined text-xl">verified</span>
</div>
<div class="flex-1">
<h4 class="text-sm font-medium text-on-surface leading-tight">Early Adopter</h4>
<p class="text-xs text-on-surface-variant mt-0.5">Joined during Beta phase</p>
<p class="text-[10px] font-label-sm text-on-surface-variant/60 mt-1 uppercase">Earned: Oct 10, 2023</p>
</div>
</div>
<!-- Badge 5 -->
<div class="flex gap-4 items-start">
<div class="w-10 h-10 rounded-full bg-secondary-fixed-dim/10 flex-shrink-0 flex items-center justify-center text-secondary-fixed-dim border border-secondary-fixed-dim/20">
<span class="material-symbols-outlined text-xl">thumb_up</span>
</div>
<div class="flex-1">
<h4 class="text-sm font-medium text-on-surface leading-tight">Community Expert</h4>
<p class="text-xs text-on-surface-variant mt-0.5">Earned 500+ upvotes in a single category</p>
<p class="text-[10px] font-label-sm text-on-surface-variant/60 mt-1 uppercase">Earned: Apr 20, 2024</p>
</div>
</div>
<!-- Badge 6 -->
<div class="flex gap-4 items-start">
<div class="w-10 h-10 rounded-full bg-tertiary/10 flex-shrink-0 flex items-center justify-center text-tertiary border border-tertiary/20">
<span class="material-symbols-outlined text-xl">handshake</span>
</div>
<div class="flex-1">
<h4 class="text-sm font-medium text-on-surface leading-tight">Consensus Builder</h4>
<p class="text-xs text-on-surface-variant mt-0.5">Participated in 50+ consensus-reached discussions</p>
<p class="text-[10px] font-label-sm text-on-surface-variant/60 mt-1 uppercase">Earned: May 12, 2024</p>
</div>
</div>
</div>
<div class="mt-8 pt-6 border-t border-white/5 text-center">
<a class="text-xs font-label-md text-primary hover:text-primary-fixed-dim transition-colors" href="#">View All Achievements</a>
</div>
</div>
<!-- Knowledge Domains -->
<div class="glass-card rounded-xl p-8">
<h3 class="font-label-sm text-[10px] text-on-surface-variant mb-6 uppercase tracking-widest">Knowledge Domains</h3>
<div class="space-y-4">
<div class="p-4 bg-surface-container-high rounded-lg border-l-2 border-primary">
<p class="text-[10px] font-label-sm text-primary mb-1 uppercase">Primary Domain</p>
<p class="text-on-surface text-sm font-medium">Artificial Intelligence Ethics</p>
</div>
<div class="p-4 bg-surface-container-high rounded-lg border-l-2 border-secondary-fixed-dim">
<p class="text-[10px] font-label-sm text-secondary-fixed-dim mb-1 uppercase">Secondary Domain</p>
<p class="text-on-surface text-sm font-medium">Large Language Models</p>
</div>
<div class="p-4 bg-surface-container-high rounded-lg border-l-2 border-tertiary">
<p class="text-[10px] font-label-sm text-tertiary mb-1 uppercase">Secondary Domain</p>
<p class="text-on-surface text-sm font-medium">Distributed Governance</p>
</div>
</div>
</div>
</div>
</div>
</main>
<!-- Footer -->
<footer class="bg-surface-container border-t border-white/5 py-12">
<div class="max-w-container-max mx-auto px-gutter grid grid-cols-1 md:grid-cols-4 gap-12">
<div class="md:col-span-2">
<span class="font-display text-headline-md font-bold text-primary tracking-tight">CrowdMind</span>
<p class="mt-4 text-on-surface-variant font-body-md max-w-sm">The decentralized brain for modern research teams. Building trusted knowledge through community collaboration and AI-driven synthesis.</p>
<div class="flex gap-4 mt-6">
<a class="text-on-surface-variant hover:text-primary transition-colors" href="#"><span class="material-symbols-outlined">public</span></a>
<a class="text-on-surface-variant hover:text-primary transition-colors" href="#"><span class="material-symbols-outlined">terminal</span></a>
<a class="text-on-surface-variant hover:text-primary transition-colors" href="#"><span class="material-symbols-outlined">hub</span></a>
</div>
</div>
<div>
<h4 class="font-headline-md text-on-surface mb-6">Platform</h4>
<ul class="space-y-4 font-label-md text-on-surface-variant">
<li><a class="hover:text-primary transition-colors" href="#">Documentation</a></li>
<li><a class="hover:text-primary transition-colors" href="#">API Reference</a></li>
<li><a class="hover:text-primary transition-colors" href="#">Community Guidelines</a></li>
<li><a class="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
</ul>
</div>
<div>
<h4 class="font-headline-md text-on-surface mb-6">Support</h4>
<ul class="space-y-4 font-label-md text-on-surface-variant">
<li><a class="hover:text-primary transition-colors" href="#">Help Center</a></li>
<li><a class="hover:text-primary transition-colors" href="#">Contact Support</a></li>
<li><a class="hover:text-primary transition-colors" href="#">Knowledge Tiers</a></li>
<li><a class="hover:text-primary transition-colors" href="#">System Status</a></li>
</ul>
</div>
</div>
<div class="max-w-container-max mx-auto px-gutter mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
<p class="text-on-surface-variant text-xs font-label-sm">© 2024 CrowdMind. All rights reserved.</p>
<p class="text-on-surface-variant text-xs font-label-sm">V.2.4.0-STABLE</p>
</div>
</footer>`
