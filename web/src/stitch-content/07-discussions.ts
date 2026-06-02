// Auto-generated from public/stitch-ref/07-discussions.html — do not edit by hand
export const pageStyles = `
        body {
            background-color: #111319;
            color: #e2e2eb;
            scroll-behavior: smooth;
        }
        .glass-card {
            background: rgba(22, 27, 34, 0.7);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }
        .glass-card:hover {
            border-color: rgba(176, 198, 255, 0.4);
            transform: translateY(-4px);
        }
        .neon-glow {
            box-shadow: 0 0 15px rgba(85, 141, 255, 0.3);
        }
        .scrollbar-custom::-webkit-scrollbar {
            width: 4px;
        }
        .scrollbar-custom::-webkit-scrollbar-track {
            background: #111319;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb {
            background: #33343b;
            border-radius: 10px;
        }
        .quick-actions {
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.2s ease-out;
        }
        .glass-card:hover .quick-actions {
            opacity: 1;
            transform: translateY(0);
        }
    `
export const bodyHtml = `<!-- Top Navigation Bar -->
<nav class="bg-surface/70 backdrop-blur-xl border-b border-white/10 docked full-width top-0 sticky z-50 h-16">
<div class="flex justify-between items-center w-full px-gutter max-w-container-max mx-auto h-full">
<div class="flex items-center gap-8">
<span class="font-display text-headline-md font-semibold text-primary-container tracking-tight">CrowdMind</span>
<div class="hidden md:flex items-center gap-6">
<a class="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors duration-200" href="#">FAQs</a>
<a class="font-label-sm text-label-sm text-primary border-b-2 border-primary pb-1" href="#">Discussions</a>
<a class="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors duration-200" href="#">Ask Question</a>
<a class="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors duration-200" href="#">Analytics</a>
</div>
</div>
<div class="flex items-center gap-4">
<button class="material-symbols-outlined text-on-surface-variant hover:bg-white/5 p-2 rounded-full transition-all duration-200 ease-out">notifications</button>
<div class="h-8 w-8 rounded-full overflow-hidden border border-outline-variant">
<img alt="Researcher Profile" class="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQzVu3lVFcMrosAPGQykca7uam0N-kq9JQL3Sdcju00OWeM7etRW4FCz913JuDttjMjfj_ni5rGWDhRYV1-EyjRDZUmTx32kMVjVbPlIlCRObqwRHEN1ZaKaOMymbNo30iJNxXuENCTyUOs1CAXOb7MLw89xO7vnkhSOSEmJrfs7CEdoR8R_Aj7UHvntU15p9OPjRFVu4kNExXOO-LiBUArejR1K4_i4dOcwCh8csEEMLhSVqhtL0mtcK30Fu9MMiqFpkhTQsgaW80">
</div>
</div>
</div>
</nav>
<main class="max-w-container-max mx-auto px-margin-desktop py-12">
<!-- Header Section -->
<header class="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
<div class="max-w-2xl">
<h1 class="font-headline-lg text-headline-lg text-on-surface mb-2">Community Discussions</h1>
<p class="font-body-lg text-body-lg text-on-surface-variant">Explore evolving conversations, unresolved questions, and emerging knowledge artifacts.</p>
</div>
<div class="flex items-center gap-4">
<button class="bg-outline-variant hover:bg-surface-variant text-on-surface border border-outline-variant px-6 py-2.5 rounded-lg font-label-md text-label-md transition-all duration-200 active:scale-95">
                    Ask Question
                </button>
<button class="bg-primary-container hover:brightness-110 text-on-primary-container px-6 py-2.5 rounded-lg font-label-md text-label-md transition-all duration-200 active:scale-95 neon-glow flex items-center gap-2">
<span class="material-symbols-outlined text-[20px]">add</span>
                    Create Discussion
                </button>
</div>
</header>
<!-- Search & Filters -->
<section class="mb-10">
<div class="relative mb-6">
<span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
<input class="w-full bg-surface-container-low border border-outline-variant rounded-xl py-4 pl-12 pr-4 text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="Search discussions, topics, contributors, or knowledge artifacts..." type="text">
</div>
<div class="flex flex-wrap gap-2">
<button class="px-4 py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm">All Discussions</button>
<button class="px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-outline-variant font-label-sm text-label-sm transition-colors">Open Questions</button>
<button class="px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-outline-variant font-label-sm text-label-sm transition-colors">Answered</button>
<button class="px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-outline-variant font-label-sm text-label-sm transition-colors">Trending</button>
<button class="px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-outline-variant font-label-sm text-label-sm transition-colors">AI Escalated</button>
</div>
</section>
<!-- Main Content Grid -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
<!-- Discussion Feed -->
<div class="lg:col-span-8 space-y-6">
<!-- Card 1 -->
<article class="glass-card p-6 rounded-xl group/card">
<div class="flex justify-between items-start mb-4">
<div class="flex flex-wrap items-center gap-2">
<span class="font-label-sm text-label-sm bg-primary-container/10 text-primary-fixed-dim px-2 py-0.5 rounded border border-primary-fixed-dim/20 uppercase tracking-tighter">Consensus Building</span>
<span class="font-label-sm text-label-sm bg-secondary-container/10 text-secondary-fixed-dim px-2 py-0.5 rounded border border-secondary-fixed-dim/20">Machine Learning</span>
<span class="font-label-sm text-[10px] text-primary-container border border-primary-container/30 px-2 py-0.5 rounded-full bg-primary-container/5">HIGH MOMENTUM</span>
</div>
<div class="flex flex-col items-end">
<span class="text-label-sm font-label-sm text-outline uppercase tracking-wider">AI Confidence</span>
<span class="text-headline-md font-headline-md text-primary">82%</span>
</div>
</div>
<h3 class="font-headline-md text-headline-md text-on-surface mb-4 group-hover/card:text-primary transition-colors cursor-pointer leading-tight">Can synthetic datasets replace real-world medical training data?</h3>
<!-- Compact Metrics Row -->
<div class="flex flex-wrap items-center gap-y-4 gap-x-6 mb-6 py-4 border-y border-white/5 font-label-sm text-label-sm text-on-surface-variant">
<div class="flex items-center gap-1.5">
<span class="material-symbols-outlined text-[18px] text-outline">thumb_up</span>
<span>412</span>
</div>
<div class="flex items-center gap-1.5">
<span class="material-symbols-outlined text-[18px] text-outline">visibility</span>
<span>2.8k</span>
</div>
<div class="flex items-center gap-1.5">
<span class="material-symbols-outlined text-[18px] text-outline">groups</span>
<span>18 unique</span>
</div>
<div class="flex items-center gap-1.5 text-primary-fixed-dim">
<span class="material-symbols-outlined text-[18px]">trending_up</span>
<span>Rising Consensus</span>
</div>
<div class="flex items-center gap-1.5 ml-auto text-outline">
<span class="material-symbols-outlined text-[18px]">schedule</span>
<span>3 days ago</span>
</div>
</div>
<div class="flex items-center justify-between">
<div class="flex-1 max-w-[70%]">
<span class="text-[10px] font-label-sm text-outline mb-2 block uppercase tracking-widest">Evolution Stage</span>
<div class="flex items-center gap-1">
<div class="h-1 flex-1 bg-primary-container rounded-full"></div>
<div class="h-1 flex-1 bg-primary-container rounded-full"></div>
<div class="h-1 flex-1 bg-primary-container w-3/4 rounded-full relative overflow-hidden">
<div class="absolute inset-0 bg-white/20 animate-pulse"></div>
</div>
<div class="h-1 flex-1 bg-surface-variant rounded-full"></div>
</div>
</div>
<!-- Quick Actions -->
<div class="quick-actions flex items-center gap-2">
<button class="p-2 hover:bg-white/10 rounded-full text-on-surface-variant hover:text-primary transition-colors" title="Follow">
<span class="material-symbols-outlined text-[20px]">bookmark</span>
</button>
<button class="p-2 hover:bg-white/10 rounded-full text-on-surface-variant hover:text-primary transition-colors" title="Share">
<span class="material-symbols-outlined text-[20px]">share</span>
</button>
<button class="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-1.5 rounded-lg text-label-sm font-label-md transition-colors">
                                View Discussion
                            </button>
</div>
</div>
</article>
<!-- Card 2 -->
<article class="glass-card p-6 rounded-xl group/card">
<div class="flex justify-between items-start mb-4">
<div class="flex flex-wrap items-center gap-2">
<span class="font-label-sm text-label-sm bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-tighter">FAQ Candidate</span>
<span class="font-label-sm text-label-sm bg-secondary-container/10 text-secondary-fixed-dim px-2 py-0.5 rounded border border-secondary-fixed-dim/20">LLM Engineering</span>
<span class="font-label-sm text-[10px] text-secondary-fixed-dim border border-secondary-fixed-dim/30 px-2 py-0.5 rounded-full bg-secondary-fixed-dim/5">STABLE</span>
</div>
<div class="flex flex-col items-end">
<span class="text-label-sm font-label-sm text-outline uppercase tracking-wider">AI Confidence</span>
<span class="text-headline-md font-headline-md text-primary">93%</span>
</div>
</div>
<h3 class="font-headline-md text-headline-md text-on-surface mb-4 group-hover/card:text-primary transition-colors cursor-pointer leading-tight">Best strategy for reducing hallucinations in enterprise RAG systems?</h3>
<div class="flex flex-wrap items-center gap-y-4 gap-x-6 mb-6 py-4 border-y border-white/5 font-label-sm text-label-sm text-on-surface-variant">
<div class="flex items-center gap-1.5">
<span class="material-symbols-outlined text-[18px] text-outline">thumb_up</span>
<span>1.2k</span>
</div>
<div class="flex items-center gap-1.5">
<span class="material-symbols-outlined text-[18px] text-outline">visibility</span>
<span>12.4k</span>
</div>
<div class="flex items-center gap-1.5">
<span class="material-symbols-outlined text-[18px] text-outline">groups</span>
<span>42 unique</span>
</div>
<div class="flex items-center gap-1.5 text-emerald-400">
<span class="material-symbols-outlined text-[18px]">check_circle</span>
<span>Stable Consensus</span>
</div>
<div class="flex items-center gap-1.5 ml-auto text-outline">
<span class="material-symbols-outlined text-[18px]">schedule</span>
<span>14m ago</span>
</div>
</div>
<div class="flex items-center justify-between">
<div class="flex-1 max-w-[70%]">
<span class="text-[10px] font-label-sm text-outline mb-2 block uppercase tracking-widest">Evolution Stage</span>
<div class="flex items-center gap-1">
<div class="h-1 flex-1 bg-primary-container rounded-full"></div>
<div class="h-1 flex-1 bg-primary-container rounded-full"></div>
<div class="h-1 flex-1 bg-primary-container rounded-full"></div>
<div class="h-1 flex-1 bg-primary-container w-1/4 rounded-full relative overflow-hidden">
<div class="absolute inset-0 bg-white/20 animate-pulse"></div>
</div>
</div>
</div>
<div class="quick-actions flex items-center gap-2">
<button class="p-2 hover:bg-white/10 rounded-full text-on-surface-variant hover:text-primary" title="Follow"><span class="material-symbols-outlined text-[20px]">bookmark</span></button>
<button class="p-2 hover:bg-white/10 rounded-full text-on-surface-variant hover:text-primary" title="Share"><span class="material-symbols-outlined text-[20px]">share</span></button>
<button class="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-1.5 rounded-lg text-label-sm font-label-md">View Discussion</button>
</div>
</div>
</article>
<!-- Card 3 -->
<article class="glass-card p-6 rounded-xl group/card">
<div class="flex justify-between items-start mb-4">
<div class="flex flex-wrap items-center gap-2">
<span class="font-label-sm text-label-sm bg-outline-variant/30 text-outline px-2 py-0.5 rounded border border-outline-variant/20 uppercase tracking-tighter">Open Discussion</span>
<span class="font-label-sm text-label-sm bg-secondary-container/10 text-secondary-fixed-dim px-2 py-0.5 rounded border border-secondary-fixed-dim/20">AI Ethics</span>
<span class="font-label-sm text-[10px] text-primary-container border border-primary-container/30 px-2 py-0.5 rounded-full bg-primary-container/5">GROWING FAST</span>
</div>
<div class="flex flex-col items-end">
<span class="text-label-sm font-label-sm text-outline uppercase tracking-wider">AI Confidence</span>
<span class="text-headline-md font-headline-md text-primary">68%</span>
</div>
</div>
<h3 class="font-headline-md text-headline-md text-on-surface mb-4 group-hover/card:text-primary transition-colors cursor-pointer leading-tight">Should AI-generated citations be independently verified?</h3>
<div class="flex flex-wrap items-center gap-y-4 gap-x-6 mb-6 py-4 border-y border-white/5 font-label-sm text-label-sm text-on-surface-variant">
<div class="flex items-center gap-1.5">
<span class="material-symbols-outlined text-[18px] text-outline">thumb_up</span>
<span>84</span>
</div>
<div class="flex items-center gap-1.5">
<span class="material-symbols-outlined text-[18px] text-outline">visibility</span>
<span>1.1k</span>
</div>
<div class="flex items-center gap-1.5">
<span class="material-symbols-outlined text-[18px] text-outline">groups</span>
<span>11 unique</span>
</div>
<div class="flex items-center gap-1.5 text-outline">
<span class="material-symbols-outlined text-[18px]">remove_circle_outline</span>
<span>Stable Trend</span>
</div>
<div class="flex items-center gap-1.5 ml-auto text-outline">
<span class="material-symbols-outlined text-[18px]">schedule</span>
<span>1h ago</span>
</div>
</div>
<div class="flex items-center justify-between">
<div class="flex-1 max-w-[70%]">
<span class="text-[10px] font-label-sm text-outline mb-2 block uppercase tracking-widest">Evolution Stage</span>
<div class="flex items-center gap-1">
<div class="h-1 flex-1 bg-primary-container rounded-full"></div>
<div class="h-1 flex-1 bg-primary-container w-1/2 rounded-full relative overflow-hidden">
<div class="absolute inset-0 bg-white/20 animate-pulse"></div>
</div>
<div class="h-1 flex-1 bg-surface-variant rounded-full"></div>
<div class="h-1 flex-1 bg-surface-variant rounded-full"></div>
</div>
</div>
<div class="quick-actions flex items-center gap-2">
<button class="p-2 hover:bg-white/10 rounded-full text-on-surface-variant hover:text-primary" title="Follow"><span class="material-symbols-outlined text-[20px]">bookmark</span></button>
<button class="p-2 hover:bg-white/10 rounded-full text-on-surface-variant hover:text-primary" title="Share"><span class="material-symbols-outlined text-[20px]">share</span></button>
<button class="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-1.5 rounded-lg text-label-sm font-label-md">View Discussion</button>
</div>
</div>
</article>
</div>
<!-- Right Sidebar -->
<aside class="lg:col-span-4 space-y-6">
<!-- Community Health -->
<div class="glass-card p-6 rounded-xl">
<h4 class="font-headline-md text-headline-md text-on-surface mb-6">Community Health</h4>
<div class="space-y-4">
<div class="flex justify-between items-center">
<span class="text-on-surface-variant">Active Discussions</span>
<span class="font-label-md text-label-md text-primary">1,482</span>
</div>
<div class="flex justify-between items-center">
<span class="text-on-surface-variant">Average Agreement</span>
<span class="font-label-md text-label-md text-secondary-fixed-dim">76.4%</span>
</div>
<div class="flex justify-between items-center">
<span class="text-on-surface-variant">FAQs Published (MoM)</span>
<span class="font-label-md text-label-md text-primary">+12</span>
</div>
<div class="flex justify-between items-center">
<span class="text-on-surface-variant">Active Today</span>
<span class="font-label-md text-label-md text-primary">842</span>
</div>
<div class="pt-6 border-t border-white/5">
<div class="flex justify-between items-center mb-2">
<span class="text-on-surface font-semibold">Knowledge Accuracy</span>
<span class="text-secondary-fixed-dim font-display">98.4%</span>
</div>
<div class="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden">
<div class="bg-secondary-fixed-dim h-full" style="width: 98.4%"></div>
</div>
</div>
</div>
</div>
<!-- Trending Discussions -->
<div class="glass-card p-6 rounded-xl">
<div class="flex items-center justify-between mb-6">
<h4 class="font-label-md text-label-md text-outline uppercase tracking-wider">Trending</h4>
<span class="material-symbols-outlined text-primary text-[20px]">trending_up</span>
</div>
<ul class="space-y-6">
<li class="group cursor-pointer">
<p class="text-on-surface group-hover:text-primary transition-colors text-body-md line-clamp-1 mb-1 font-medium">Multi-modal embedding benchmarks</p>
<div class="flex items-center gap-3 text-[11px] font-label-sm text-outline">
<span class="text-primary-container font-bold">Score: 942</span>
<span class="text-emerald-400">+12% growth</span>
<span>18 new users</span>
</div>
</li>
<li class="group cursor-pointer">
<p class="text-on-surface group-hover:text-primary transition-colors text-body-md line-clamp-1 mb-1 font-medium">Governance for open models</p>
<div class="flex items-center gap-3 text-[11px] font-label-sm text-outline">
<span class="text-primary-container font-bold">Score: 811</span>
<span class="text-emerald-400">+8% growth</span>
<span>12 new users</span>
</div>
</li>
</ul>
</div>
<!-- Recently Converted to FAQ -->
<div class="glass-card p-6 rounded-xl border-emerald-500/10">
<h4 class="font-label-md text-label-md text-outline uppercase mb-4 tracking-wider">Knowledge Transitions</h4>
<div class="space-y-4">
<div class="p-3 bg-white/5 rounded-lg border border-white/5">
<div class="flex items-center gap-2 text-[11px] font-label-sm text-on-surface-variant mb-2">
<span class="bg-surface-variant px-2 py-0.5 rounded">Disc #882</span>
<span class="material-symbols-outlined text-[14px]">arrow_forward</span>
<span class="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">FAQ #402 Published</span>
</div>
<a class="text-label-sm text-primary flex items-center gap-1 hover:underline" href="#">
                                View FAQ Artifact <span class="material-symbols-outlined text-[16px]">open_in_new</span>
</a>
</div>
<div class="p-3 bg-white/5 rounded-lg border border-white/5">
<div class="flex items-center gap-2 text-[11px] font-label-sm text-on-surface-variant mb-2">
<span class="bg-surface-variant px-2 py-0.5 rounded">Disc #1041</span>
<span class="material-symbols-outlined text-[14px]">arrow_forward</span>
<span class="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">FAQ #419 Published</span>
</div>
<a class="text-label-sm text-primary flex items-center gap-1 hover:underline" href="#">
                                View FAQ Artifact <span class="material-symbols-outlined text-[16px]">open_in_new</span>
</a>
</div>
</div>
</div>
<!-- Top Contributors -->
<div class="glass-card p-6 rounded-xl">
<h4 class="font-label-md text-label-md text-outline uppercase mb-4 tracking-wider">Top Contributors</h4>
<div class="space-y-4">
<div class="flex items-center gap-3">
<img class="h-10 w-10 rounded-full object-cover border border-primary/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD90dm-VdngAiUmUnCXxl6r1icf5tdeSO-GoeTh3w2iyOnMyoyW10EeeK1ZKn-3yG-hszNLk4F6cy1kRqSoTlnx_QooX3nyt4i-1cKFAzhdQJHYqIc-hbw-boeGZLV2iQB-YBBKIh7-7DGaoADWxvePvpWG-5EoIQdjOuY2FkVHEZTRCtIzBgGVf8Opg1CWyq0T11-79hhpgRlwsljwsaohOBsE7bhL1aTvSQKjJSFgJXhaI-Q8iD4YvI0im9Ii58xbj0Sq-q5Whtfs">
<div>
<p class="text-on-surface font-semibold text-body-md">Dr. Elena Rostova</p>
<p class="text-label-sm text-outline">Ethics Lead • 12k Rep</p>
</div>
</div>
<div class="flex items-center gap-3">
<img class="h-10 w-10 rounded-full object-cover border border-primary/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIRbUzz3dQcH5RWSuYBlbUzd7fyT9KEQTWVQWLzM2U4wnPdNYSjZr78DTDTaAwWvLi-ZRqoGw6uPr2sjmP2g3VXcyhd260ROUS1Ezn6ic1siEujsmbvxCX72uT_X39d-dhUKYTulsmkvepDsRLyqt0B4nQFNnmyAX0EO7jWJ2y94mwdeyjh3tnlnOF_6qY1_DwbXEDRRn7qSk1VeEEH1WWygKKSGCymmkxuSD_1J4gdImLTArb0uwhO5WnnpjO-AzoT-Cu1bdaBz2n">
<div>
<p class="text-on-surface font-semibold text-body-md">Marcus Thorne</p>
<p class="text-label-sm text-outline">RAG Architect • 9.8k Rep</p>
</div>
</div>
</div>
</div>
</aside>
</div>
<!-- Knowledge Evolution Pipeline -->
<section class="mt-section-gap mb-12">
<h2 class="font-headline-md text-headline-md text-on-surface mb-8">Knowledge Evolution Pipeline</h2>
<div class="glass-card p-8 rounded-2xl">
<div class="flex flex-col md:flex-row items-center justify-between gap-6 relative">
<!-- Pipeline Track -->
<div class="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 hidden md:block z-0"></div>
<div class="flex flex-col items-center gap-4 z-10 relative bg-background px-4 text-center">
<div class="h-12 w-12 rounded-full border border-outline-variant flex items-center justify-center bg-surface-container">
<span class="material-symbols-outlined text-outline">help_outline</span>
</div>
<span class="font-label-sm text-label-sm text-on-surface-variant">Question</span>
</div>
<div class="flex flex-col items-center gap-4 z-10 relative bg-background px-4 text-center">
<div class="h-12 w-12 rounded-full border border-primary-container flex items-center justify-center bg-surface-container">
<span class="material-symbols-outlined text-primary-container">forum</span>
</div>
<span class="font-label-sm text-label-sm text-primary-container">Discussion</span>
</div>
<div class="flex flex-col items-center gap-4 z-10 relative bg-background px-4 text-center">
<div class="h-12 w-12 rounded-full border border-outline-variant flex items-center justify-center bg-surface-container">
<span class="material-symbols-outlined text-outline">group</span>
</div>
<span class="font-label-sm text-label-sm text-on-surface-variant">Consensus</span>
</div>
<div class="flex flex-col items-center gap-4 z-10 relative bg-background px-4 text-center">
<div class="h-12 w-12 rounded-full border border-outline-variant flex items-center justify-center bg-surface-container">
<span class="material-symbols-outlined text-outline">verified</span>
</div>
<span class="font-label-sm text-label-sm text-on-surface-variant">Validation</span>
</div>
<div class="flex flex-col items-center gap-4 z-10 relative bg-background px-4 text-center">
<div class="h-12 w-12 rounded-full border border-secondary-container flex items-center justify-center bg-surface-container">
<span class="material-symbols-outlined text-secondary-container">book</span>
</div>
<span class="font-label-sm text-label-sm text-secondary-container">FAQ Artifact</span>
</div>
</div>
<div class="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-12 border-t border-white/5">
<div class="text-center">
<p class="font-display text-headline-md text-on-surface">12.4K</p>
<p class="font-label-sm text-label-sm text-outline uppercase tracking-widest">Discussions</p>
</div>
<div class="text-center">
<p class="font-display text-headline-md text-on-surface">3.1K</p>
<p class="font-label-sm text-label-sm text-outline uppercase tracking-widest">Contributors</p>
</div>
<div class="text-center">
<p class="font-display text-headline-md text-on-surface">1,284</p>
<p class="font-label-sm text-label-sm text-outline uppercase tracking-widest">Knowledge Artifacts</p>
</div>
<div class="text-center">
<p class="font-display text-headline-md text-secondary-fixed-dim">98.4%</p>
<p class="font-label-sm text-label-sm text-outline uppercase tracking-widest">Accuracy Score</p>
</div>
</div>
</div>
</section>
</main>
<!-- Footer -->
<footer class="bg-background border-t border-outline-variant/30 w-full mt-section-gap">
<div class="max-w-container-max mx-auto px-margin-desktop py-12 flex flex-col md:flex-row justify-between items-center gap-8">
<div class="flex flex-col gap-4 items-center md:items-start">
<span class="font-display text-headline-md font-bold text-on-surface">CrowdMind</span>
<p class="font-body-md text-body-md text-on-surface-variant max-w-xs text-center md:text-left">© 2024 CrowdMind Research Ecosystem. High-signal knowledge for an AI-augmented world.</p>
</div>
<div class="flex flex-wrap justify-center gap-8">
<a class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Privacy Policy</a>
<a class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Terms of Service</a>
<a class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">API Documentation</a>
<a class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Ethics Framework</a>
</div>
</div>
</footer>`
