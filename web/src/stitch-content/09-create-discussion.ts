// Auto-generated from public/stitch-ref/09-create-discussion.html — do not edit by hand
export const pageStyles = `
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-card {
            background: rgba(22, 27, 34, 0.7);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .luminous-border-active {
            border: 1px solid #b0c6ff;
            box-shadow: 0 0 15px rgba(176, 198, 255, 0.15);
        }
        ::-webkit-scrollbar {
            width: 6px;
        }
        ::-webkit-scrollbar-track {
            background: #0A0C12;
        }
        ::-webkit-scrollbar-thumb {
            background: #33343b;
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #424654;
        }
    `
export const bodyHtml = `<!-- TopNavBar -->
<header class="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-xl border-b border-white/10 shadow-sm">
<div class="flex justify-between items-center h-16 px-gutter max-w-container-max mx-auto">
<div class="flex items-center gap-8">
<span class="font-display text-headline-md font-bold text-primary tracking-tight">CrowdMind</span>
<nav class="hidden md:flex items-center gap-6">
<a class="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors" href="#">FAQs</a>
<a class="font-label-md text-label-md text-primary border-b-2 border-primary pb-1" href="#">Discussions</a>
<a class="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors" href="#">Ask Question</a>
<a class="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors" href="#">Analytics</a>
</nav>
</div>
<div class="flex items-center gap-6">
<!-- Global Search -->
<div class="hidden lg:flex items-center relative w-64">
<span class="material-symbols-outlined absolute left-3 text-outline text-[20px]">search</span>
<input class="w-full bg-surface-container-low border border-outline-variant/30 rounded-full py-1.5 pl-10 pr-4 text-label-sm focus:outline-none focus:border-primary/50 transition-all" placeholder="Global Search" type="text">
</div>
<div class="flex items-center gap-2">
<button class="p-2 hover:bg-surface-variant/20 rounded-full transition-all active:scale-95">
<span class="material-symbols-outlined text-on-surface-variant">notifications</span>
</button>
<div class="w-8 h-8 rounded-full overflow-hidden bg-surface-variant border border-outline-variant/30 cursor-pointer">
<img alt="User profile" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXC95FHVs9KJVf6fB1Kfa_yaxnLQ9v2t0QBrTAWdWvoeTMKXeyCiPkrb_Px7Ic-lGsEVq5jmIVs3kHQrgXE_4A2pZjPyFSp7Pkmr_1gPEOUcV6FcNHigRYx5n3QD6Ss3iSL0qPI-kVweU-nSxU_uVc3rqjEmh3dInlt2X0oouX4dgu69cWfntZMoeILZDXBLoH62_QH1ix0jiSC5Y0dNKpd0oDi_Hr-SmxdmR9XG_jhkuEej3PwpDDmncd5S-fcomSerUg94kMzJsN">
</div>
</div>
</div>
</div>
</header>
<main class="pt-24 pb-32 px-margin-desktop max-w-container-max mx-auto">
<div class="grid grid-cols-12 gap-gutter">
<!-- Main Content Area -->
<div class="col-span-12 lg:col-span-8 flex flex-col gap-8">
<header>
<h1 class="font-headline-lg text-headline-lg text-primary mb-2">Start a Discussion</h1>
<p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Launch a community conversation that can evolve into verified knowledge.</p>
</header>
<!-- Discussion Title -->
<section class="flex flex-col gap-3">
<label class="font-label-md text-label-md text-outline uppercase tracking-widest">Discussion Subject</label>
<input class="w-full bg-surface-container-low border border-outline-variant rounded-lg p-4 font-headline-md text-headline-md text-on-surface placeholder:text-outline/50 focus:outline-none focus:border-primary transition-all duration-300" placeholder="What topic would you like the community to explore?" type="text">
</section>
<!-- Domain Classification -->
<section class="flex flex-col gap-4">
<label class="font-label-md text-label-md text-outline uppercase tracking-widest">Domain Classification</label>
<div class="flex flex-wrap gap-2">
<button class="px-4 py-2 rounded-full border border-primary text-primary font-label-md text-label-md bg-primary/10 transition-all hover:brightness-110">AI Ethics</button>
<button class="px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant font-label-md text-label-md hover:bg-white/5 transition-all">Machine Learning</button>
<button class="px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant font-label-md text-label-md hover:bg-white/5 transition-all">LLM Engineering</button>
<button class="px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant font-label-md text-label-md hover:bg-white/5 transition-all">Data Science</button>
<button class="px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant font-label-md text-label-md hover:bg-white/5 transition-all">Research</button>
<button class="px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant font-label-md text-label-md hover:bg-white/5 transition-all">Governance</button>
<button class="px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant font-label-md text-label-md hover:bg-white/5 transition-all">Knowledge Systems</button>
</div>
</section>
<!-- Rich Text Editor -->
<section class="flex flex-col gap-3">
<label class="font-label-md text-label-md text-outline uppercase tracking-widest">Detailed Context</label>
<div class="glass-card rounded-lg overflow-hidden border border-outline-variant">
<!-- Editor Toolbar -->
<div class="flex items-center gap-1 p-2 bg-surface-container-high border-b border-white/5">
<button class="p-2 hover:bg-white/10 rounded transition-colors" title="Bold"><span class="material-symbols-outlined text-[20px]">format_bold</span></button>
<button class="p-2 hover:bg-white/10 rounded transition-colors" title="Italic"><span class="material-symbols-outlined text-[20px]">format_italic</span></button>
<div class="w-[1px] h-6 bg-white/10 mx-1"></div>
<button class="p-2 hover:bg-white/10 rounded transition-colors" title="Bullet List"><span class="material-symbols-outlined text-[20px]">format_list_bulleted</span></button>
<button class="p-2 hover:bg-white/10 rounded transition-colors" title="Numbered List"><span class="material-symbols-outlined text-[20px]">format_list_numbered</span></button>
<div class="w-[1px] h-6 bg-white/10 mx-1"></div>
<button class="p-2 hover:bg-white/10 rounded transition-colors" title="Code Block"><span class="material-symbols-outlined text-[20px]">code</span></button>
<button class="p-2 hover:bg-white/10 rounded transition-colors" title="Quote"><span class="material-symbols-outlined text-[20px]">format_quote</span></button>
<div class="w-[1px] h-6 bg-white/10 mx-1"></div>
<button class="p-2 hover:bg-white/10 rounded transition-colors" title="Link"><span class="material-symbols-outlined text-[20px]">link</span></button>
</div>
<!-- Text Area -->
<textarea class="w-full min-h-[320px] bg-transparent p-6 font-body-md text-body-md text-on-surface placeholder:text-outline/50 resize-none focus:outline-none leading-relaxed" placeholder="Provide context, background, arguments, research, or points for discussion..."></textarea>
</div>
</section>
<!-- Discussion Type Selection (Moved & Enhanced) -->
<section class="flex flex-col gap-4">
<label class="font-label-md text-label-md text-outline uppercase tracking-widest">Methodological Intent</label>
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
<div class="glass-card p-5 rounded-xl flex flex-col items-center text-center gap-3 cursor-pointer hover:bg-white/5 border border-outline-variant transition-all group">
<div class="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center group-hover:bg-primary/20 transition-colors">
<span class="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">forum</span>
</div>
<span class="font-label-md text-label-sm font-bold">Open Discussion</span>
</div>
<div class="glass-card p-5 rounded-xl flex flex-col items-center text-center gap-3 cursor-pointer hover:bg-white/5 border border-outline-variant transition-all group">
<div class="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center group-hover:bg-secondary-fixed/20 transition-colors">
<span class="material-symbols-outlined text-on-surface-variant group-hover:text-secondary-fixed transition-colors">balance</span>
</div>
<span class="font-label-md text-label-sm font-bold">Debate</span>
</div>
<div class="glass-card p-5 rounded-xl flex flex-col items-center text-center gap-3 cursor-pointer luminous-border-active bg-primary/5 border border-primary transition-all group">
<div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
<span class="material-symbols-outlined text-primary">science</span>
</div>
<span class="font-label-md text-label-sm font-bold text-primary">Research Exploration</span>
</div>
<div class="glass-card p-5 rounded-xl flex flex-col items-center text-center gap-3 cursor-pointer hover:bg-white/5 border border-outline-variant transition-all group">
<div class="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center group-hover:bg-tertiary/20 transition-colors">
<span class="material-symbols-outlined text-on-surface-variant group-hover:text-tertiary transition-colors">description</span>
</div>
<span class="font-label-md text-label-sm font-bold">Proposal</span>
</div>
<div class="glass-card p-5 rounded-xl flex flex-col items-center text-center gap-3 cursor-pointer hover:bg-white/5 border border-outline-variant transition-all group">
<div class="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
<span class="material-symbols-outlined text-on-surface-variant group-hover:text-secondary transition-colors">handshake</span>
</div>
<span class="font-label-md text-label-sm font-bold">Consensus Building</span>
</div>
</div>
</section>
<!-- Tags Input -->
<section class="flex flex-col gap-3">
<label class="font-label-md text-label-md text-outline uppercase tracking-widest">Metadata Tags</label>
<div class="flex items-center gap-2 bg-surface-container-low border border-outline-variant rounded-lg p-3">
<span class="px-2 py-1 bg-surface-variant rounded text-label-sm font-label-sm flex items-center gap-1">#rag <span class="material-symbols-outlined text-xs">close</span></span>
<input class="bg-transparent border-none focus:ring-0 font-body-md text-body-md flex-1" placeholder="Add relevant tags (e.g., #llm, #ethics)..." type="text">
</div>
</section>
</div>
<!-- Right Sidebar -->
<aside class="col-span-12 lg:col-span-4 flex flex-col gap-6">
<!-- AI Discussion Assistant -->
<div class="glass-card p-6 rounded-xl border border-primary/20 bg-primary/5">
<div class="flex items-center gap-2 mb-6">
<span class="material-symbols-outlined text-primary animate-pulse">psychology</span>
<h3 class="font-headline-md text-headline-md text-primary">AI Discussion Assistant</h3>
</div>
<div class="space-y-6">
<div>
<div class="flex justify-between items-center mb-2">
<span class="font-label-md text-label-md text-on-surface">Topic Clarity Score</span>
<span class="font-label-md text-label-md text-primary font-bold">84%</span>
</div>
<div class="w-full h-1 bg-surface-variant rounded-full overflow-hidden">
<div class="h-full bg-primary w-[84%]"></div>
</div>
</div>
<div class="grid grid-cols-1 gap-4">
<div class="p-4 bg-surface-container/50 rounded-lg border border-white/5">
<p class="font-label-sm text-label-sm text-outline mb-3 uppercase tracking-widest">Potential Duplicate Discussions Found</p>
<div class="space-y-3">
<!-- Mini Duplicate Card 1 -->
<div class="p-3 bg-surface-container-high rounded-lg border border-white/5 hover:border-primary/30 transition-all cursor-pointer group">
<p class="font-label-md text-label-sm font-bold text-on-surface mb-1 group-hover:text-primary">Ethics of Synthetic Medical Data</p>
<div class="flex items-center justify-between">
<span class="text-[10px] font-label-sm text-secondary-fixed">74% Agreement</span>
<span class="text-[10px] font-label-sm text-outline">Consensus Building</span>
</div>
<a class="mt-2 block text-[10px] font-label-sm text-primary hover:underline" href="#">Open Discussion →</a>
</div>
<!-- Mini Duplicate Card 2 -->
<div class="p-3 bg-surface-container-high rounded-lg border border-white/5 hover:border-primary/30 transition-all cursor-pointer group">
<p class="font-label-md text-label-sm font-bold text-on-surface mb-1 group-hover:text-primary">Bias in Vector Embeddings</p>
<div class="flex items-center justify-between">
<span class="text-[10px] font-label-sm text-primary">42% Agreement</span>
<span class="text-[10px] font-label-sm text-outline">Open Discussion</span>
</div>
<a class="mt-2 block text-[10px] font-label-sm text-primary hover:underline" href="#">Open Discussion →</a>
</div>
</div>
</div>
</div>
<div class="flex flex-col gap-2">
<p class="font-label-sm text-label-sm text-outline uppercase tracking-wider">Suggested Improvements</p>
<ul class="space-y-2">
<li class="flex items-start gap-2 text-label-sm font-label-sm text-on-surface-variant">
<span class="material-symbols-outlined text-xs text-primary mt-0.5">add_circle</span>
                                    Link to the 2024 AI Governance Paper for better context.
                                </li>
<li class="flex items-start gap-2 text-label-sm font-label-sm text-on-surface-variant">
<span class="material-symbols-outlined text-xs text-primary mt-0.5">add_circle</span>
                                    Specify which LLM architectures this applies to.
                                </li>
</ul>
</div>
</div>
</div>
<!-- AI Prediction Card (New) -->
<div class="glass-card p-6 rounded-xl border border-secondary/20">
<div class="flex items-center justify-between mb-6">
<h3 class="font-label-md text-label-md text-secondary uppercase tracking-widest font-bold">AI Prediction</h3>
<span class="material-symbols-outlined text-secondary">analytics</span>
</div>
<div class="space-y-4">
<div class="flex items-center justify-between p-3 bg-surface-container-low rounded-lg">
<span class="text-label-sm font-label-sm text-on-surface-variant">FAQ Probability</span>
<span class="text-label-md font-bold text-secondary">85%</span>
</div>
<div class="flex items-center justify-between p-3 bg-surface-container-low rounded-lg">
<span class="text-label-sm font-label-sm text-on-surface-variant">Expected Community Engagement</span>
<span class="text-label-md font-bold text-secondary">High</span>
</div>
<div class="flex items-center justify-between p-3 bg-surface-container-low rounded-lg">
<span class="text-label-sm font-label-sm text-on-surface-variant">Estimated Consensus Potential</span>
<span class="text-label-md font-bold text-secondary">78%</span>
</div>
</div>
</div>
<!-- Knowledge Evolution Roadmap -->
<div class="glass-card p-6 rounded-xl">
<h3 class="font-label-md text-label-md text-tertiary font-bold uppercase tracking-widest mb-4">Evolution Roadmap</h3>
<div class="relative py-4 mb-4">
<!-- Pipeline Line -->
<div class="absolute top-1/2 left-0 w-full h-[1px] bg-outline-variant -translate-y-1/2"></div>
<div class="relative flex justify-between">
<div class="w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/20"></div>
<div class="w-2.5 h-2.5 rounded-full bg-outline-variant"></div>
<div class="w-2.5 h-2.5 rounded-full bg-outline-variant"></div>
<div class="w-2.5 h-2.5 rounded-full bg-outline-variant"></div>
<div class="w-2.5 h-2.5 rounded-full bg-outline-variant"></div>
</div>
</div>
<div class="flex justify-between text-[10px] font-label-sm uppercase text-outline mb-6">
<span class="text-primary font-bold">Discussion</span>
<span>Consensus</span>
<span>AI Synthesis</span>
<span>Validation</span>
<span>FAQ</span>
</div>
<p class="font-label-sm text-label-sm text-on-surface-variant leading-relaxed">
                        High-quality discussions can evolve into verified <span class="text-primary font-bold">CrowdMind FAQs</span> through community synthesis.
                    </p>
</div>
<!-- Similar Discussions (Legacy Context) -->
<div class="flex flex-col gap-4">
<h3 class="font-label-md text-label-md text-outline uppercase tracking-widest">Active Correlated Research</h3>
<div class="glass-card p-4 rounded-lg flex flex-col gap-3 hover:border-primary/40 transition-all cursor-pointer">
<p class="font-label-md text-label-sm font-bold text-on-surface">Recursive Feedback Loops in RL</p>
<div class="flex justify-between items-center text-[11px] font-label-sm uppercase text-outline">
<span class="text-secondary-fixed">94% Community</span>
<span class="px-2 py-0.5 bg-secondary-container/20 text-secondary-fixed rounded">Evolving</span>
</div>
</div>
</div>
</aside>
</div>
</main>
<!-- Bottom Actions Bar -->
<footer class="fixed bottom-0 left-0 w-full bg-surface-container-low/80 backdrop-blur-2xl border-t border-white/5 py-6 px-margin-desktop z-50">
<div class="max-w-container-max mx-auto flex justify-between items-center">
<div class="flex items-center gap-4 text-label-sm font-label-sm text-outline">
<span class="flex items-center gap-1"><span class="material-symbols-outlined text-xs">cloud_done</span> Autosaved at 14:02</span>
<span class="w-[1px] h-4 bg-outline-variant"></span>
<span class="flex items-center gap-1"><span class="material-symbols-outlined text-xs">visibility</span> Visibility: Community Public</span>
</div>
<div class="flex items-center gap-4">
<button class="px-6 py-2 rounded-lg font-label-md text-label-md text-on-surface hover:bg-white/5 transition-all active:scale-95">Preview</button>
<button class="px-6 py-2 rounded-lg font-label-md text-label-md text-on-surface border border-outline-variant hover:bg-white/5 transition-all active:scale-95">Save Draft</button>
<button class="px-8 py-2 rounded-lg font-label-md text-label-md font-bold bg-primary text-on-primary shadow-[0_0_20px_rgba(176,198,255,0.3)] hover:brightness-110 transition-all active:scale-95">Publish Discussion</button>
</div>
</div>
</footer>`
