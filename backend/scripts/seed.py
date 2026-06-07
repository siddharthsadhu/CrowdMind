"""Seed script for the CrowdMind demo data.

Run with: cd backend && uv run python -m scripts.seed

Drops & re-creates demo data for: users, categories, FAQs (published + candidates),
discussions, replies, questions, reports, notifications, votes, FAQ versions,
evolution events, achievements.

Uses the REAL Vicharanashala internship FAQ (139 entries across 14 sections)
as the primary FAQ library content.
"""
import asyncio
import uuid
from datetime import datetime, timedelta
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import async_session_factory
from app.models.user import User
from app.models.question import Category, Question
from app.models.discussion import Discussion, Reply, Vote
from app.models.faq import (
    FaqCandidate, PublishedFaq, FaqVersion, EvolutionEvent,
)
from app.models.moderation import Report
from app.models.notification import Notification
from app.models.reputation import Achievement
from app.models.collection import SavedKnowledge
from scripts.vicharanashala_faqs import VICHARANASHALA_FAQS


# -------- HELPERS --------

def uid() -> uuid.UUID:
    return uuid.uuid4()


def ago(days: int = 0, hours: int = 0) -> datetime:
    return datetime.utcnow() - timedelta(days=days, hours=hours)


def dicebear_avatar(name: str, style: str = "adventurer") -> str:
    """Generate a deterministic DiceBear avatar URL.

    Each user gets a unique generated avatar based on their name. No two
    users with different names share an avatar. URL is publicly accessible.
    """
    from urllib.parse import quote
    seed = quote(name, safe='')
    return f"https://api.dicebear.com/7.x/{style}/svg?seed={seed}&backgroundColor=b0c6ff,d2bbff,00dbe9,7df4ff,ffb4ab,ffd5dc,c0aede,d1d4f9"


# -------- USERS --------
# 30 historical/demo contributor records. They exist in the DB purely for
# data attribution (FAQs, discussions, replies, etc.) so the demo looks
# populated with realistic names, bios, reputation, and avatars.
#
# IMPORTANT: these are NOT real Clerk accounts. clerk_user_id is NULL for
# all of them. They cannot log in. Real users who sign up via Clerk get
# their own DB row auto-created with their real clerk_user_id on first
# sign-in (see app/core/dependencies.py get_current_user).
#
# To add a new admin (real person), sign up via /login, then set their
# role in Clerk dashboard (Users -> click user -> Metadata ->
# public_metadata: {"role": "admin"}), then have them sign out and back in.

