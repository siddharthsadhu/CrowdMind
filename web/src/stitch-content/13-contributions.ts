// Auto-generated from public/stitch-ref/13-contributions.html — do not edit by hand
export const pageStyles = `
        body {
            background-color: #111319;
            color: #e2e2eb;
            font-family: 'Inter', sans-serif;
        }
        .glass-card {
            background: rgba(22, 27, 34, 0.7);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.2s ease-out;
        }
        .glass-card:hover {
            border-color: rgba(176, 198, 255, 0.3);
            background: rgba(22, 27, 34, 0.85);
        }
        .activity-cell {
            width: 12px;
            height: 12px;
            border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #111319;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #33343b;
            border-radius: 10px;
        }
    `
export const bodyHtml = `<!-- TopNavBar -->
<header class="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-xl border-b border-outline-variant/10">
<div class="flex justify-between items-center px-gutter h-16 w-full max-w-container-max mx-auto">
<div class="flex items-center gap-8">
<span class="font-headline-md text-headline-md font-bold text-primary tracking-tight">CrowdMind</span>
<nav class="hidden md:flex items-center gap-6">
<a class="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors" href="/library">FAQs</a>
<a class="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors" href="/discussions">Discussions</a>
<a class="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors" href="/ask">Ask Question</a>
<a class="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors" href="/analysis">Analytics</a>
</nav>
</div>
<div class="flex items-center gap-4">
<button class="p-2 hover:bg-surface-variant/20 rounded-full transition-all active:scale-95">
<span class="material-symbols-outlined text-on-surface-variant">notifications</span>
</button>
<div class="w-8 h-8 rounded-full overflow-hidden bg-surface-variant border border-outline-variant/30 cursor-pointer">
<img alt="User profile" data-alt="A professional headshot of a person with a thoughtful expression, set against a dark, minimalist background with soft blue atmospheric lighting to match a high-tech research environment." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXC95FHVs9KJVf6fB1Kfa_yaxnLQ9v2t0QBrTAWdWvoeTMKXeyCiPkrb_Px7Ic-lGsEVq5jmIVs3kHQrgXE_4A2pZjPyFSp7Pkmr_1gPEOUcV6FcNHigRYx5n3QD6Ss3iSL0qPI-kVweU-nSxU_uVc3rqjEmh3dInlt2X0oouX4dgu69cWfntZMoeILZDXBLoH62_QH1ix0jiSC5Y0dNKpd0oDi_Hr-SmxdmR9XG_jhkuEej3PwpDDmncd5S-fcomSerUg94kMzJsN">
</div>
</div>
</div>
</header>
<main class="pt-24 pb-12 px-gutter max-w-container-max mx-auto">
<!-- Header -->
<section class="mb-12">
<div class="flex flex-col gap-2 mb-8">
<h1 class="font-headline-lg text-headline-lg text-on-surface">My Contributions</h1>
<p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Track the knowledge, discussions, answers, and FAQs you have contributed to the CrowdMind ecosystem.</p>
</div>
<!-- Summary Cards Grid -->
<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
<div class="glass-card p-4 rounded-xl flex flex-col items-center justify-center text-center">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Total</span>
<span class="text-3xl font-bold text-primary">142</span>
</div>
<div class="glass-card p-4 rounded-xl flex flex-col items-center justify-center text-center">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Questions</span>
<span class="text-3xl font-bold text-on-surface">18</span>
</div>
<div class="glass-card p-4 rounded-xl flex flex-col items-center justify-center text-center">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Answers</span>
<span class="text-3xl font-bold text-on-surface">56</span>
</div>
<div class="glass-card p-4 rounded-xl flex flex-col items-center justify-center text-center">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Discussions</span>
<span class="text-3xl font-bold text-on-surface">12</span>
</div>
<div class="glass-card p-4 rounded-xl flex flex-col items-center justify-center text-center">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">FAQs</span>
<span class="text-3xl font-bold text-on-surface">5</span>
</div>
<div class="glass-card p-4 rounded-xl flex flex-col items-center justify-center text-center border-primary/30">
<span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Impact</span>
<span class="text-3xl font-bold text-secondary">94%</span>
</div>
</div>
</section>
<!-- Layout Wrapper -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
<!-- Left Column: Feed & Activity -->
<div class="lg:col-span-8 flex flex-col gap-8">
<!-- Filter Bar -->
<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2 glass-card rounded-xl">
<div class="flex items-center gap-1 overflow-x-auto custom-scrollbar whitespace-nowrap px-2">
<button class="px-4 py-2 rounded-lg bg-primary-container text-on-primary-container font-label-md text-label-md">All</button>
<button class="px-4 py-2 rounded-lg hover:bg-surface-variant/30 text-on-surface-variant font-label-md text-label-md transition-colors">Questions</button>
<button class="px-4 py-2 rounded-lg hover:bg-surface-variant/30 text-on-surface-variant font-label-md text-label-md transition-colors">Answers</button>
<button class="px-4 py-2 rounded-lg hover:bg-surface-variant/30 text-on-surface-variant font-label-md text-label-md transition-colors">Discussions</button>
<button class="px-4 py-2 rounded-lg hover:bg-surface-variant/30 text-on-surface-variant font-label-md text-label-md transition-colors">FAQs</button>
</div>
<div class="flex items-center gap-2 px-2">
<span class="font-label-sm text-label-sm text-outline">Sort:</span>
<select class="bg-transparent border-none text-on-surface font-label-md text-label-md focus:ring-0 cursor-pointer">
<option>Newest First</option>
<option>Most Impactful</option>
<option>Most Upvoted</option>
<option>Highest Agreement</option>
</select>
</div>
</div>
<!-- Feed Cards -->
<div class="flex flex-col gap-4">
<!-- FAQ Card -->
<div class="glass-card p-6 rounded-xl flex items-start gap-4 group">
<div class="w-12 h-12 rounded-lg bg-tertiary-container/20 flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-tertiary">quiz</span>
</div>
<div class="flex-1">
<div class="flex justify-between items-start mb-1">
<span class="font-label-sm text-label-sm text-tertiary uppercase tracking-widest">FAQ Publication</span>
<span class="font-label-sm text-label-sm text-outline">Oct 12, 2024</span>
</div>
<h3 class="font-headline-md text-headline-md text-on-surface mb-2 group-hover:text-primary transition-colors">Knowledge Contributions</h3>
<div class="flex flex-wrap gap-4 mt-4">
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-sm text-secondary">verified</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">98% Agreement</span>
</div>
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-sm text-outline">visibility</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">4.2k views</span>
</div>
<span class="px-2 py-0.5 rounded bg-surface-variant/50 text-on-surface-variant font-label-sm text-label-sm">Published</span>
</div>
</div>
</div>
<!-- Answer Card -->
<div class="glass-card p-6 rounded-xl flex items-start gap-4 border-l-4 border-l-secondary/50">
<div class="w-12 h-12 rounded-lg bg-secondary-container/20 flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-secondary" style="font-variation-settings: 'FILL' 1;">chat_bubble</span>
</div>
<div class="flex-1">
<div class="flex justify-between items-start mb-1">
<span class="font-label-sm text-label-sm text-secondary uppercase tracking-widest">Accepted Answer</span>
<span class="font-label-sm text-label-sm text-outline">Oct 10, 2024</span>
</div>
<h3 class="font-headline-md text-headline-md text-on-surface mb-2">Knowledge Contributions</h3>
<p class="font-body-md text-body-md text-on-surface-variant line-clamp-2 mb-4">Implementing Low-Rank Adaptation (LoRA) effectively requires careful rank selection and targeting specific modules within the transformer architecture...</p>
<div class="flex flex-wrap gap-4 mt-4">
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-sm text-primary">thumb_up</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">89 upvotes</span>
</div>
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-sm text-secondary">psychology</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">94% Confidence</span>
</div>
</div>
</div>
</div>
<!-- Question Card -->
<div class="glass-card p-6 rounded-xl flex items-start gap-4">
<div class="w-12 h-12 rounded-lg bg-primary-container/20 flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-primary">help</span>
</div>
<div class="flex-1">
<div class="flex justify-between items-start mb-1">
<span class="font-label-sm text-label-sm text-primary uppercase tracking-widest">Question</span>
<span class="font-label-sm text-label-sm text-outline">Oct 05, 2024</span>
</div>
<h3 class="font-headline-md text-headline-md text-on-surface mb-2">Knowledge Contributions</h3>
<div class="flex flex-wrap gap-4 mt-4">
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-sm text-outline">forum</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">12 answers</span>
</div>
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-sm text-outline">trending_up</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">45 upvotes</span>
</div>
</div>
</div>
</div>
<!-- Discussion Card -->
<div class="glass-card p-6 rounded-xl flex items-start gap-4">
<div class="w-12 h-12 rounded-lg bg-outline-variant/20 flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-outline">groups</span>
</div>
<div class="flex-1">
<div class="flex justify-between items-start mb-1">
<span class="font-label-sm text-label-sm text-outline uppercase tracking-widest">Discussion</span>
<span class="font-label-sm text-label-sm text-outline">Sep 28, 2024</span>
</div>
<h3 class="font-headline-md text-headline-md text-on-surface mb-2">Knowledge Contributions</h3>
<div class="flex flex-wrap gap-4 mt-4">
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-sm text-outline">reply</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">24 replies</span>
</div>
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-sm text-outline">person_add</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">15 participants</span>
</div>
</div>
</div>
</div>
</div>
<!-- Contribution Timeline -->
<div class="glass-card p-6 rounded-xl overflow-hidden">
<h3 class="font-headline-md text-headline-md text-on-surface mb-6">Knowledge Contribution Activity</h3>
<div class="flex flex-col gap-1">
<div class="flex gap-1" id="activity-grid">
<!-- JS will populate or we can mock grid here -->

</div>
<div class="flex flex-wrap gap-4 mb-4 font-label-sm text-label-sm text-on-surface-variant"><div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-primary"></span><span>Questions</span></div><div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-secondary"></span><span>Answers</span></div><div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-tertiary"></span><span>Discussions</span></div><div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-secondary-fixed-dim"></span><span>FAQ Publications</span></div></div><div class="flex justify-between mt-4 font-label-sm text-label-sm text-outline uppercase tracking-widest">
<span>Last 365 Days</span>
<div class="flex items-center gap-2">
<span>Less</span>
<div class="activity-cell bg-outline-variant/20"></div>
<div class="activity-cell bg-primary/20"></div>
<div class="activity-cell bg-primary/50"></div>
<div class="activity-cell bg-primary/80"></div>
<div class="activity-cell bg-primary"></div>
<span>More</span>
</div>
</div>
</div>
</div>
<!-- FAQ Origin List -->
<div class="glass-card p-6 rounded-xl">
<div class="flex items-center justify-between mb-6">
<h3 class="font-headline-md text-headline-md text-on-surface">Knowledge Contributions</h3>
<span class="material-symbols-outlined text-outline">info</span>
</div>
<div class="flex flex-col gap-0"><div class="flex items-center justify-between py-4 border-b border-outline-variant/10"><div class="flex-1"><div class="flex items-center gap-2 mb-1"><p class="font-label-md text-label-md text-on-surface">Recursive Feedback Loops in RL</p><span class="px-1.5 py-0.5 rounded-full bg-surface-variant text-[10px] text-outline font-bold uppercase">v2.4</span></div><div class="flex items-center gap-4 font-label-sm text-label-sm text-outline"><span>94% Community Consensus</span><span>92% AI Confidence</span></div><span class="font-label-sm text-label-sm text-outline mt-1 block">Derived from discussion #1290</span></div><div class="flex items-center gap-4"><span class="px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm">Published</span><button class="p-1.5 hover:bg-surface-variant/20 rounded-lg text-outline-variant hover:text-primary transition-colors"><span class="material-symbols-outlined text-[20px]">open_in_new</span></button></div></div><div class="flex items-center justify-between py-4 border-b border-outline-variant/10"><div class="flex-1"><div class="flex items-center gap-2 mb-1"><p class="font-label-md text-label-md text-on-surface">Optimizing Embedding Latency</p><span class="px-1.5 py-0.5 rounded-full bg-surface-variant text-[10px] text-outline font-bold uppercase">v2.4</span></div><div class="flex items-center gap-4 font-label-sm text-label-sm text-outline"><span>94% Community Consensus</span><span>92% AI Confidence</span></div><span class="font-label-sm text-label-sm text-outline mt-1 block">Derived from answer in #442</span></div><div class="flex items-center gap-4"><span class="px-3 py-1 rounded-full bg-surface-variant/30 text-outline font-label-sm text-label-sm">Under Review</span><button class="p-1.5 hover:bg-surface-variant/20 rounded-lg text-outline-variant hover:text-primary transition-colors"><span class="material-symbols-outlined text-[20px]">open_in_new</span></button></div></div><div class="flex items-center justify-between py-4"><div class="flex-1"><div class="flex items-center gap-2 mb-1"><p class="font-label-md text-label-md text-on-surface">Data Leakage in Time Series</p><span class="px-1.5 py-0.5 rounded-full bg-surface-variant text-[10px] text-outline font-bold uppercase">v2.4</span></div><div class="flex items-center gap-4 font-label-sm text-label-sm text-outline"><span>94% Community Consensus</span><span>92% AI Confidence</span></div><span class="font-label-sm text-label-sm text-outline mt-1 block">Derived from question #88</span></div><div class="flex items-center gap-4"><span class="px-3 py-1 rounded-full bg-secondary/10 text-secondary font-label-sm text-label-sm">Evolving FAQ</span><button class="p-1.5 hover:bg-surface-variant/20 rounded-lg text-outline-variant hover:text-primary transition-colors"><span class="material-symbols-outlined text-[20px]">open_in_new</span></button></div></div></div>
</div>
</div>
<!-- Right Column: Sidebar Stats -->
<div class="lg:col-span-4 flex flex-col gap-8">
<!-- Knowledge Impact Panel -->
<div class="glass-card p-6 rounded-xl border-primary/20">
<h3 class="font-headline-md text-headline-md text-on-surface mb-6">Knowledge Impact</h3>
<div class="space-y-6">
<div class="flex items-center justify-between">
<span class="font-body-md text-body-md text-on-surface-variant">People Helped</span>
<span class="font-label-md text-label-md text-primary font-bold">1.2k</span>
</div>
<div class="flex items-center justify-between">
<span class="font-body-md text-body-md text-on-surface-variant">Accepted Answers</span>
<span class="font-label-md text-label-md text-primary font-bold">24</span>
</div>
<div class="flex items-center justify-between">
<span class="font-body-md text-body-md text-on-surface-variant">Generated FAQs</span>
<span class="font-label-md text-label-md text-primary font-bold">5</span>
</div>
<div class="flex items-center justify-between">
<span class="font-body-md text-body-md text-on-surface-variant">Reputation Earned</span>
<span class="font-label-md text-label-md text-primary font-bold">450</span>
</div>
<div class="flex items-center justify-between">
<span class="font-body-md text-body-md text-on-surface-variant">Knowledge Reuse</span>
<span class="font-label-md text-label-md text-primary font-bold">312</span>
</div>
<div class="h-1 bg-surface-variant rounded-full overflow-hidden mt-4">
<div class="h-full bg-gradient-to-r from-primary to-secondary w-[94%]"></div>
</div>
</div>
</div><div class="glass-card p-6 rounded-xl"><h4 class="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-4">Impact Trend</h4><div class="flex items-end gap-1 h-12 mb-2"><div class="flex-1 bg-primary/20 rounded-t-sm h-[30%]"></div><div class="flex-1 bg-primary/20 rounded-t-sm h-[45%]"></div><div class="flex-1 bg-primary/20 rounded-t-sm h-[40%]"></div><div class="flex-1 bg-primary/20 rounded-t-sm h-[60%]"></div><div class="flex-1 bg-primary/20 rounded-t-sm h-[55%]"></div><div class="flex-1 bg-primary/20 rounded-t-sm h-[75%]"></div><div class="flex-1 bg-primary/20 rounded-t-sm h-[70%]"></div><div class="flex-1 bg-primary/20 rounded-t-sm h-[90%]"></div><div class="flex-1 bg-primary/20 rounded-t-sm h-[85%]"></div><div class="flex-1 bg-primary rounded-t-sm h-full"></div></div><p class="font-label-sm text-label-sm text-secondary">+24% from last quarter</p></div>
<!-- Stats Cards -->
<div class="flex flex-col gap-4"><div class="glass-card p-6 rounded-xl"><div class="flex items-center gap-3 mb-4 text-secondary-fixed-dim"><span class="material-symbols-outlined">inventory_2</span><span class="font-label-md text-label-md uppercase tracking-widest">Knowledge Artifacts Created</span></div><p class="font-headline-md text-headline-md text-on-surface">12</p><p class="font-label-sm text-label-sm text-outline mt-1">Synthesized into the network</p></div>
<div class="glass-card p-6 rounded-xl">
<div class="flex items-center gap-3 mb-4 text-tertiary">
<span class="material-symbols-outlined">military_tech</span>
<span class="font-label-md text-label-md uppercase tracking-widest">Global Rank</span>
</div>
<p class="font-headline-md text-headline-md text-on-surface">Top 5%</p>
<p class="font-label-sm text-label-sm text-outline mt-1">Global CrowdMind Contributor</p>
</div>
<div class="glass-card p-6 rounded-xl">
<div class="flex items-center gap-3 mb-4 text-secondary">
<span class="material-symbols-outlined">local_fire_department</span>
<span class="font-label-md text-label-md uppercase tracking-widest">Streak</span>
</div>
<p class="font-headline-md text-headline-md text-on-surface">12 Days</p>
<p class="font-label-sm text-label-sm text-outline mt-1">Keep sharing to level up</p>
</div>
<div class="glass-card p-6 rounded-xl">
<div class="flex items-center gap-3 mb-4 text-primary">
<span class="material-symbols-outlined">insights</span>
<span class="font-label-md text-label-md uppercase tracking-widest">Monthly Growth</span>
</div>
<p class="font-headline-md text-headline-md text-secondary">+15%</p>
<p class="font-label-sm text-label-sm text-outline mt-1">Impact growth since last month</p>
</div>
</div>
<!-- Featured Badge -->
<div class="glass-card p-6 rounded-xl relative overflow-hidden group">
<div class="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none"></div>
<span class="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl text-primary/5 rotate-12 transition-transform group-hover:scale-110">stars</span>
<h4 class="font-label-md text-label-md text-primary mb-2">Next Milestone</h4>
<p class="font-body-md text-body-md text-on-surface mb-4">Master Contributor Badge</p>
<div class="flex items-center gap-2">
<div class="flex-1 h-1.5 bg-surface-variant rounded-full overflow-hidden">
<div class="h-full bg-primary w-2/3"></div>
</div>
<span class="font-label-sm text-label-sm text-outline">67%</span>
</div>
</div>
</div>
</div>
</main>
<!-- Footer -->
<footer class="w-full py-unit-gutter mt-section-gap border-t border-outline-variant/10 bg-surface-container-lowest">
<div class="flex flex-col md:flex-row justify-between items-center px-gutter max-w-container-max mx-auto gap-4">
<div class="flex flex-col items-center md:items-start gap-1">
<span class="font-label-md text-label-md font-bold text-on-surface">CrowdMind Neural Protocol</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">© 2024 CrowdMind Neural Protocol</span>
</div>
<div class="flex items-center gap-6">
<a class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy</a>
<a class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Terms</a>
<a class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Status</a>
</div>
</div>
</footer>`
