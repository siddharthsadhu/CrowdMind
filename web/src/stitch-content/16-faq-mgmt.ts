// Auto-generated from public/stitch-ref/16-faq-mgmt.html — do not edit by hand
export const pageStyles = `
        body {
            background-color: #111319;
            color: #e2e2eb;
            font-family: 'Inter', sans-serif;
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-card {
            background: rgba(22, 27, 34, 0.7);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-top: 1px solid rgba(255, 255, 255, 0.12);
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
            height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #b0c6ff;
        }
    `
export const bodyHtml = `<!-- TopNavBar (Shared Component) -->
<header class="bg-surface/70 dark:bg-surface/70 backdrop-blur-xl docked full-width top-0 sticky border-b border-white/10 shadow-sm z-50">
<div class="flex justify-between items-center w-full px-margin-desktop h-16 max-w-container-max mx-auto">
<div class="flex items-center gap-6">
<span class="text-headline-md font-headline-md font-bold tracking-tight text-primary">CrowdMind</span>
<nav class="hidden md:flex gap-6"><a class="text-primary transition-colors text-label-md font-label-md" href="/library">FAQs</a>
<a class="text-on-surface-variant hover:text-primary transition-colors text-label-md font-label-md" href="/discussions">Discussions</a>
<a class="text-on-surface-variant hover:text-primary transition-colors text-label-md font-label-md" href="/ask">Ask Question</a>
<a class="text-on-surface-variant hover:text-primary transition-colors text-label-md font-label-md" href="/analysis">Analytics</a></nav>
</div>
<div class="flex items-center gap-4">
<div class="hidden md:flex items-center bg-surface-container-high px-3 py-1.5 rounded-lg border border-white/5">
<span class="material-symbols-outlined text-outline text-[20px] mr-2">search</span>
<input class="bg-transparent border-none focus:ring-0 text-label-md font-label-md text-on-surface placeholder:text-outline w-48" placeholder="Search..." type="text"/>
</div>
<button class="material-symbols-outlined text-on-surface-variant hover:bg-surface-variant/50 p-2 rounded-lg transition-all active:scale-95">notifications</button>
<button class="material-symbols-outlined text-on-surface-variant hover:bg-surface-variant/50 p-2 rounded-lg transition-all active:scale-95">settings</button>
<img alt="Admin Profile" class="w-8 h-8 rounded-full border border-primary/20 bg-surface-variant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvv4oXFkQwVNBGcz5j4Fdl2nKupOSMgS_slKHbnpm5ERkC9k4OAdktd2B0LHhUVmxOebkDBoFgl2QAWoPg9bybFd2WkY7J5y9_yhE-8sYYpJ3gzGyTb5u48_qcWPydAtMr0ZkqBxvmTFfQt2_3OojTVRYTZDRkF78u0EMdjG1Tq5EmtjDBrSWvubelZ632Y2HU1_Xme6NXji0Tns_AESEXv5PIH2UmwdmC9rsSWysy-VocfF7CQ1ZjbSRz_TNqJZhUytQJML9L2Pdz"/>
</div>
</div>
</header>
<div class="flex min-h-screen">
<!-- SideNavBar (Shared Component) -->
<!-- Main Content Canvas -->
<main class="flex-1 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
<!-- Header Section -->
<section class="mb-8">
<div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
<div>
<h1 class="text-headline-lg font-headline-lg text-on-surface tracking-tight mb-1">FAQ Management</h1><div class="flex items-center gap-1 bg-surface-container-high p-1 rounded-xl mt-4 w-fit border border-white/5">
<button class="px-4 py-1.5 rounded-lg text-label-sm font-bold text-outline hover:text-on-surface transition-colors">Mission Control</button>
<button class="px-4 py-1.5 rounded-lg text-label-sm font-bold bg-primary text-on-primary shadow-sm">FAQ Management</button>
<button class="px-4 py-1.5 rounded-lg text-label-sm font-bold text-outline hover:text-on-surface transition-colors">Moderation Queue</button>
</div>
<p class="text-body-md font-body-md text-outline">Manage, update, version, categorize, and publish the evolving knowledge repository.</p>
</div>
<div class="flex gap-3">
<button class="flex items-center gap-2 px-5 py-2.5 bg-surface-container-high border border-white/10 rounded-xl text-label-md font-label-md text-on-surface hover:bg-surface-variant/50 transition-all active:scale-95">
<span class="material-symbols-outlined text-[20px]">file_download</span>
                            Export Repository
                        </button>
<button class="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary-container rounded-xl text-label-md font-label-md font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all active:scale-95">
<span class="material-symbols-outlined text-[20px]">add</span>
                            Create FAQ
                        </button>
</div>
</div>
</section>
<!-- Top Metrics Row -->
<section class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
<div class="glass-card p-5 rounded-xl flex flex-col gap-1">
<span class="text-label-sm font-label-sm text-outline uppercase tracking-wider">Published FAQs</span>
<div class="flex items-end gap-2">
<span class="text-headline-md font-headline-md text-on-surface">1,284</span>
<span class="text-secondary text-label-sm font-label-sm mb-1">+4%</span>
</div>
</div>
<div class="glass-card p-5 rounded-xl flex flex-col gap-1">
<span class="text-label-sm font-label-sm text-outline uppercase tracking-wider">Draft Updates</span>
<span class="text-headline-md font-headline-md text-on-surface">42</span>
</div>
<div class="glass-card p-5 rounded-xl flex flex-col gap-1">
<span class="text-label-sm font-label-sm text-outline uppercase tracking-wider">Archived FAQs</span>
<span class="text-headline-md font-headline-md text-on-surface">87</span>
</div>
<div class="glass-card p-5 rounded-xl flex flex-col gap-1">
<span class="text-label-sm font-label-sm text-outline uppercase tracking-wider">Repository Accuracy</span>
<div class="flex items-center gap-2">
<span class="text-headline-md font-headline-md text-primary">98.4%</span>
<div class="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
</div>
</div>
<div class="glass-card p-5 rounded-xl flex flex-col gap-1">
<span class="text-label-sm font-label-sm text-outline uppercase tracking-wider">Categories</span>
<span class="text-headline-md font-headline-md text-on-surface">24</span>
</div>
</section>
<div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
<!-- Main FAQ Table & Search (Left Side) -->
<div class="lg:col-span-9 flex flex-col gap-gutter">
<!-- Search & Filters -->
<div class="glass-card p-4 rounded-xl flex flex-wrap items-center gap-4">
<div class="flex-1 min-w-[300px] relative">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
<input class="w-full bg-surface-container-lowest border border-white/5 focus:border-primary/50 focus:ring-0 rounded-lg pl-10 py-2.5 text-body-md text-on-surface placeholder:text-outline/60" placeholder="Search FAQs, topics, IDs, categories..." type="text"/>
</div>
<div class="flex gap-2">
<select class="bg-surface-container-lowest border border-white/5 rounded-lg text-label-md font-label-md px-3 py-2 focus:ring-primary/20">
<option>Category</option>
</select>
<select class="bg-surface-container-lowest border border-white/5 rounded-lg text-label-md font-label-md px-3 py-2 focus:ring-primary/20">
<option>Status</option>
</select>
<button class="bg-surface-container-high hover:bg-surface-variant/50 p-2 rounded-lg text-outline">
<span class="material-symbols-outlined">tune</span>
</button>
</div>
</div>
<!-- Table Container -->
<div class="glass-card rounded-xl overflow-hidden">
<div class="overflow-x-auto custom-scrollbar">
<table class="w-full text-left border-collapse">
<thead>
<tr class="bg-surface-container/50 border-b border-white/5">
<th class="p-4 text-label-sm font-label-sm text-outline uppercase">FAQ ID</th>
<th class="p-4 text-label-sm font-label-sm text-outline uppercase">Title</th>
<th class="p-4 text-label-sm font-label-sm text-outline uppercase">Category</th>
<th class="p-4 text-label-sm font-label-sm text-outline uppercase">Version</th>
<th class="p-4 text-label-sm font-label-sm text-outline uppercase">AI Confidence</th>
<th class="p-4 text-label-sm font-label-sm text-outline uppercase text-center">Agreement</th>
<th class="p-4 text-label-sm font-label-sm text-outline uppercase">Updated</th>
<th class="p-4 text-label-sm font-label-sm text-outline uppercase">Status</th>
<th class="p-4 text-label-sm font-label-sm text-outline uppercase text-right">Actions</th>
</tr>
</thead>
<tbody class="divide-y divide-white/5">
<!-- Row 1 -->
<tr class="hover:bg-primary/5 transition-colors group">
<td class="p-4 font-label-md text-label-md text-outline">#402</td>
<td class="p-4 font-body-md text-on-surface font-medium max-w-[240px] truncate">Can I change my team after Phase 1?</td>
<td class="p-4">
<span class="px-2.5 py-1 bg-tertiary-container/10 text-tertiary-fixed-dim text-label-sm rounded-full border border-tertiary/20">Team Formation</span>
</td>
<td class="p-4 font-label-md text-label-md text-on-surface-variant">v3.2</td>
<td class="p-4">
<div class="flex items-center gap-2">
<div class="w-12 h-1.5 bg-surface-container rounded-full overflow-hidden">
<div class="bg-secondary h-full" style="width: 94%"></div>
</div>
<span class="text-label-sm text-on-surface">94%</span>
</div>
</td>
<td class="p-4 text-center font-label-md text-on-secondary-fixed">89%</td>
<td class="p-4 text-label-sm text-outline">2 hours ago</td>
<td class="p-4">
<span class="flex items-center gap-1.5 text-secondary-fixed-dim text-label-sm">
<span class="w-1.5 h-1.5 rounded-full bg-secondary-fixed-dim"></span>
                                                Published
                                            </span>
</td>
<td class="p-4 text-right">
<button class="material-symbols-outlined text-outline hover:text-primary transition-colors">more_vert</button>
</td>
</tr>
<!-- Row 2 -->
<tr class="hover:bg-primary/5 transition-colors group">
<td class="p-4 font-label-md text-label-md text-outline">#419</td>
<td class="p-4 font-body-md text-on-surface font-medium max-w-[240px] truncate">Managing Dataset Normalization</td>
<td class="p-4">
<span class="px-2.5 py-1 bg-primary-container/10 text-primary-fixed-dim text-label-sm rounded-full border border-primary/20">Machine Learning</span>
</td>
<td class="p-4 font-label-md text-label-md text-on-surface-variant">v2.1</td>
<td class="p-4">
<div class="flex items-center gap-2">
<div class="w-12 h-1.5 bg-surface-container rounded-full overflow-hidden">
<div class="bg-secondary h-full" style="width: 91%"></div>
</div>
<span class="text-label-sm text-on-surface">91%</span>
</div>
</td>
<td class="p-4 text-center font-label-md text-on-secondary-fixed">84%</td>
<td class="p-4 text-label-sm text-outline">Yesterday</td>
<td class="p-4">
<span class="flex items-center gap-1.5 text-secondary-fixed-dim text-label-sm">
<span class="w-1.5 h-1.5 rounded-full bg-secondary-fixed-dim"></span>
                                                Published
                                            </span>
</td>
<td class="p-4 text-right">
<button class="material-symbols-outlined text-outline hover:text-primary transition-colors">more_vert</button>
</td>
</tr>
<!-- Row 3 -->
<tr class="hover:bg-primary/5 transition-colors group">
<td class="p-4 font-label-md text-label-md text-outline">#388</td>
<td class="p-4 font-body-md text-on-surface font-medium max-w-[240px] truncate">Prompt Evaluation Standards</td>
<td class="p-4">
<span class="px-2.5 py-1 bg-surface-variant text-outline text-label-sm rounded-full border border-white/5">AI Ethics</span>
</td>
<td class="p-4 font-label-md text-label-md text-on-surface-variant">v1.8</td>
<td class="p-4">
<div class="flex items-center gap-2">
<div class="w-12 h-1.5 bg-surface-container rounded-full overflow-hidden">
<div class="bg-outline h-full" style="width: 88%"></div>
</div>
<span class="text-label-sm text-on-surface">88%</span>
</div>
</td>
<td class="p-4 text-center font-label-md text-on-secondary-fixed">82%</td>
<td class="p-4 text-label-sm text-outline">3 days ago</td>
<td class="p-4">
<span class="flex items-center gap-1.5 text-tertiary text-label-sm">
<span class="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                                                Archived
                                            </span>
</td>
<td class="p-4 text-right">
<button class="material-symbols-outlined text-outline hover:text-primary transition-colors">more_vert</button>
</td>
</tr>
</tbody>
</table>
</div>
<!-- Pagination -->
<div class="p-4 bg-surface-container/30 border-t border-white/5 flex justify-between items-center">
<span class="text-label-sm text-outline">Showing 1 to 10 of 1,284 entries</span>
<div class="flex gap-2">
<button class="px-3 py-1 border border-white/5 rounded text-label-md text-outline hover:bg-surface-variant">Prev</button>
<button class="px-3 py-1 bg-primary/20 border border-primary/50 rounded text-label-md text-primary">1</button>
<button class="px-3 py-1 border border-white/5 rounded text-label-md text-outline hover:bg-surface-variant">2</button>
<button class="px-3 py-1 border border-white/5 rounded text-label-md text-outline hover:bg-surface-variant">3</button>
<button class="px-3 py-1 border border-white/5 rounded text-label-md text-outline hover:bg-surface-variant">Next</button>
</div>
</div>
</div>
<!-- Bottom Content: Knowledge Evolution -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">
<!-- Version History Timeline -->
<div class="glass-card p-6 rounded-xl">
<h3 class="text-headline-sm font-headline-md mb-6 flex items-center gap-2">
<span class="material-symbols-outlined text-primary">history</span>
                                FAQ Version History
                            </h3>
<div class="relative space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
<div class="relative pl-10">
<div class="absolute left-1 top-1 w-4 h-4 rounded-full bg-primary ring-4 ring-primary/20"></div>
<div class="flex justify-between mb-1">
<span class="text-label-md font-bold text-on-surface">v3.2 - Validation Refinement</span>
<span class="text-label-sm text-outline">Today</span>
</div>
<p class="text-body-md text-on-surface-variant">Added cross-check evidence for multi-team project participation during phase changes.</p>
</div>
<div class="relative pl-10">
<div class="absolute left-1 top-1 w-4 h-4 rounded-full bg-surface-container-highest border-2 border-outline"></div>
<div class="flex justify-between mb-1">
<span class="text-label-md font-bold text-on-surface">v2.0 - Policy Update</span>
<span class="text-label-sm text-outline">Oct 12, 2023</span>
</div>
<p class="text-body-md text-on-surface-variant">Implemented stricter categorization criteria for machine learning datasets.</p>
</div>
<div class="relative pl-10">
<div class="absolute left-1 top-1 w-4 h-4 rounded-full bg-surface-container-highest border-2 border-outline"></div>
<div class="flex justify-between mb-1">
<span class="text-label-md font-bold text-on-surface">v1.0 - Initial Publication</span>
<span class="text-label-sm text-outline">Aug 05, 2023</span>
</div>
<p class="text-body-md text-on-surface-variant">Initial seeding of common administrative queries into the repository.</p>
</div>
</div>
</div>
<!-- Knowledge Insights Cards -->
<div class="flex flex-col gap-4">
<h3 class="text-headline-sm font-headline-md mb-2 flex items-center gap-2 px-2">
<span class="material-symbols-outlined text-secondary">insights</span>
                                Evolution Insights
                            </h3>
<div class="grid grid-cols-2 gap-4">
<div class="glass-card p-4 rounded-xl border-l-4 border-primary">
<span class="text-label-sm text-outline block mb-2">Most Updated</span>
<span class="text-label-md font-bold text-on-surface">FAQ #402</span>
<span class="text-label-sm text-primary block mt-1">12 Revisions</span>
</div>
<div class="glass-card p-4 rounded-xl border-l-4 border-secondary">
<span class="text-label-sm text-outline block mb-2">Highest Agreement</span>
<span class="text-label-md font-bold text-on-surface">FAQ #912</span>
<span class="text-label-sm text-secondary block mt-1">99.8% Consensus</span>
</div>
<div class="glass-card p-4 rounded-xl border-l-4 border-tertiary">
<span class="text-label-sm text-outline block mb-2">Fastest Growing</span>
<span class="text-label-md font-bold text-on-surface">Ethics Sub-Rep</span>
<span class="text-label-sm text-tertiary block mt-1">+24% MoM</span>
</div>
<div class="glass-card p-4 rounded-xl border-l-4 border-on-secondary-fixed">
<span class="text-label-sm text-outline block mb-2">Top Reused Art.</span>
<span class="text-label-md font-bold text-on-surface">Data Normalizer</span>
<span class="text-label-sm text-on-secondary-fixed block mt-1">4.2k Citations</span>
</div>
</div>
</div>
</div>
</div>
<!-- Right Sidebar (Diagnostics & Distribution) -->
<div class="lg:col-span-3 flex flex-col gap-gutter">
<!-- Repository Health -->
<div class="glass-card p-6 rounded-xl">
<h4 class="text-label-md font-bold text-on-surface mb-6 uppercase tracking-widest border-b border-white/5 pb-2">Repository Health</h4>
<div class="space-y-6">
<div class="flex items-center justify-between">
<div class="flex flex-col">
<span class="text-label-sm text-outline">Accuracy</span>
<span class="text-headline-md font-headline-md text-primary">98.4%</span>
</div>
<span class="material-symbols-outlined text-primary text-[32px]">verified</span>
</div>
<div class="space-y-3">
<div class="flex justify-between text-label-sm">
<span class="text-on-surface-variant">Avg Agreement</span>
<span class="text-on-surface font-bold">89%</span>
</div>
<div class="w-full h-1.5 bg-surface-container rounded-full">
<div class="h-full bg-secondary w-[89%]"></div>
</div>
<div class="flex justify-between text-label-sm">
<span class="text-on-surface-variant">Update Freq</span>
<span class="text-secondary font-bold">+12%</span>
</div>
<div class="flex justify-between text-label-sm">
<span class="text-on-surface-variant">Stability</span>
<span class="text-on-secondary-fixed font-bold">High</span>
</div>
</div>
</div>
</div>
<!-- Recent Updates -->
<div class="glass-card p-6 rounded-xl flex-1">
<h4 class="text-label-md font-bold text-on-surface mb-4 uppercase tracking-widest">Recent Updates</h4>
<div class="space-y-4">
<div class="p-3 rounded-lg bg-surface-container/40 border border-white/5">
<div class="flex items-center gap-2 mb-1">
<span class="w-2 h-2 rounded-full bg-primary"></span>
<span class="text-label-md font-bold text-on-surface">FAQ #402 Updated</span>
</div>
<p class="text-label-sm text-on-surface-variant">New validation evidence added from Phase 2 reports.</p>
<span class="text-[10px] text-outline mt-2 block">14 MINUTES AGO</span>
</div>
<div class="p-3 rounded-lg bg-surface-container/40 border border-white/5">
<div class="flex items-center gap-2 mb-1">
<span class="w-2 h-2 rounded-full bg-tertiary"></span>
<span class="text-label-md font-bold text-on-surface">FAQ #388 Archived</span>
</div>
<p class="text-label-sm text-on-surface-variant">Archived due to deprecation of Prompt V1 standards.</p>
<span class="text-[10px] text-outline mt-2 block">2 HOURS AGO</span>
</div>
<div class="p-3 rounded-lg bg-surface-container/40 border border-white/5">
<div class="flex items-center gap-2 mb-1">
<span class="w-2 h-2 rounded-full bg-secondary"></span>
<span class="text-label-md font-bold text-on-surface">Category Created</span>
</div>
<p class="text-label-sm text-on-surface-variant">"Agentic Reasoning" category added to main repo.</p>
<span class="text-[10px] text-outline mt-2 block">YESTERDAY</span>
</div>
</div>
<button class="w-full mt-4 text-center text-label-sm text-primary hover:underline font-bold">View Full Audit Log</button>
</div>
<!-- Category Distribution -->
<div class="glass-card p-6 rounded-xl">
<h4 class="text-label-md font-bold text-on-surface mb-4 uppercase tracking-widest">Category Distribution</h4>
<div class="space-y-4">
<div class="space-y-2">
<div class="flex justify-between text-label-sm">
<span class="text-outline">AI Ethics</span>
<span class="text-on-surface">420 FAQs</span>
</div>
<div class="w-full h-1 bg-surface-container rounded-full">
<div class="h-full bg-primary w-[32%]"></div>
</div>
</div>
<div class="space-y-2">
<div class="flex justify-between text-label-sm">
<span class="text-outline">Machine Learning</span>
<span class="text-on-surface">315 FAQs</span>
</div>
<div class="w-full h-1 bg-surface-container rounded-full">
<div class="h-full bg-secondary w-[24%]"></div>
</div>
</div>
<div class="space-y-2">
<div class="flex justify-between text-label-sm">
<span class="text-outline">Team Formation</span>
<span class="text-on-surface">204 FAQs</span>
</div>
<div class="w-full h-1 bg-surface-container rounded-full">
<div class="h-full bg-tertiary w-[16%]"></div>
</div>
</div>
<div class="space-y-2">
<div class="flex justify-between text-label-sm">
<span class="text-outline">Other</span>
<span class="text-on-surface">345 FAQs</span>
</div>
<div class="w-full h-1 bg-surface-container rounded-full">
<div class="h-full bg-surface-variant w-[28%]"></div>
</div>
</div>
</div>
</div>
</div>
</div>
</main>
</div>
<!-- Footer Space -->
<footer class="border-t border-white/5 py-8 px-margin-desktop text-center">
<p class="text-label-sm text-outline">© 2024 CrowdMind Intelligence. All analytical systems active. Knowledge Stability: Optimal.</p>
</footer>
<!-- Atmosphere Effects (Canvas/JS) -->
<div class="fixed inset-0 -z-10 pointer-events-none opacity-20 overflow-hidden">
<div class="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full"></div>
<div class="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-secondary/10 blur-[100px] rounded-full"></div>
</div>`