USERS: list[dict[str, Any]] = [
    {
        "id": uid(),
        "clerk_user_id": None,
        "username": "admin",
        "email": "admin@crowdmind.dev",
        "full_name": "Dr. Elena Vasquez",
        "role": "admin",
        "reputation_score": 8420,
        "bio": "AI ethics researcher, PhD MIT. Lead moderator and content curator at Vicharanashala, IIT Ropar.",
        "avatar_url": dicebear_avatar("Dr. Elena Vasquez", "adventurer"),
    },
    {
        "id": uid(),
        "clerk_user_id": None,
        "username": "alex_rivera",
        "email": "alex.rivera@example.com",
        "full_name": "Alex Rivera",
        "role": "user",
        "reputation_score": 3120,
        "bio": "Senior ML engineer, Vicharanashala alumnus. Mentor for the Annam.AI track.",
        "avatar_url": dicebear_avatar("Alex Rivera", "adventurer"),
    },
    {
        "id": uid(),
        "clerk_user_id": None,
        "username": "maya_p",
        "email": "maya.patel@example.com",
        "full_name": "Maya Patel",
        "role": "user",
        "reputation_score": 2480,
        "bio": "Distributed systems and consensus protocols. Bronze and Silver badge holder.",
        "avatar_url": dicebear_avatar("Maya Patel", "adventurer"),
    },
    {
        "id": uid(),
        "clerk_user_id": None,
        "username": "jordan_l",
        "email": "jordan.lee@example.com",
        "full_name": "Jordan Lee",
        "role": "user",
        "reputation_score": 1820,
        "bio": "PhD student in computational neuroscience. Curious about cognitive architectures.",
        "avatar_url": dicebear_avatar("Jordan Lee", "adventurer"),
    },
    {
        "id": uid(),
        "clerk_user_id": None,
        "username": "ravi_s",
        "email": "ravi.singh@example.com",
        "full_name": "Ravi Singh",
        "role": "user",
        "reputation_score": 940,
        "bio": "Software architect focused on production ML systems and MERN stack.",
        "avatar_url": dicebear_avatar("Ravi Singh", "adventurer"),
    },
    {
        "id": uid(),
        "clerk_user_id": None,
        "username": "priya_n",
        "email": "priya.n@example.com",
        "full_name": "Priya Nair",
        "role": "user",
        "reputation_score": 760,
        "bio": "Vicharanashala intern, ViBe platform contributor. Loves documenting the learning process.",
        "avatar_url": dicebear_avatar("Priya Nair", "adventurer"),
    },
    {
        "id": uid(),
        "clerk_user_id": None,
        "username": "amaru_q",
        "email": "amaru.q@example.com",
        "full_name": "Amaru Quispe",
        "role": "user",
        "reputation_score": 510,
        "bio": "Computer vision intern, working on Annam.AI's plant disease detection model.",
        "avatar_url": dicebear_avatar("Amaru Quispe", "adventurer"),
    },
    {
        "id": uid(),
        "clerk_user_id": None,
        "username": "lina_chen",
        "email": "lina.chen@example.com",
        "full_name": "Lina Chen",
        "role": "user",
        "reputation_score": 285,
        "bio": "First-time Vicharanashala intern, excited to learn and contribute.",
        "avatar_url": dicebear_avatar("Lina Chen", "adventurer"),
    },
    {
        "id": uid(),
        "clerk_user_id": None,
        "username": "priya_admin",
        "email": "priya.sharma@crowdmind.dev",
        "full_name": "Priya Sharma",
        "role": "admin",
        "reputation_score": 6210,
        "bio": "ML platform lead at Vicharanashala. Curates the Spurti and Yaksha knowledge tracks.",
        "avatar_url": dicebear_avatar("Priya Sharma", "adventurer"),
    },
    {
        "id": uid(),
        "clerk_user_id": None,
        "username": "david_admin",
        "email": "david.okafor@crowdmind.dev",
        "full_name": "David Okafor",
        "role": "admin",
        "reputation_score": 5870,
        "bio": "Senior community moderator. Reviews candidates and resolves disputes on the platform.",
        "avatar_url": dicebear_avatar("David Okafor", "adventurer"),
    },
    {
        "id": uid(),
        "clerk_user_id": None,
        "username": "sara_m",
        "email": "sara.mitchell@example.com",
        "full_name": "Sara Mitchell",
        "role": "user",
        "reputation_score": 2240,
        "bio": "NLP researcher, PhD Stanford. Contributes to the Yaksha and ViBe knowledge corpora.",
        "avatar_url": dicebear_avatar("Sara Mitchell", "adventurer"),
    },
    {
        "id": uid(),
        "clerk_user_id": None,
        "username": "daniel_k",
        "email": "daniel.kim@example.com",
        "full_name": "Daniel Kim",
        "role": "user",
        "reputation_score": 1960,
        "bio": "Backend engineer with a focus on FastAPI and async Python. Active on the Rosetta track.",
        "avatar_url": dicebear_avatar("Daniel Kim", "adventurer"),
    },
    {
        "id": uid(),
        "clerk_user_id": None,
        "username": "ananya_i",
        "email": "ananya.iyer@example.com",
        "full_name": "Ananya Iyer",
        "role": "user",
        "reputation_score": 1810,
        "bio": "ML intern passionate about knowledge graphs and structured reasoning systems.",
        "avatar_url": dicebear_avatar("Ananya Iyer", "adventurer"),
    },
    {
        "id": uid(),
        "clerk_user_id": None,
        "username": "james_w",
        "email": "james.wright@example.com",
        "full_name": "James Wright",
        "role": "user",
        "reputation_score": 1640,
        "bio": "Full-stack developer and Vicharanashala alumnus. Builds tooling for the Annam.AI team.",
        "avatar_url": dicebear_avatar("James Wright", "adventurer"),
    },
    {
        "id": uid(),
        "clerk_user_id": None,
        "username": "aisha_r",
        "email": "aisha.rahman@example.com",
        "full_name": "Aisha Rahman",
        "role": "user",
        "reputation_score": 1420,
        "bio": "Data scientist focusing on fairness in AI. Documents best practices in the library.",
        "avatar_url": dicebear_avatar("Aisha Rahman", "adventurer"),
    },
    {
        "id": uid(),
        "clerk_user_id": None,
        "username": "mateo_s",
        "email": "mateo.silva@example.com",
        "full_name": "Mateo Silva",
        "role": "user",
        "reputation_score": 1290,
        "bio": "Computer vision engineer working on Annam.AI's plant disease detection pipeline.",
        "avatar_url": dicebear_avatar("Mateo Silva", "adventurer"),
    },
    {
        "id": uid(),
        "clerk_user_id": None,
        "username": "yuki_t",
        "email": "yuki.tanaka@example.com",
        "full_name": "Yuki Tanaka",
        "role": "user",
        "reputation_score": 1180,
        "bio": "Robotics and reinforcement learning. Active contributor to the Spurti knowledge track.",
        "avatar_url": dicebear_avatar("Yuki Tanaka", "adventurer"),
    },
    {
        "id": uid(),
        "clerk_user_id": None,
        "username": "fatima_a",
        "email": "fatima.ali@example.com",
        "full_name": "Fatima Ali",
        "role": "user",
        "reputation_score": 1080,
        "bio": "Frontend engineer and Vicharanashala intern. Loves clean UI patterns and accessibility.",
        "avatar_url": dicebear_avatar("Fatima Ali", "adventurer"),
    },
    {
        "id": uid(),
        "clerk_user_id": None,
        "username": "noah_c",
        "email": "noah.collins@example.com",
        "full_name": "Noah Collins",
        "role": "user",
        "reputation_score": 970,
        "bio": "DevOps engineer with experience in Kubernetes and CI/CD. Helps maintain the platform.",
        "avatar_url": dicebear_avatar("Noah Collins", "adventurer"),
    },
    {
        "id": uid(),
        "clerk_user_id": None,
        "username": "zara_h",
        "email": "zara.hassan@example.com",
        "full_name": "Zara Hassan",
        "role": "user",
        "reputation_score": 880,
        "bio": "Cognitive science researcher, exploring the intersection of AI and human reasoning.",
        "avatar_url": dicebear_avatar("Zara Hassan", "adventurer"),
    },
    {
        "id": uid(),
        "clerk_user_id": None,
        "username": "hiroshi_y",
        "email": "hiroshi.yamada@example.com",
        "full_name": "Hiroshi Yamada",
        "role": "user",
        "reputation_score": 820,
        "bio": "ML systems engineer focused on inference optimization and low-latency serving.",
        "avatar_url": dicebear_avatar("Hiroshi Yamada", "adventurer"),
    },
    {
        "id": uid(),
        "clerk_user_id": None,
        "username": "olivia_b",
        "email": "olivia.brown@example.com",
        "full_name": "Olivia Brown",
        "role": "user",
        "reputation_score": 740,
        "bio": "Product designer and researcher. Helps shape the CrowdMind user experience.",
        "avatar_url": dicebear_avatar("Olivia Brown", "adventurer"),
    },
    {
        "id": uid(),
        "clerk_user_id": None,
        "username": "kunal_k",
        "email": "kunal.kapoor@example.com",
        "full_name": "Kunal Kapoor",
        "role": "user",
        "reputation_score": 690,
        "bio": "IIT Ropar alumnus, now a research engineer. Frequent contributor to the Yaksha track.",
        "avatar_url": dicebear_avatar("Kunal Kapoor", "adventurer"),
    },
    {
        "id": uid(),
        "clerk_user_id": None,
        "username": "mei_li",
        "email": "mei.li@example.com",
        "full_name": "Mei Li",
        "role": "user",
        "reputation_score": 640,
        "bio": "Quantitative researcher with a focus on probabilistic programming and inference.",
        "avatar_url": dicebear_avatar("Mei Li", "adventurer"),
    },
    {
        "id": uid(),
        "clerk_user_id": None,
        "username": "tomas_m",
        "email": "tomas.morales@example.com",
        "full_name": "Tomas Morales",
        "role": "user",
        "reputation_score": 580,
        "bio": "Software engineer passionate about open source and reproducible research.",
        "avatar_url": dicebear_avatar("Tomas Morales", "adventurer"),
    },
    {
        "id": uid(),
        "clerk_user_id": None,
        "username": "amara_o",
        "email": "amara.osei@example.com",
        "full_name": "Amara Osei",
        "role": "user",
        "reputation_score": 520,
        "bio": "ML intern and Vicharanashala contributor. Building tools for the Annam.AI team.",
        "avatar_url": dicebear_avatar("Amara Osei", "adventurer"),
    },
    {
        "id": uid(),
        "clerk_user_id": None,
        "username": "liam_oc",
        "email": "liam.oconnor@example.com",
        "full_name": "Liam O'Connor",
        "role": "user",
        "reputation_score": 480,
        "bio": "Research engineer focused on agentic systems and tool-using language models.",
        "avatar_url": dicebear_avatar("Liam O'Connor", "adventurer"),
    },
    {
        "id": uid(),
        "clerk_user_id": None,
        "username": "ines_f",
        "email": "ines.fernandes@example.com",
        "full_name": "Ines Fernandes",
        "role": "user",
        "reputation_score": 410,
        "bio": "Data engineer and Vicharanashala intern. Building the ViBe content pipeline.",
        "avatar_url": dicebear_avatar("Ines Fernandes", "adventurer"),
    },
    {
        "id": uid(),
        "clerk_user_id": None,
        "username": "rajiv_m",
        "email": "rajiv.menon@example.com",
        "full_name": "Rajiv Menon",
        "role": "user",
        "reputation_score": 360,
        "bio": "First-year Vicharanashala intern, exploring knowledge validation and consensus.",
        "avatar_url": dicebear_avatar("Rajiv Menon", "adventurer"),
    },
    {
        "id": uid(),
        "clerk_user_id": None,
        "username": "sofia_p",
        "email": "sofia.petrova@example.com",
        "full_name": "Sofia Petrova",
        "role": "user",
        "reputation_score": 295,
        "bio": "New Vicharanashala intern, excited to learn and contribute to the community.",
        "avatar_url": dicebear_avatar("Sofia Petrova", "adventurer"),
    },
]


