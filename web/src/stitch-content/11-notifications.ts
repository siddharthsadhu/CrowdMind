// Auto-generated from public/stitch-ref/11-notifications.html — do not edit by hand
export const pageStyles = `
        :root {
            --surface-glass: rgba(22, 27, 34, 0.7);
            --border-glass: rgba(255, 255, 255, 0.1);
        }
        body {
            background-color: #0A0C12;
            color: #e2e2eb;
            font-family: 'Inter', sans-serif;
        }
        .glass-card {
            background: var(--surface-glass);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border-glass);
            transition: all 200ms ease-out;
        }
        .glass-card:hover {
            border-color: rgba(176, 198, 255, 0.3);
            box-shadow: 0 0 20px rgba(85, 141, 255, 0.1);
        }
        .priority-high { border-left: 4px solid #00eefc; }
        .priority-medium { border-left: 4px solid #a476ff; }
        .priority-info { border-left: 4px solid #424654; }
        
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
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            vertical-align: middle;
        }
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    `
export const bodyHtml = `<!-- TopNavBar -->
<header class="bg-surface/70 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 h-16 flex items-center">
<div class="flex justify-between items-center w-full px-gutter max-w-container-max mx-auto">
<div class="flex items-center gap-8">
<span class="text-headline-md font-headline-md font-bold text-primary tracking-tight">CrowdMind</span>
<nav class="hidden md:flex items-center gap-6">
<a class="text-on-surface-variant font-medium font-body-md text-body-md hover:text-primary transition-colors duration-200" href="#">FAQs</a>
<a class="text-on-surface-variant font-medium font-body-md text-body-md hover:text-primary transition-colors duration-200" href="#">Discussions</a>
<a class="text-on-surface-variant font-medium font-body-md text-body-md hover:text-primary transition-colors duration-200" href="#">Ask Question</a>
<a class="text-on-surface-variant font-medium font-body-md text-body-md hover:text-primary transition-colors duration-200" href="#">Analytics</a>
</nav>
</div>
<div class="flex items-center gap-4">
<button class="material-symbols-outlined text-on-surface-variant hover:text-primary p-2 transition-colors duration-200" data-icon="notifications">notifications</button>
<button class="material-symbols-outlined text-on-surface-variant hover:text-primary p-2 transition-colors duration-200" data-icon="settings">settings</button>
<div class="w-8 h-8 rounded-full overflow-hidden border border-primary/20">
<img alt="User profile menu" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9KZno2p_Qo13jQQ_L-Ed9Zytuw4JSu6y3d5MKkwhADnhE-vhUYJciIHKlX7WP6bXNG37jbQXqOvKSq_v-8tz1nMkd9fj0v_E0SXqrv7HQjYuX8NY55RpaQA29v04Y2CXh8foo_otcZTnPwZsNYlAuRdHvJI0ttwqIsukWqL9UzIb_oiH_2TcNZarixK9r-in-XCJJ008j9KDCJxGV7L5Y2HmjWyixiKipLuJQkBRmjQBmcdJbPw-xsNmzEOYNv4Czdm3iJgFqkFm3">
</div>
</div>
</div>
</header>
<main class="max-w-container-max mx-auto px-gutter py-8">
<!-- Header Section -->
<div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
<div>
<h1 class="font-headline-lg text-headline-lg text-on-surface mb-2">Notifications Center</h1>
<p class="font-body-md text-body-md text-on-surface-variant max-w-2xl">Stay informed about activity across your knowledge contributions.</p>
</div>
<div class="flex flex-wrap items-center gap-4">
<div class="flex items-center gap-3 bg-surface-container-low border border-outline-variant px-4 py-2.5 rounded-lg">
<input class="w-4 h-4 rounded border-outline-variant bg-transparent text-primary focus:ring-primary/50" type="checkbox">
<div class="flex gap-2">
<button class="material-symbols-outlined text-on-surface-variant hover:text-primary text-[20px]" title="Mark Read">drafts</button>
<button class="material-symbols-outlined text-on-surface-variant hover:text-primary text-[20px]" title="Archive">archive</button>
<button class="material-symbols-outlined text-on-surface-variant hover:text-error text-[20px]" title="Delete">delete</button>
</div>
</div>
<button class="px-6 py-2.5 rounded-lg border border-outline-variant font-label-md text-label-md text-on-surface hover:bg-surface-container-high transition-colors">Mark All As Read</button>
<button class="px-6 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-label-md text-label-md hover:brightness-110 active:scale-95 transition-all">Notification Preferences</button>
</div>
</div>
<div class="flex flex-col lg:flex-row gap-8">
<!-- Left Side: Main Feed -->
<div class="flex-grow space-y-8">
<!-- IMPACT SUMMARY & QUICK ACTIONS -->
<div class="glass-card p-6 rounded-xl border border-white/5 flex flex-col md:flex-row gap-8">
<div class="flex-1">
<h4 class="font-label-md text-label-md text-primary mb-4 uppercase tracking-wider">Weekly Impact</h4>
<div class="grid grid-cols-2 gap-4">
<div>
<span class="text-headline-md font-bold block">128</span>
<span class="text-label-sm text-on-surface-variant">People Helped</span>
</div>
<div>
<span class="text-headline-md font-bold text-secondary-fixed-dim block">+340</span>
<span class="text-label-sm text-on-surface-variant">Reputation</span>
</div>
<div>
<span class="text-headline-md font-bold block">4</span>
<span class="text-label-sm text-on-surface-variant">FAQs Created</span>
</div>
<div>
<span class="text-headline-md font-bold block">8</span>
<span class="text-label-sm text-on-surface-variant">Discussions</span>
</div>
</div>
</div>
<div class="w-px bg-outline-variant hidden md:block"></div>
<div class="flex flex-col justify-center gap-3">
<h4 class="font-label-md text-label-md text-on-surface-variant mb-1 uppercase tracking-wider text-sm">Quick Actions</h4>
<div class="grid grid-cols-2 gap-2">
<button class="px-4 py-2 border border-outline-variant rounded-lg text-label-sm font-label-sm hover:bg-surface-container-high transition-colors text-left flex items-center gap-2"><span class="material-symbols-outlined text-sm">quiz</span> My Questions</button>
<button class="px-4 py-2 border border-outline-variant rounded-lg text-label-sm font-label-sm hover:bg-surface-container-high transition-colors text-left flex items-center gap-2"><span class="material-symbols-outlined text-sm">forum</span> My Discussions</button>
<button class="px-4 py-2 border border-outline-variant rounded-lg text-label-sm font-label-sm hover:bg-surface-container-high transition-colors text-left flex items-center gap-2"><span class="material-symbols-outlined text-sm">verified</span> My FAQs</button>
<button class="px-4 py-2 border border-outline-variant rounded-lg text-label-sm font-label-sm hover:bg-surface-container-high transition-colors text-left flex items-center gap-2"><span class="material-symbols-outlined text-sm">person</span> Profile</button>
</div>
</div>
</div>
<!-- Filter Bar -->
<div class="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
<button class="px-4 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md whitespace-nowrap">All <span class="ml-1 opacity-70">24</span></button>
<button class="px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant hover:border-primary/50 font-label-md text-label-md whitespace-nowrap transition-colors">Questions <span class="ml-1 opacity-50">3</span></button>
<button class="px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant hover:border-primary/50 font-label-md text-label-md whitespace-nowrap transition-colors">Answers <span class="ml-1 opacity-50">12</span></button>
<button class="px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant hover:border-primary/50 font-label-md text-label-md whitespace-nowrap transition-colors">Discussions <span class="ml-1 opacity-50">5</span></button>
<button class="px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant hover:border-primary/50 font-label-md text-label-md whitespace-nowrap transition-colors">FAQs <span class="ml-1 opacity-50">2</span></button>
<button class="px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant hover:border-primary/50 font-label-md text-label-md whitespace-nowrap transition-colors">Reputation <span class="ml-1 opacity-50">7</span></button>
</div>
<!-- Feed Grouped by Time -->
<div class="space-y-10">
<!-- Today -->
<section>
<div class="flex items-center gap-4 mb-4">
<span class="font-label-md text-label-md text-on-surface-variant whitespace-nowrap">Today</span>
<div class="h-px bg-outline-variant flex-grow"></div>
</div>
<div class="space-y-4">
<!-- High Priority Card -->
<div class="glass-card p-5 rounded-xl flex items-start gap-4 priority-high">
<div class="pt-1"><input class="w-4 h-4 rounded border-outline-variant bg-transparent text-primary focus:ring-primary/50" type="checkbox"></div>
<div class="w-10 h-10 rounded-full bg-secondary-container/10 flex items-center justify-center flex-shrink-0">
<span class="material-symbols-outlined text-secondary-fixed-dim" data-icon="verified">verified</span>
</div>
<div class="flex-grow">
<div class="flex justify-between items-start mb-1">
<h3 class="font-body-lg text-on-surface font-semibold">FAQ Published</h3><span class="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-secondary-container/20 text-secondary-fixed-dim border border-secondary-container/20">FAQ</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">15m ago</span>
</div>
<p class="font-body-md text-body-md text-on-surface-variant mb-4">Your contribution was approved and published as FAQ #402.</p>
<button class="font-label-sm text-label-sm text-primary flex items-center gap-1 hover:underline">
                                        View FAQ <span class="material-symbols-outlined text-[16px]" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
</div>
<!-- Medium Priority Card -->
<div class="glass-card p-5 rounded-xl flex items-start gap-4 priority-medium">
<div class="pt-1"><input class="w-4 h-4 rounded border-outline-variant bg-transparent text-primary focus:ring-primary/50" type="checkbox"></div>
<div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
<span class="material-symbols-outlined text-primary" data-icon="thumb_up">thumb_up</span>
</div>
<div class="flex-grow">
<div class="flex justify-between items-start mb-1">
<h3 class="font-body-lg text-on-surface font-semibold">Achievement Unlocked: Impact</h3><span class="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-primary-container/20 text-primary-fixed-dim border border-primary-container/20">BADGE</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">2h ago</span>
</div>
<p class="font-body-md text-body-md text-on-surface-variant mb-4">Your answer on 'LLM Fine-tuning' received 12 upvotes.</p>
<button class="font-label-sm text-label-sm text-primary flex items-center gap-1 hover:underline">
                                        View Answer <span class="material-symbols-outlined text-[16px]" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
</div>
</div>
</section>
<!-- Yesterday -->
<section>
<div class="flex items-center gap-4 mb-4">
<span class="font-label-md text-label-md text-on-surface-variant whitespace-nowrap">Yesterday</span>
<div class="h-px bg-outline-variant flex-grow"></div>
</div>
<div class="space-y-4">
<div class="glass-card p-5 rounded-xl flex items-start gap-4 priority-medium">
<div class="pt-1"><input class="w-4 h-4 rounded border-outline-variant bg-transparent text-primary focus:ring-primary/50" type="checkbox"></div>
<div class="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center flex-shrink-0">
<span class="material-symbols-outlined text-on-surface-variant" data-icon="chat_bubble">chat_bubble</span>
</div>
<div class="flex-grow">
<div class="flex justify-between items-start mb-1">
<h3 class="font-body-lg text-on-surface font-semibold">New Discussion Activity</h3><span class="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-tertiary-container/20 text-tertiary-fixed-dim border border-tertiary-container/20">DISCUSSION</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">1d ago</span>
</div>
<p class="font-body-md text-body-md text-on-surface-variant mb-4">Marcus and 4 others replied to your thread.</p>
<button class="font-label-sm text-label-sm text-primary flex items-center gap-1 hover:underline">
                                        Open Discussion <span class="material-symbols-outlined text-[16px]" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
</div>
</div>
</section>
<!-- This Week -->
<section>
<div class="flex items-center gap-4 mb-4">
<span class="font-label-md text-label-md text-on-surface-variant whitespace-nowrap">This Week</span>
<div class="h-px bg-outline-variant flex-grow"></div>
</div>
<div class="space-y-4">
<!-- Info Priority Card -->
<div class="glass-card p-5 rounded-xl flex items-start gap-4 priority-info">
<div class="pt-1"><input class="w-4 h-4 rounded border-outline-variant bg-transparent text-primary focus:ring-primary/50" type="checkbox"></div>
<div class="w-10 h-10 rounded-full bg-tertiary-container/10 flex items-center justify-center flex-shrink-0">
<span class="material-symbols-outlined text-tertiary-fixed-dim" data-icon="military_tech">military_tech</span>
</div>
<div class="flex-grow">
<div class="flex justify-between items-start mb-1">
<h3 class="font-body-lg text-on-surface font-semibold">Badge Earned</h3><span class="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-primary-container/20 text-primary-fixed-dim border border-primary-container/20">BADGE</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">3d ago</span>
</div>
<p class="font-body-md text-body-md text-on-surface-variant">You earned the Consensus Builder badge for 50+ validated answers.</p>
</div>
</div>
<div class="glass-card p-5 rounded-xl flex items-start gap-4 priority-info">
<div class="pt-1"><input class="w-4 h-4 rounded border-outline-variant bg-transparent text-primary focus:ring-primary/50" type="checkbox"></div>
<div class="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center flex-shrink-0">
<span class="material-symbols-outlined text-primary" data-icon="trending_up">trending_up</span>
</div>
<div class="flex-grow">
<div class="flex justify-between items-start mb-1">
<h3 class="font-body-lg text-on-surface font-semibold">Reputation Boost</h3><span class="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-tertiary-container/20 text-tertiary-fixed-dim border border-tertiary-container/20">REPUTATION</span>
<span class="font-label-sm text-label-sm text-on-surface-variant">5d ago</span>
</div>
<p class="font-body-md text-body-md text-on-surface-variant">Your reputation increased by +25 for an Accepted Answer.</p>
</div>
</div>
</div>
</section>
</div>
</div>
<!-- Right Sidebar -->
<aside class="w-full lg:w-80 space-y-6">
<!-- Summary Stats Cards Mini -->
<div class="grid grid-cols-2 gap-3">
<div class="glass-card p-4 rounded-xl border border-white/5">
<span class="text-[10px] font-label-sm text-on-surface-variant block mb-1 uppercase tracking-wider">Unread</span>
<div class="flex items-baseline gap-1">
<span class="text-headline-md font-display text-primary">8</span>
<span class="text-[9px] text-on-primary-container bg-primary-container/30 px-1 rounded font-bold">NEW</span>
</div>
</div>
<div class="glass-card p-4 rounded-xl border border-white/5">
<span class="text-[10px] font-label-sm text-on-surface-variant block mb-1 uppercase tracking-wider">Mentions</span>
<div class="text-headline-md font-display text-on-surface">2</div>
</div>
</div>
<!-- Section 1: Recent Reputation -->
<div class="glass-card p-6 rounded-xl border border-white/5">
<h4 class="font-label-md text-label-md text-on-surface mb-4 uppercase tracking-wider">Reputation Timeline</h4>
<div class="space-y-4">
<div class="flex items-center gap-3">
<div class="w-8 text-right font-label-sm text-label-sm text-primary">+50</div>
<div class="h-8 w-px bg-outline-variant"></div>
<div class="text-label-sm text-on-surface-variant">Peer Review</div>
</div>
<div class="flex items-center gap-3">
<div class="w-8 text-right font-label-sm text-label-sm text-primary">+25</div>
<div class="h-8 w-px bg-outline-variant"></div>
<div class="text-label-sm text-on-surface-variant">Accepted Answer</div>
</div>
</div>
</div>
<!-- Section 2: Recent Badges -->
<div class="glass-card p-6 rounded-xl border border-white/5">
<h4 class="font-label-md text-label-md text-on-surface mb-4 uppercase tracking-wider">Recent Badges</h4>
<div class="flex gap-4">
<div class="group relative">
<div class="w-12 h-12 rounded-lg bg-surface-container-high border border-primary/20 flex items-center justify-center hover:scale-110 transition-transform cursor-help">
<span class="material-symbols-outlined text-primary" data-icon="star" style="font-variation-settings: 'FILL' 1;">star</span>
</div>
</div>
<div class="group relative">
<div class="w-12 h-12 rounded-lg bg-surface-container-high border border-tertiary/20 flex items-center justify-center hover:scale-110 transition-transform cursor-help">
<span class="material-symbols-outlined text-tertiary" data-icon="rocket_launch">rocket_launch</span>
</div>
</div>
</div>
</div>
<!-- Section 3: Knowledge Summary -->
<div class="glass-card p-6 rounded-xl border border-white/5">
<h4 class="font-label-md text-label-md text-on-surface mb-4 uppercase tracking-wider">Activity Impact</h4>
<div class="space-y-4">
<div class="flex justify-between items-center">
<span class="font-label-sm text-label-sm text-on-surface-variant">Questions</span>
<span class="font-label-sm text-label-sm text-on-surface">14</span>
</div>
<div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
<div class="bg-primary h-full w-[40%]"></div>
</div>
<div class="flex justify-between items-center">
<span class="font-label-sm text-label-sm text-on-surface-variant">Answers</span>
<span class="font-label-sm text-label-sm text-on-surface">52</span>
</div>
<div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
<div class="bg-secondary-fixed-dim h-full w-[85%]"></div>
</div>
</div>
</div>
<!-- Section 4: Settings Preview -->
<div class="glass-card p-6 rounded-xl border border-white/5">
<h4 class="font-label-md text-label-md text-on-surface mb-4 uppercase tracking-wider">Global Settings</h4>
<div class="space-y-3">
<div class="flex items-center justify-between">
<span class="text-label-sm text-on-surface-variant">Email Notifications</span>
<div class="w-8 h-4 bg-primary/30 rounded-full relative">
<div class="absolute right-0.5 top-0.5 w-3 h-3 bg-primary rounded-full"></div>
</div>
</div>
<div class="flex items-center justify-between">
<span class="text-label-sm text-on-surface-variant">In-App Alerts</span>
<div class="w-8 h-4 bg-primary/30 rounded-full relative">
<div class="absolute right-0.5 top-0.5 w-3 h-3 bg-primary rounded-full"></div>
</div>
</div>
</div>
</div>
</aside>
</div>
</main>
<!-- Footer -->
<footer class="bg-surface-container-low border-t border-white/5 mt-section-gap py-8">
<div class="max-w-container-max mx-auto px-gutter flex flex-col md:flex-row justify-between items-center gap-4">
<div class="flex flex-col gap-2">
<span class="font-label-md font-bold text-on-surface text-label-md">CrowdMind AI</span>
<p class="font-label-sm text-label-sm text-on-surface-variant">© 2024 CrowdMind AI Platform. For researchers and knowledge workers.</p>
</div>
<div class="flex gap-6">
<a class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
<a class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
<a class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Security</a>
<a class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Status</a>
</div>
</div>
</footer>`