# -------- CATEGORIES --------
# 14 categories matching the 14 Vicharanashala FAQ sections + 2 general
# categories (General, Resources) to give the library extra structure.

CATEGORIES: list[tuple[str, str, str]] = [
    ("About the internship", "about-internship", "Overview, VINS, phases, eligibility, leave policy"),
    ("Timing and dates", "timing", "Start dates, duration, leaves, orientation recordings"),
    ("NOC (No Objection Certificate)", "noc", "NOC formats, signatures, submission, verification"),
    ("Selection, offer letter, and certificate", "selection-offer", "Selection, opting in, offer letter, certificate"),
    ("Work, mentorship, and projects", "work-mentorship", "Projects, hours, mentors, stipend, laptop"),
    ("Code of conduct", "code-of-conduct", "Official communication channels, prohibited groups"),
    ("Interviews", "interviews", "Interview completion, status sync"),
    ("Certificate", "certificate", "Certificate, e-certificate, university credit"),
    ("Rosetta journal", "rosetta", "Daily 65-day journal, thinking routines, submission"),
    ("Phase 1 coursework", "phase-1", "Vibe LMS, live sessions, attendance, exemptions"),
    ("Spurti Points", "spurti-points", "Engagement points, participation thresholds"),
    ("Yaksha Chat", "yaksha-chat", "Chat with Yaksha, the AI assistant"),
    ("ViBe Platform", "vibe-platform", "Vicharanashala ViBe learning platform"),
    ("Team Formation", "team-formation", "Team size, formation rules, conflicts"),
    ("General", "general", "General knowledge, other topics"),
    ("Resources", "resources", "External resources, references, links"),
]


# -------- FAQ CANDIDATES --------
# Drafts in the moderation queue, awaiting review.

FAQ_CANDIDATES: list[dict[str, Any]] = [
    {
        "title": "How do I switch from one project track to another mid-internship?",
        "content": "Project track switches are not generally supported mid-internship, but in genuine cases (mentor unavailable, project deprioritised, strong case for fit) you can raise a request via Yaksha with the #escalate tag. Each request is reviewed by the programme team. There is no guaranteed turnaround, and approval is not automatic.",
        "confidence": 62.0,
        "status": "PENDING",
    },
    {
        "title": "What happens to my ViBe progress if my account email changes?",
        "content": "Progress is tied to the registered email, not to a name. If you need to change the email on file, raise a #vibe-email request in Yaksha chat. The team can migrate progress to the new email after verifying ownership. Expect 1-2 working days for the migration to complete.",
        "confidence": 71.0,
        "status": "PENDING",
    },
    {
        "title": "Can I publish a personal blog post about my Vicharanashala experience?",
        "content": "Yes, with one condition: do not disclose any internal cohort information, mentor names, or unreleased programme details. Public posts about the experience, the project, the platform, and what you learned are welcome. Posts that name other interns without their consent, or that share internal-only dashboards or communications, are not.",
        "confidence": 84.0,
        "status": "APPROVED",
    },
    {
        "title": "Are there any scholarships or fee waivers for the programme?",
        "content": "VINS is entirely free. There is no fee, and therefore no scholarships or waivers. The programme is supported by IIT Ropar's Vicharanashala Lab for Education Design. If you have paid anyone in connection with getting selected, please write to sudarshansudarshan@gmail.com — these are not affiliated with us.",
        "confidence": 90.0,
        "status": "APPROVED",
    },
    {
        "title": "What is the policy on using AI coding assistants (Copilot, Cursor, Claude) during the internship?",
        "content": "AI coding assistants are welcome for the technical work — that is part of modern engineering. The one firm exception is Rosetta (your internship journal): AI-generated entries are explicitly prohibited and will be rejected. The same applies to evaluation forms, reflection prompts, and any artefact where the requirement is your own thinking rather than the output.",
        "confidence": 88.0,
        "status": "APPROVED",
    },
    {
        "title": "How do I dispute a participation flag on the dashboard?",
        "content": "If a session is flagged as missed and you were actually present, raise a #escalate in Yaksha with the date and a screenshot of the Zoom attendance report. The team reviews and corrects the flag within 24-48 hours. Note: this only works for sessions that were joined with the correct registered email; mismatched Zoom emails cannot be retroactively credited.",
        "confidence": 79.0,
        "status": "PENDING",
    },
]


# -------- DISCUSSIONS --------
# 12 discussions across the topics interns actually argue about.

DISCUSSIONS: list[dict[str, Any]] = [
    {
        "title": "Tips for surviving the first week of the Bronze phase?",
        "description": "I just got my dashboard access and I'm a bit overwhelmed. The ViBe platform, the daily standups, the Yaksha chat, the Rosetta journal — there's a lot to set up. What did you wish someone told you in week 1? What setup mistakes should I avoid?",
        "status": "ACTIVE",
        "view_count": 1240,
        "consensus_score": 0.81,
    },
    {
        "title": "Best way to balance Vibe coursework with actual project work?",
        "description": "I'm finding the daily 3.33% target on ViBe hard to sustain when I'm also doing meaningful project work. Anyone figured out a good rhythm? Do you batch Vibe into chunks or spread it across the day?",
        "status": "ACTIVE",
        "view_count": 890,
        "consensus_score": 0.72,
    },
    {
        "title": "How strict is the 'no WhatsApp' rule really?",
        "description": "I've been added to a couple of team-coordination WhatsApp groups even though §6.1 says no. Are people actually getting caught? What happens if a mentor reports it? Looking for honest takes before I decide whether to stay in the groups.",
        "status": "ACTIVE",
        "view_count": 2150,
        "consensus_score": 0.58,
    },
    {
        "title": "Has anyone's NOC verification actually taken the full working day?",
        "description": "I uploaded mine 18 hours ago and still no offer letter. The FAQ says 1 hour to 1 working day. Reassure me that this is normal and not a sign that something went wrong with the upload.",
        "status": "RESOLVED",
        "view_count": 567,
        "consensus_score": 0.93,
    },
    {
        "title": "Can I write Rosetta entries in my native language?",
        "description": "I think in Hindi/Tamil much faster than English. Will the programme accept Rosetta entries that are partly or fully in my native language, or is English mandatory?",
        "status": "ACTIVE",
        "view_count": 410,
        "consensus_score": 0.65,
    },
    {
        "title": "What's the actual time commitment per day for Silver?",
        "description": "The FAQ says 6-10 hours, but is that realistic? I'm a first-year student and I have college classes. Honest answer please, not the marketing version.",
        "status": "ACTIVE",
        "view_count": 1580,
        "consensus_score": 0.77,
    },
    {
        "title": "Anyone else getting hit by the ViBe camera-proctoring false positives?",
        "description": "I sit in a well-lit room, single face in frame, but ViBe keeps pausing my video saying 'low light detected' or 'no face in frame.' My webcam log says everything is fine. Is there a known workaround beyond the troubleshooting steps in §13.21?",
        "status": "ACTIVE",
        "view_count": 980,
        "consensus_score": 0.69,
    },
    {
        "title": "Discussion: pros and cons of being randomly assigned to a team",
        "description": "I formed my own team during the May 15/16 activity, but I have friends who got randomly assigned. They say random assignment is actually better because you meet more diverse people. Curious what the late-cohort experience is like.",
        "status": "RESOLVED",
        "view_count": 720,
        "consensus_score": 0.85,
    },
    {
        "title": "How to handle mentor unresponsiveness without burning the relationship?",
        "description": "It's been 4 days since I last heard from my assigned mentor. I don't want to escalate, but the Silver phase deadline is approaching. What's a polite, professional way to ask for a sync without sounding demanding?",
        "status": "ACTIVE",
        "view_count": 645,
        "consensus_score": 0.74,
    },
    {
        "title": "Should I link my GitHub commits to my portfolio now or wait until Silver ends?",
        "description": "Some of my Gold-track work is genuinely portfolio-worthy. Tempted to make my repos public and add them to my LinkedIn. But the cohort hasn't ended yet, and I don't want to leak anything internal.",
        "status": "ACTIVE",
        "view_count": 380,
        "consensus_score": 0.71,
    },
    {
        "title": "Reading list for serious Vicharanashala applicants?",
        "description": "If you got selected, what would you recommend reading before you start? Not interview prep — I mean readings that would help me make the most of the programme: open-source culture, technical writing, project management for small teams, that kind of thing.",
        "status": "ACTIVE",
        "view_count": 1130,
        "consensus_score": 0.79,
    },
    {
        "title": "What does the Vicharanashala certificate actually look like?",
        "description": "Future employer here considering how to weight the Vicharanashala certificate on a CV. For those who've completed the programme — what does the e-certificate look like, what does it say, and how is it verifiable?",
        "status": "RESOLVED",
        "view_count": 490,
        "consensus_score": 0.88,
    },
]


# -------- REPLIES --------
# Format: (disc_idx, user_idx, content, days_ago, is_accepted, upvotes, downvotes)

REPLIES: list[tuple[int, int, str, int, bool, int, int]] = [
    # Discussion 0: Tips for week 1
    (0, 0, "First thing: do not optimise anything in week 1. The platform is opinionated, and most 'productivity hacks' I tried broke things. Get the Vibe login, accept the course invite, set your Zoom ID, and start Day 1 of Rosetta. That's it. Resist the urge to plan your whole 65 days on Day 1.", 2, True, 89, 1),
    (0, 1, "Set up the study corner before you log into ViBe for the first time. The most common avoidable mistake is sitting with a window behind you — your camera sees a silhouette, ViBe pauses everything, and you spend 30 minutes debugging lighting before you watch a single clip. Get the light, then start.", 2, False, 67, 0),
    (0, 2, "One thing I wish I had done: skim the entire FAQ in week 1. The Bronze FAQ is ~50 questions and answers 90% of the questions you would otherwise ask in Yaksha. Saves a lot of chat round-trips.", 1, False, 41, 3),
    (0, 3, "Daily standups at 10am are the single highest-leverage thing in week 1. Even if you have nothing to report, show up and listen. Mentors drop context in standup that doesn't make it into the FAQ.", 1, False, 35, 1),

    # Discussion 1: ViBe + project balance
    (1, 1, "Batch, don't spread. I tried to do 30 minutes of ViBe between project work and it killed my focus. Now I do 1.5 hours of ViBe first thing in the morning, then project work until evening. My 3.33% target gets hit by 11am and the rest of the day is uninterrupted.", 4, True, 78, 0),
    (1, 4, "Don't chase 3.33% every day. Some days you'll do 5%, some days 2%. The rolling 5-day window means consistency matters more than daily hit rate. Two days at 1% can be okay if the rest of the window is on target.", 3, False, 52, 2),
    (1, 0, "Use the Vibe linear progression to your advantage. Once you're on a streak of cleared quizzes, the next item unlocks quickly. Don't try to jump ahead — the Access Restricted banner will kick you back and break your rhythm.", 3, False, 31, 5),

    # Discussion 2: WhatsApp rule
    (2, 0, "The rule is real. I reported a group last year (4 interns from different teams, sharing notes). All four were terminated within a week. The admin is not bluffing. The §6.1 reading is strict: any peer-coordinated space is a violation, regardless of size.", 5, True, 156, 8),
    (2, 3, "Use LinkedIn. That is the explicit allowed channel. Yes, it's slower than WhatsApp. Yes, you can DM one person at a time. That's the point. The 5-person WhatsApp group is doing exactly what the rule says it shouldn't: bypassing the official channels.", 4, False, 94, 11),
    (2, 5, "Counter-take: this rule is overkill and it actively hurts teams. I have a 4-person Silver project, no WhatsApp, only LinkedIn DMs, and coordinating release dates is a nightmare. But I understand the policy rationale, so I'm not going to push back — just flagging that there's a real coordination cost.", 3, False, 38, 22),

    # Discussion 3: NOC verification
    (3, 0, "Yes, my NOC took 14 hours. It was the long end of the 1-hour-to-1-working-day window, but it cleared and the offer letter came through 30 minutes later. If you uploaded 18 hours ago, you're still in the window. Don't panic yet.", 6, True, 64, 0),

    # Discussion 4: Rosetta in native language
    (4, 0, "Yes, the programme accepts Rosetta entries in your native language. The journal is for you, not for the programme. The team reviews entries for completeness and honesty, not for English fluency. Write in whatever language makes the reflection genuine.", 8, True, 47, 1),
    (4, 1, "Confirmed — I have written 40% of my entries in Hindi, the rest in English. Both are equally valid. The one thing that does not change: AI-generated entries are not accepted, regardless of language.", 7, False, 22, 0),

    # Discussion 5: Hours per day for Silver
    (5, 0, "Honest answer: 6-10 hours is accurate, with caveats. The first 2 weeks of Silver feel like 12 hours because there's so much context to absorb. The middle 4 weeks settle into 7-8 hours. The last 2 weeks spike back to 10+ as you push to finish. Plan for the spike — it is not optional.", 3, True, 112, 2),
    (5, 2, "First-year students in Silver is normal — I was one. The trick is to be honest with your college from Day 1 about the time commitment. The FAQ §9.14 is right: this is not a self-paced programme. If you try to half-attend, you will be moved to a later batch per §10.7.", 2, False, 67, 5),

    # Discussion 6: ViBe false positives
    (6, 1, "I had this for the first week. Fix: disable auto-brightness on your laptop, set screen brightness to ~60%, and put a desk lamp directly in front of you (not behind). Camera logs in DevTools are not the same as the proctoring model. The proctoring model is conservative; trust the troubleshooting in §13.21.", 4, True, 89, 0),
    (6, 4, "If it's still failing after the lighting fix, raise #escalate-ViBe in Yaksha. The team can pull the camera frames from your session and tell you what the model is seeing. They did it for me — turned out my webcam was applying a 'beauty' filter that the proctoring model read as low-contrast face.", 3, False, 41, 1),

    # Discussion 7: Random team assignment
    (7, 2, "Random assignment is better for at least one reason: no awkward 'I want to switch teams' conversations later. If you don't know your teammates, you also don't have pre-existing friend dynamics to manage. The §14.21 'no team switches' rule is much easier to follow when you have no emotional ties.", 5, True, 58, 0),

    # Discussion 8: Mentor unresponsiveness
    (8, 0, "Send one short, factual message: 'Hi [mentor name], checking in — I am on track for the [deliverable] due [date]. Is there a good 20-min slot this week for a quick sync? Happy to work around your schedule.' If you don't hear back in 48 hours, escalate via Yaksha. Polite, professional, paper trail.", 6, True, 73, 0),
    (8, 3, "Don't apologise for following up. Mentors at Vicharanashala have multiple interns; sometimes you slip their mind. The second message is not a 'bother,' it is giving them the cue to prioritise you. Escalating after 2 unanswered follow-ups is the right move, not an overreaction.", 5, False, 38, 2),

    # Discussion 9: GitHub public
    (9, 1, "Make the repo public the moment your contribution is merged, not before. Until merge, the work is internal — keep the repo private. Once it's part of the public Vicharanashala codebase, the commits are part of the open-source history and there is nothing internal to leak.", 5, True, 51, 0),

    # Discussion 10: Reading list
    (10, 0, "Three books I recommend: 'The Mythical Man-Month' (Brooks) for project dynamics, 'A Philosophy of Software Design' (Ousterhout) for design judgement, and 'Working in Public' (Eghbal) for open-source culture. All available free online. Read the first one before Silver starts — the other two are mid-Silver reading.", 4, True, 92, 1),

    # Discussion 11: Certificate look
    (11, 0, "I have the Silver certificate. It's a single-page PDF, Vicharanashala letterhead, your name, the cohort year, and a verification number at the bottom. No mention of online vs offline (consistent with §8.2). The number links to a verification page on the Vicharanashala site.", 8, True, 35, 0),
]


# -------- QUESTIONS --------
# Pending question queue — questions interns have asked but not yet been
# promoted to FAQs. The admin queue will turn these into FAQ candidates.

QUESTIONS: list[dict[str, Any]] = [
    {
        "title": "What is the maximum number of days I can take off for personal reasons?",
        "description": "Family wedding in the middle of my Silver phase. The §2.5 answer says no leave, but what about emergency leave?",
        "category": "timing",
        "status": "ANALYZED",
        "ai_status": "COMPLETED",
    },
    {
        "title": "How do I claim the Spurti Points I've already earned?",
        "description": "My SP shows -3 today even though I attended all live sessions this week. Is there a way to dispute the balance?",
        "category": "spurti-points",
        "status": "OPEN",
        "ai_status": "PENDING",
    },
    {
        "title": "Can I use my college's NOC format from a previous internship?",
        "description": "I did a summer internship last year and have a NOC from my HOD. Can I reuse the same signed copy, or do I need a fresh NOC?",
        "category": "noc",
        "status": "ANALYZED",
        "ai_status": "COMPLETED",
    },
    {
        "title": "What is the rule on contributing to open-source projects outside the assigned one?",
        "description": "I want to also help fix a bug in a small OSS library I depend on. Allowed? Counts towards Silver evaluation?",
        "category": "work-mentorship",
        "status": "OPEN",
        "ai_status": "PENDING",
    },
    {
        "title": "Are there any perks for high Spurti Points above and beyond the recognition?",
        "description": "The §11.6 answer is vague. Are the 'small perks' tangible (swag, certificates, priority projects) or purely symbolic?",
        "category": "spurti-points",
        "status": "OPEN",
        "ai_status": "PENDING",
    },
    {
        "title": "Can my mentor write me a letter of recommendation beyond the certificate?",
        "description": "The §8.1 answer mentions LoR 'if earned.' What is the threshold? Is it automatic for Gold/Platinum interns?",
        "category": "certificate",
        "status": "ANALYZED",
        "ai_status": "COMPLETED",
    },
    {
        "title": "What if my team is dissolved and reformed without my consent?",
        "description": "The §14.25 says teams are locked. What happens if the admin reassigns me to a different team without my agreement?",
        "category": "team-formation",
        "status": "OPEN",
        "ai_status": "PENDING",
    },
    {
        "title": "Is there a way to bulk-export my ViBe progress for my own records?",
        "description": "I'd like a local copy of every quiz I cleared and every video I watched. The dashboard only shows summaries.",
        "category": "vibe-platform",
        "status": "ANALYZED",
        "ai_status": "COMPLETED",
    },
]


# -------- REPORTS --------
# Reports in the moderation queue for the admin to act on.

REPORTS: list[dict[str, Any]] = [
    {
        "reporter_idx": 2,
        "target_type": "faq",
        "target_idx": 0,
        "reason": "Outdated information",
        "description": "This FAQ references a 2025 deadline for the self-declaration path, but the policy was retired on 2026-05-27. Please update.",
        "severity": "LOW",
        "status": "OPEN",
    },
    {
        "reporter_idx": 3,
        "target_type": "discussion",
        "target_idx": 2,
        "reason": "Off-topic / personal attack",
        "description": "Thread has devolved into personal attacks against another intern. Several messages are reported under §6.1. Please moderate.",
        "severity": "MEDIUM",
        "status": "OPEN",
    },
    {
        "reporter_idx": 4,
        "target_type": "reply",
        "target_idx": 0,
        "reason": "Spam / self-promotion",
        "description": "Reply contains a link to the user's paid bootcamp. Section 6.1 prohibits peer-coordinated promotion.",
        "severity": "HIGH",
        "status": "OPEN",
    },
    {
        "reporter_idx": 5,
        "target_type": "user",
        "target_idx": 4,
        "reason": "WhatsApp group coordination",
        "description": "User is operating a 6-person WhatsApp group explicitly labelled for Vicharanashala interns. Screenshot attached.",
        "severity": "HIGH",
        "status": "INVESTIGATING",
    },
    {
        "reporter_idx": 0,
        "target_type": "faq",
        "target_idx": 3,
        "reason": "Typo / minor inaccuracy",
        "description": "The 'Dec 31' date is mentioned in the body as '31 Dec 2025' in one place. Should be 2026.",
        "severity": "LOW",
        "status": "RESOLVED",
    },
    {
        "reporter_idx": 1,
        "target_type": "discussion",
        "target_idx": 5,
        "reason": "Duplicate thread",
        "description": "This is essentially the same question as Discussion 9. Please merge or close.",
        "severity": "LOW",
        "status": "DISMISSED",
    },
]


# -------- NOTIFICATIONS --------
# Mix of read / unread / archived for the test user (idx 1 = Alex).

NOTIFICATIONS: list[dict[str, Any]] = [
    {"user_idx": 1, "type": "faq", "title": "Your question was answered",
     "message": "A new FAQ was published: 'How do I log in to ViBe?' based on a similar question you asked.", "read": False, "archived": False, "days": 0},
    {"user_idx": 1, "type": "discussion", "title": "New reply on your discussion",
     "message": "Maya Patel replied to 'Tips for surviving the first week of the Bronze phase?'", "read": False, "archived": False, "days": 0},
    {"user_idx": 1, "type": "reply", "title": "Your reply was accepted",
     "message": "Elena Vasquez marked your reply as the accepted solution on 'Best way to balance Vibe coursework.'", "read": True, "archived": False, "days": 1},
    {"user_idx": 1, "type": "reputation", "title": "+75 reputation",
     "message": "You earned 75 reputation for your accepted answer on the Vibe balance discussion.", "read": True, "archived": False, "days": 1},
    {"user_idx": 1, "type": "badge", "title": "New badge earned: Curious Mind",
     "message": "You asked 10 questions this month. Keep exploring!", "read": False, "archived": False, "days": 2},
    {"user_idx": 1, "type": "faq", "title": "FAQ you follow was updated",
     "message": "'What is the Vicharanashala internship?' got a new version (v2).", "read": True, "archived": False, "days": 3},
    {"user_idx": 1, "type": "discussion", "title": "Discussion escalated to AI",
     "message": "Your discussion 'How strict is the no WhatsApp rule' has been escalated for AI-assisted moderation review.", "read": False, "archived": False, "days": 0},
    {"user_idx": 1, "type": "reputation", "title": "Top contributor this week",
     "message": "You're in the top 5% of contributors this week. Keep it up!", "read": False, "archived": False, "days": 0},
    {"user_idx": 1, "type": "system", "title": "Welcome to the Vicharanashala cohort",
     "message": "Your cohort officially begins. Day 1 steps are waiting on your dashboard.", "read": True, "archived": True, "days": 14},
    {"user_idx": 1, "type": "system", "title": "ViBe platform access granted",
     "message": "You can now log in to ViBe using your registered email. Accept the course invite to begin.", "read": True, "archived": True, "days": 10},
    {"user_idx": 1, "type": "faq", "title": "Section updated: Code of conduct",
     "message": "The Code of conduct section was updated with new clarifications on peer-coordinated spaces.", "read": True, "archived": False, "days": 5},
    {"user_idx": 1, "type": "discussion", "title": "You were mentioned in a discussion",
     "message": "Priya Nair mentioned you in 'Reading list for serious Vicharanashala applicants?'", "read": False, "archived": False, "days": 0},
    # Add some for other users so admin views can see them
    {"user_idx": 0, "type": "moderation", "title": "3 new reports in the queue",
     "message": "Three new reports are awaiting moderation review.", "read": False, "archived": False, "days": 0},
    {"user_idx": 0, "type": "faq", "title": "5 new FAQ candidates pending review",
     "message": "Five draft FAQs are waiting for your review in the candidate queue.", "read": False, "archived": False, "days": 0},
]


# -------- ACHIEVEMENTS --------

ACHIEVEMENTS: list[dict[str, str]] = [
    {"name": "First Question", "description": "Asked your first question", "icon": "help"},
    {"name": "Curious Mind", "description": "Asked 10 questions", "icon": "psychology"},
    {"name": "Helpful Answer", "description": "Provided an accepted answer", "icon": "check_circle"},
    {"name": "Discussion Starter", "description": "Started 5 discussions", "icon": "forum"},
    {"name": "FAQ Contributor", "description": "Contributed to a published FAQ", "icon": "library_books"},
    {"name": "Bronze Phase Complete", "description": "Completed the Bronze training phase", "icon": "military_tech"},
    {"name": "Silver Phase Complete", "description": "Completed the Silver project phase", "icon": "workspace_premium"},
    {"name": "Gold Recognition", "description": "Earned Gold for a meaningful contribution", "icon": "emoji_events"},
    {"name": "Verified Expert", "description": "Domain expertise verified by admins", "icon": "verified"},
    {"name": "Early Adopter", "description": "Joined Vicharanashala in the first month", "icon": "stars"},
    {"name": "Rosetta Complete", "description": "Submitted a complete Rosetta journal", "icon": "menu_book"},
    {"name": "Top 1% Contributor", "description": "Top 1% of contributors this month", "icon": "trending_up"},
]


# -------- MAIN SEED --------

async def clear_all(session: AsyncSession):
    """Clear all data tables for a fresh seed (idempotent reseed)."""
    tables_in_order = [
        "saved_knowledge",
        "collection_items",
        "collections",
        "moderation_audit_logs",
        "investigation_notes",
        "moderation_actions",
        "reports",
        "notifications",
        "user_achievements",
        "achievements",
        "evolution_events",
        "faq_versions",
        "faq_sources",
        "faq_contributors",
        "published_faqs",
        "faq_candidates",
        "votes",
        "consensus_signals",
        "replies",
        "discussions",
        "questions",
        "categories",
        "user_profiles",
        "users",
    ]
    from sqlalchemy import text
    for table in tables_in_order:
        await session.execute(text(f"DELETE FROM {table}"))
    await session.commit()


async def seed():
    async with async_session_factory() as session:
        existing = await session.execute(select(User).limit(1))
        if existing.scalars().first():
            print("Database already seeded. Skipping (delete rows first to reseed).")
            return

        print("[*] Seeding CrowdMind demo data with REAL Vicharanashala FAQ content...")
        await clear_all(session)

        # ---- USERS ----
        print(f"   users ({len(USERS)})")
        for u in USERS:
            session.add(User(**u))
        await session.flush()
        user_ids = [u["id"] for u in USERS]
        admin = user_ids[0]
        alex = user_ids[1]
        maya = user_ids[2]
        jordan = user_ids[3]
        ravi = user_ids[4]
        priya = user_ids[5]
        amaru = user_ids[6]
        lina = user_ids[7]

        # ---- CATEGORIES ----
        print(f"   categories ({len(CATEGORIES)})")
        cat_map: dict[str, Any] = {}
        for name, slug, desc in CATEGORIES:
            c = Category(id=uuid.uuid4(), name=name, slug=slug, description=desc)
            cat_map[slug] = c
            session.add(c)
        await session.flush()

        # ---- PUBLISHED FAQs from VICHARANASHALA_FAQS ----
        print(f"   published FAQs from Vicharanashala source ({len(VICHARANASHALA_FAQS)} entries)")
        published_ids: list[uuid.UUID] = []
        for i, faq in enumerate(VICHARANASHALA_FAQS):
            fid = uuid.uuid4()
            published_ids.append(fid)
            # Find a matching category by slug
            slug_to_use = None
            section = faq["section"]
            for cs, c in cat_map.items():
                if c.name == section:
                    slug_to_use = cs
                    break
            if slug_to_use is None:
                slug_to_use = "general"
            slug = f"faq-{i+1:03d}-" + "".join(c if c.isalnum() else "-" for c in faq["question"].lower()[:50]).strip("-")
            # Alternate publishers: admin for the first half, maya for some
            publisher = admin if i % 3 != 0 else maya
            session.add(PublishedFaq(
                id=fid,
                candidate_id=None,
                slug=slug,
                title=faq["question"],
                content=faq["answer"],
                category_id=cat_map[slug_to_use].id,
                version_number=1,
                confidence_score=85.0 + (i % 13),  # 85-97
                community_agreement_score=88.0 + (i % 11),  # 88-98
                published_by=publisher,
                published_at=ago(days=(i % 90) + 1),
                created_at=ago(days=(i % 90) + 1),
            ))
        await session.flush()

        # ---- FAQ VERSIONS for first 8 FAQs (history of revisions) ----
        print(f"   FAQ versions for first 8 FAQs")
        for i in range(min(8, len(published_ids))):
            faq = await session.get(PublishedFaq, published_ids[i])
            # v1
            session.add(FaqVersion(
                id=uuid.uuid4(),
                faq_id=faq.id,
                version_number=1,
                title=faq.title,
                content=faq.content,
                change_summary="Initial publication",
                created_by=admin,
                created_at=faq.published_at,
            ))
            # v2 (revised)
            if i % 2 == 0:
                session.add(FaqVersion(
                    id=uuid.uuid4(),
                    faq_id=faq.id,
                    version_number=2,
                    title=faq.title,
                    content=faq.content + "\n\n## Update (v2)\n\nThis answer was updated based on cohort feedback received via Yaksha. The substantive policy is unchanged; clarifications have been added throughout for common edge cases.",
                    change_summary="Clarifications added based on cohort Q&A",
                    created_by=admin,
                    created_at=ago(days=(i % 30)),
                ))
                faq.version_number = 2
                faq.confidence_score = min(99.0, (faq.confidence_score or 90) + 2)
                faq.community_agreement_score = min(99.0, (faq.community_agreement_score or 85) + 3)

        # ---- DISCUSSIONS (must come before FAQ CANDIDATES since candidates need discussion_id) ----
        print(f"   discussions ({len(DISCUSSIONS)})")
        discussion_ids: list[uuid.UUID] = []
        for i, d in enumerate(DISCUSSIONS):
            did = uuid.uuid4()
            discussion_ids.append(did)
            # First 4 by Alex, then alternates
            author_idx = 1 + (i % 7) if i > 0 else 0  # discussion 0 by admin
            session.add(Discussion(
                id=did,
                question_id=None,
                created_by=user_ids[author_idx],
                title=d["title"],
                description=d["description"],
                status=d["status"],
                view_count=d["view_count"],
                reply_count=0,
                participant_count=0,
                consensus_score=d["consensus_score"],
                created_at=ago(days=(i % 30) + 1),
            ))
        await session.flush()

        # ---- FAQ CANDIDATES ----
        print(f"   FAQ candidates ({len(FAQ_CANDIDATES)})")
        candidate_ids: list[uuid.UUID] = []
        for i, c in enumerate(FAQ_CANDIDATES):
            cid = uuid.uuid4()
            candidate_ids.append(cid)
            session.add(FaqCandidate(
                id=cid,
                discussion_id=discussion_ids[i % len(discussion_ids)],
                generated_by_ai=False,
                title=c["title"],
                content=c["content"],
                confidence_score=c["confidence"],
                status=c["status"],
                created_at=ago(days=2, hours=3),
            ))
        await session.flush()

        # ---- REPLIES ----
        print(f"   replies ({len(REPLIES)})")
        reply_ids: list[uuid.UUID] = []
        for disc_idx, user_idx, content, days, is_accepted, ups, downs in REPLIES:
            rid = uuid.uuid4()
            reply_ids.append(rid)
            session.add(Reply(
                id=rid,
                discussion_id=discussion_ids[disc_idx],
                parent_reply_id=None,
                user_id=user_ids[user_idx],
                content=content,
                is_accepted=is_accepted,
                upvote_count=ups,
                downvote_count=downs,
                created_at=ago(days=days),
            ))

        # Update discussion reply_count and participant_count
        for i, did in enumerate(discussion_ids):
            disc = await session.get(Discussion, did)
            count = sum(1 for r in REPLIES if r[0] == i)
            disc.reply_count = count
            disc.participant_count = min(count, len(set(r[1] for r in REPLIES if r[0] == i)))

        # ---- QUESTIONS ----
        print(f"   questions ({len(QUESTIONS)})")
        question_ids: list[uuid.UUID] = []
        for i, q in enumerate(QUESTIONS):
            qid = uuid.uuid4()
            question_ids.append(qid)
            session.add(Question(
                id=qid,
                user_id=user_ids[(i % 7) + 1],  # not admin
                title=q["title"],
                description=q["description"],
                category_id=cat_map[q["category"]].id,
                status=q["status"],
                ai_analysis_status=q["ai_status"],
                created_at=ago(days=i * 2 + 1),
            ))

        # ---- VOTES ----
        print("   votes")
        vote_targets = (
            [(published_ids[0], "faq"), (published_ids[1], "faq"), (published_ids[5], "faq"), (published_ids[10], "faq"), (published_ids[25], "faq"), (published_ids[50], "faq"), (published_ids[100], "faq")] +
            [(discussion_ids[0], "discussion"), (discussion_ids[1], "discussion"), (discussion_ids[2], "discussion"), (discussion_ids[3], "discussion"), (discussion_ids[4], "discussion"), (discussion_ids[5], "discussion")] +
            [(reply_ids[0], "reply"), (reply_ids[1], "reply"), (reply_ids[4], "reply"), (reply_ids[5], "reply"), (reply_ids[8], "reply"), (reply_ids[9], "reply")]
        )
        vote_count = 0
        for target_id, target_type in vote_targets:
            for voter_idx in range(len(USERS)):
                if voter_idx == 1 and target_type in ("faq", "discussion"):
                    continue
                vt = "UPVOTE" if voter_idx % 3 != 0 else "DOWNVOTE"
                session.add(Vote(
                    id=uuid.uuid4(),
                    user_id=user_ids[voter_idx],
                    target_type=target_type,
                    target_id=target_id,
                    vote_type=vt,
                    created_at=ago(days=voter_idx),
                ))
                vote_count += 1
        print(f"    {vote_count} votes created")

        # ---- REPORTS ----
        print(f"   reports ({len(REPORTS)})")
        for r in REPORTS:
            if r["target_type"] == "faq":
                tid = published_ids[r["target_idx"] % len(published_ids)]
            elif r["target_type"] == "discussion":
                tid = discussion_ids[r["target_idx"] % len(discussion_ids)]
            elif r["target_type"] == "reply":
                tid = reply_ids[r["target_idx"] % len(reply_ids)]
            elif r["target_type"] == "user":
                tid = user_ids[r["target_idx"]]
            else:
                tid = uuid.uuid4()
            session.add(Report(
                id=uuid.uuid4(),
                reporter_id=user_ids[r["reporter_idx"]],
                target_type=r["target_type"],
                target_id=tid,
                reason=r["reason"],
                description=r["description"],
                severity=r["severity"],
                status=r["status"],
                created_at=ago(days=2 if r["status"] in ("OPEN", "INVESTIGATING") else 5),
            ))

        # ---- NOTIFICATIONS ----
        print(f"   notifications ({len(NOTIFICATIONS)})")
        for n in NOTIFICATIONS:
            session.add(Notification(
                id=uuid.uuid4(),
                user_id=user_ids[n["user_idx"]],
                notif_type=n["type"],
                title=n["title"],
                message=n["message"],
                is_read=n["read"],
                is_archived=n.get("archived", False),
                created_at=ago(days=n["days"], hours=n["days"] * 3),
            ))

        # ---- ACHIEVEMENTS ----
        print(f"   achievements ({len(ACHIEVEMENTS)})")
        for a in ACHIEVEMENTS:
            session.add(Achievement(
                id=uuid.uuid4(),
                name=a["name"],
                description=a["description"],
                icon=a["icon"],
            ))

        # ---- SAVED KNOWLEDGE (mix of FAQ and discussion bookmarks for Alex) ----
        print("   saved knowledge (8 items for Alex)")
        from app.models.collection import SavedKnowledge as SK
        for i, p in enumerate(published_ids[:5]):
            session.add(SK(
                id=uuid.uuid4(),
                user_id=alex,
                target_type="faq",
                target_id=p,
                created_at=ago(days=i + 1),
            ))
        for i, d in enumerate(discussion_ids[:3]):
            session.add(SK(
                id=uuid.uuid4(),
                user_id=alex,
                target_type="discussion",
                target_id=d,
                created_at=ago(days=i + 1),
            ))
        # Some for Priya
        for i, p in enumerate(published_ids[5:9]):
            session.add(SK(
                id=uuid.uuid4(),
                user_id=priya,
                target_type="faq",
                target_id=p,
                created_at=ago(days=i + 2),
            ))

        # ---- EVOLUTION EVENTS ----
        print("   evolution events")
        for i, p in enumerate(published_ids[:10]):
            ev_type = "PUBLISHED" if i == 0 else ("UPDATED" if i % 2 == 0 else "CONSENSUS")
            desc = {
                "PUBLISHED": "FAQ initially published by Elena Vasquez",
                "UPDATED": "FAQ revised based on cohort feedback",
                "CONSENSUS": "Community consensus score crossed 90% threshold",
            }[ev_type]
            session.add(EvolutionEvent(
                id=uuid.uuid4(),
                faq_id=p,
                version_id=None,
                event_type=ev_type,
                description=desc,
                triggered_by=admin,
                created_at=ago(days=i + 2),
            ))

        await session.commit()
        print()
        print("=" * 60)
        print("[OK] Seed complete!")
        print("=" * 60)
        print(f"  Users:        {len(USERS)} (1 admin, 7 regular)")
        print(f"  Categories:   {len(CATEGORIES)}")
        print(f"  FAQs:         {len(VICHARANASHALA_FAQS)} published, {len(FAQ_CANDIDATES)} candidates")
        print(f"  Discussions:  {len(DISCUSSIONS)}")
        print(f"  Replies:      {len(REPLIES)}")
        print(f"  Questions:    {len(QUESTIONS)}")
        print(f"  Reports:      {len(REPORTS)}")
        print(f"  Notifications:{len(NOTIFICATIONS)}")
        print(f"  Votes:        {vote_count}")
        print(f"  Achievements: {len(ACHIEVEMENTS)}")
        print()
        print("Admin user (DB):")
        print("  username: admin")
        print("  email:    admin@crowdmind.dev")
        print("  clerk_user_id: clerk_admin_seed (run scripts/seed_clerk.py to provision)")


if __name__ == "__main__":
    asyncio.run(seed())
