"""Seed script for initial development data.

Run with: cd backend && uv run python -m scripts.seed

Drops & re-creates demo data for: users, categories, FAQs (published + candidates),
discussions, replies, questions, reports, notifications, votes, FAQ versions,
evolution events, achievements.
"""
import asyncio
import uuid
from datetime import datetime, timedelta

from sqlalchemy import delete, select
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


# -------- HELPERS --------

def uid() -> uuid.UUID:
    return uuid.uuid4()


def ago(days: int = 0, hours: int = 0) -> datetime:
    return datetime.utcnow() - timedelta(days=days, hours=hours)


# -------- USERS --------

USERS = [
    {
        "id": uid(),
        "clerk_user_id": "clerk_admin_seed",
        "username": "admin",
        "email": "admin@crowdmind.ai",
        "full_name": "Dr. Elena Vasquez",
        "role": "admin",
        "reputation_score": 5420,
        "bio": "AI ethics researcher, PhD MIT. Lead moderator at CrowdMind.",
        "avatar_url": "https://ui-avatars.com/api/?name=Elena+Vasquez&background=b0c6ff&color=002d6e&bold=true&size=128",
    },
    {
        "id": uid(),
        "clerk_user_id": "clerk_alex",
        "username": "alex_rivera",
        "email": "alex@example.com",
        "full_name": "Alex Rivera",
        "role": "user",
        "reputation_score": 1240,
        "bio": "Senior ML engineer working on retrieval-augmented systems.",
        "avatar_url": "https://ui-avatars.com/api/?name=Alex+Rivera&background=d2bbff&color=25005a&bold=true&size=128",
    },
    {
        "id": uid(),
        "clerk_user_id": "clerk_maya",
        "username": "maya_p",
        "email": "maya@example.com",
        "full_name": "Maya Patel",
        "role": "user",
        "reputation_score": 890,
        "bio": "Distributed systems and consensus protocols researcher.",
        "avatar_url": "https://ui-avatars.com/api/?name=Maya+Patel&background=00dbe9&color=00363a&bold=true&size=128",
    },
    {
        "id": uid(),
        "clerk_user_id": "clerk_jordan",
        "username": "jordan_l",
        "email": "jordan@example.com",
        "full_name": "Jordan Lee",
        "role": "user",
        "reputation_score": 540,
        "bio": "PhD student in computational neuroscience. Interested in cognitive architectures.",
        "avatar_url": "https://ui-avatars.com/api/?name=Jordan+Lee&background=7df4ff&color=00363a&bold=true&size=128",
    },
    {
        "id": uid(),
        "clerk_user_id": "clerk_ravi",
        "username": "ravi_s",
        "email": "ravi@example.com",
        "full_name": "Ravi Singh",
        "role": "user",
        "reputation_score": 320,
        "bio": "Software architect focused on production ML systems.",
        "avatar_url": "https://ui-avatars.com/api/?name=Ravi+Singh&background=ffb4ab&color=690005&bold=true&size=128",
    },
]


# -------- CATEGORIES --------

CATEGORIES = [
    ("Education", "education", "Learning methodologies, pedagogy, curriculum design"),
    ("Technology", "technology", "Software, hardware, infrastructure, emerging tech"),
    ("AI", "ai", "Artificial intelligence, machine learning, neural networks"),
    ("Programming", "programming", "Languages, frameworks, design patterns, best practices"),
    ("Career", "career", "Professional growth, hiring, workplace, leadership"),
    ("Research", "research", "Scientific method, peer review, academic publishing"),
]


# -------- PUBLISHED FAQs --------

FAQS = [
    {
        "title": "What is retrieval-augmented generation (RAG)?",
        "content": "Retrieval-augmented generation (RAG) is an AI framework that combines a pre-trained language model with an external knowledge retrieval system. Instead of relying solely on the model's parameters, RAG fetches relevant documents at inference time and feeds them as context, dramatically reducing hallucinations and allowing the model to access up-to-date information.\n\nThe typical pipeline: (1) user query is embedded into a vector, (2) a vector database is searched for top-k similar chunks, (3) those chunks are concatenated with the query as a prompt, (4) the LLM generates a response grounded in those chunks with citations.\n\nRAG works best when the knowledge base is large, dynamic, or domain-specific, and is now the standard architecture for production AI assistants.",
        "category": "ai",
        "confidence": 94.0,
        "agreement": 91.0,
        "views": 2840,
    },
    {
        "title": "How do consensus protocols like Raft handle network partitions?",
        "content": "Raft is a consensus algorithm designed to be understandable. During a network partition, the cluster splits into a majority side and a minority side. Only the majority side can elect a new leader and append entries to the log  the minority side rejects writes and eventually times out, stepping down to follower.\n\nThis guarantees safety (no two leaders in the same term) and liveness once the partition heals. The trade-off: during a partition, the minority side becomes read-only. Raft uses randomized election timeouts (typically 150300ms) to prevent split votes, and requires (N/2)+1 nodes to agree on any committed log entry.\n\nPaxos offers similar guarantees with a more abstract formulation, but Raft's leader-based design and decomposable state machine make it the de-facto choice for new systems (etcd, Consul, CockroachDB).",
        "category": "technology",
        "confidence": 88.0,
        "agreement": 84.0,
        "views": 1920,
    },
    {
        "title": "What are the trade-offs between SQL and NoSQL databases?",
        "content": "SQL databases (PostgreSQL, MySQL) provide ACID transactions, strong consistency, mature query optimization, and well-defined schemas. They excel at complex joins, aggregations, and reporting workloads. They scale vertically well and horizontally via sharding, though the latter is operationally heavy.\n\nNoSQL databases split into several families: key-value (Redis, DynamoDB) for high-throughput simple lookups, document (MongoDB) for flexible schemas and hierarchical data, columnar (Cassandra) for write-heavy time-series, and graph (Neo4j) for highly connected data. They typically sacrifice ACID for horizontal scale, eventual consistency, or schema flexibility.\n\nRule of thumb: start with a relational database. Move to NoSQL only when you have a specific access pattern (e.g., sub-millisecond reads at scale, graph traversals) that SQL cannot serve cost-effectively. Polyglot persistence  using multiple stores  is increasingly common in large systems.",
        "category": "technology",
        "confidence": 92.0,
        "agreement": 89.0,
        "views": 3210,
    },
    {
        "title": "How does gradient descent actually work?",
        "content": "Gradient descent is the optimization engine behind most modern machine learning. Given a loss function L() parameterized by weights , the gradient L tells us the direction of steepest ascent. We move in the opposite direction:    - L(), where  is the learning rate.\n\nThree flavors:\n Batch GD: uses the full dataset each step  stable but slow and memory-heavy.\n Stochastic GD: uses one example  fast but noisy.\n Mini-batch GD: uses 32512 examples  the practical sweet spot.\n\nAdvanced optimizers (Adam, RMSprop, AdaGrad) adapt the learning rate per parameter based on historical gradients. Adam is the default for most deep learning today. The learning rate schedule (warmup + cosine decay) often matters more than the optimizer choice. Second-order methods (L-BFGS, Newton) compute curvature but scale poorly to large models.",
        "category": "ai",
        "confidence": 96.0,
        "agreement": 93.0,
        "views": 4150,
    },
    {
        "title": "What is the difference between correlation and causation?",
        "content": "Correlation is a statistical measure of how two variables move together. Causation means one variable directly influences the other. The classic example: ice cream sales and drowning deaths are correlated (both rise in summer) but neither causes the other  heat is the confounder.\n\nTo establish causation, you need more than observational data:\n Randomized controlled trials: random assignment breaks confounding.\n Natural experiments: exploit exogenous shocks.\n Instrumental variables: find a variable that affects the cause but only through the outcome.\n Regression discontinuity: compare units just above/below a threshold.\n\nIn machine learning, models can only learn correlations from training data. This is why models can pick up spurious patterns (e.g., hospital visits predicting death  actually because sick people go to hospitals). Causal inference requires domain knowledge, careful study design, and explicit assumptions that can be tested.",
        "category": "research",
        "confidence": 91.0,
        "agreement": 95.0,
        "views": 2680,
    },
    {
        "title": "How should I prepare for a senior engineering interview?",
        "content": "Senior engineering interviews typically test four areas: (1) system design (design YouTube, design a rate limiter), (2) coding (medium-hard algorithmic problems, focus on clean implementation), (3) behavioral (leadership, conflict resolution, project impact), and (4) domain depth (depending on role: ML, distributed systems, frontend, etc.).\n\nFor system design, study the classic patterns: caching, sharding, queues, load balancers, CDNs, pub/sub, event sourcing. Be able to estimate QPS, storage, bandwidth. Know the trade-offs of SQL vs NoSQL, monolith vs microservices, push vs pull.\n\nFor coding, practice 50100 LeetCode problems focusing on graphs, DP, trees, and sliding window. Talk through your approach before coding. Test with edge cases.\n\nFor behavioral, prepare 57 STAR stories spanning technical leadership, conflict, failure, and impact. Quantify everything (reduced latency by 40%, led team of 5, shipped 2 years ahead of schedule).\n\nThe meta-skill: structured thinking. Show your interviewer how you decompose problems, not just that you can solve them.",
        "category": "career",
        "confidence": 87.0,
        "agreement": 82.0,
        "views": 1870,
    },
    {
        "title": "What is the CAP theorem and why does it matter?",
        "content": "The CAP theorem (Brewer, 2000) states that a distributed data store can simultaneously provide only two of three guarantees: Consistency (all nodes see the same data at the same time), Availability (every request receives a response), and Partition tolerance (the system continues operating despite network failures between nodes).\n\nSince network partitions are inevitable in any real distributed system, you effectively choose between CP and AP during a partition. CP systems (etcd, ZooKeeper, HBase) reject writes to preserve consistency. AP systems (Cassandra, DynamoDB, Riak) accept writes and reconcile conflicts later via vector clocks or last-write-wins.\n\nCAP is often oversimplified. In practice:\n Latency is part of consistency (a slow system can be eventually consistent).\n The trade-off is tunable: many systems let you choose per-operation.\n Modern databases blur the line: Spanner offers global consistency with high availability via TrueTime; Cosmos DB lets you pick from 5 consistency levels.\n\nThe real question isn't \"which two\" but \"under what conditions, with what latency, and what conflict resolution.\"",
        "category": "technology",
        "confidence": 93.0,
        "agreement": 88.0,
        "views": 2240,
    },
    {
        "title": "How do I structure a TypeScript Node.js project?",
        "content": "A well-structured TypeScript Node.js project typically follows this layout:\n\n```\nsrc/\n  index.ts          # entry point\n  app.ts            # express/fastify app setup\n  config/           # env loading, validation (zod)\n  routes/           # one file per resource\n  controllers/      # request handlers (thin)\n  services/         # business logic (thick, testable)\n  repositories/     # data access\n  models/           # database models / DTOs\n  middleware/       # auth, error handling, logging\n  utils/            # pure helpers\n  types/            # shared TypeScript types\ntests/\n  unit/             # service tests\n  integration/      # API tests\n```\n\nKey principles:\n Separate concerns: routes don't know about SQL, services don't know about HTTP.\n Use dependency injection (or factory functions) for testability.\n Validate at the boundary (zod/yup), trust internal code.\n Use a logger (pino, winston) not console.log.\n Centralize error handling with custom error classes.\n Add OpenAPI spec generation (zod-to-openapi) for free API docs.\n\nFor monorepos, use pnpm workspaces or turborepo. For build, use tsc + esbuild or swc for fast incremental builds.",
        "category": "programming",
        "confidence": 89.0,
        "agreement": 85.0,
        "views": 1650,
    },
]


# -------- FAQ CANDIDATES --------

FAQ_CANDIDATES = [
    {
        "title": "Are we approaching the limits of LLM scaling laws?",
        "content": "The Chinchilla scaling laws (Hoffmann et al., 2022) established that compute-optimal training requires ~20 tokens per parameter. GPT-4-class models are believed to use 1T+ parameters trained on 10T+ tokens. Recent evidence suggests inference-time scaling (chain-of-thought, tool use, multi-step reasoning) and test-time compute scaling can extend capability gains even when parameter scaling slows.\n\nKey open questions: (1) does data run out before we hit capability limits? (2) does inference-time scaling have its own scaling laws? (3) what is the role of RLHF and synthetic data?\n\nThe community is split: some researchers argue we're entering a regime of diminishing returns, others point to emergent capabilities that appear suddenly at scale. The truth is empirically unknown.",
        "confidence": 72.0,
        "status": "PENDING",
    },
    {
        "title": "How do multi-agent LLM systems coordinate without central control?",
        "content": "Multi-agent systems in AI research draw from distributed systems theory. Coordination patterns include: (1) market-based (agents bid on tasks), (2) blackboard (shared memory), (3) contract net (announce-bid-award), (4) swarm (local rules, emergent global behavior). Recent LLM frameworks like AutoGen, CrewAI, and LangGraph implement variations of these.\n\nOpen problems: how to verify agent outputs without trusting them, how to prevent cascading failures, how to attribute credit/blame for outcomes. The field borrows heavily from multi-agent reinforcement learning, mechanism design, and formal verification.",
        "confidence": 68.0,
        "status": "PENDING",
    },
    {
        "title": "What is the best way to learn Rust in 2025?",
        "content": "The fastest path to Rust proficiency: (1) read The Rust Book (free online, ~30 hours), (2) complete Rustlings (small exercises, ~10 hours), (3) build a small CLI tool (e.g., a grep clone), (4) read Rust by Example alongside. Key concepts to internalize: ownership, borrowing, lifetimes, the borrow checker errors (read them carefully  they are usually right), traits vs dyn-trait, async/await with tokio.\n\nCommon pitfalls: fighting the borrow checker (refactor first, don't sprinkle .clone()), over-using Rc/Arc, premature optimization with unsafe, not reading the standard library. The Rust ecosystem moves fast  Cargo, tokio, axum, sqlx, and serde are the foundations. Avoid tutorial hell: build something real by week 3.",
        "confidence": 85.0,
        "status": "APPROVED",
    },
    {
        "title": "How should companies evaluate AI vendors in 2025?",
        "content": "Evaluation framework: (1) Use case clarity  what specific problem are you solving, with measurable success criteria. (2) Data  what data does the vendor need, who owns it, how is it used in training, can you opt out. (3) Latency and cost  match the cost-per-1k-tokens to your budget; pilot at 10x expected production scale. (4) Vendor lock-in  can you export data, switch models, host on-prem. (5) Compliance  SOC 2, GDPR, HIPAA, regional data residency. (6) Roadmap  are they building toward your needs, or have they plateaued.\n\nRed flags: vendor can't explain their model, no customers willing to be references, evaluation on synthetic benchmarks only, no SLA, no exit clause. Green flags: published evaluations, transparent pricing, open source components, security certifications.",
        "confidence": 81.0,
        "status": "NEEDS_REVISION",
    },
    {
        "title": "Should I use WebSockets or Server-Sent Events for real-time features?",
        "content": "WebSockets: full-duplex, low overhead after handshake, supports binary, works through most proxies. Use for: chat, collaborative editing, gaming, bidirectional control.\n\nSSE (Server-Sent Events): unidirectional (server  client), plain HTTP, automatic reconnection, simpler to debug with curl, works through HTTP/2, can be served by CDNs. Use for: notifications, live feeds, progress updates, log streaming.\n\nFor most real-time UIs that only need server-push (notifications, dashboards, prices, activity feeds), SSE is simpler and more reliable. WebSockets shine when you need true bidirectional communication. Both have ~50ms latency in practice. For <50ms requirements (HFT, gaming), neither is enough  use UDP or a specialized protocol like QUIC.",
        "confidence": 88.0,
        "status": "PENDING",
    },
]


# -------- DISCUSSIONS --------

DISCUSSIONS = [
    {
        "title": "Best practices for prompt engineering in production LLM systems",
        "description": "Looking for battle-tested techniques beyond the usual 'be clear and specific.' Specifically interested in: (1) how to structure system prompts that survive across model versions, (2) techniques for reducing prompt injection risk, (3) when to use few-shot vs zero-shot vs chain-of-thought, (4) how to A/B test prompt changes safely. Would love to hear from anyone running LLM systems at scale.",
        "status": "ACTIVE",
        "view_count": 892,
        "consensus_score": 0.78,
        "question_link": None,
    },
    {
        "title": "Is Rust ready to replace C++ in systems programming?",
        "description": "C++ has dominated systems programming for 40+ years. Rust offers memory safety without garbage collection, modern tooling, and growing ecosystem. Where does Rust still fall short? Performance parity, FFI ergonomics, compile times, hiring pool, library maturity in specific domains. Genuinely curious where the field is in 2025.",
        "status": "ACTIVE",
        "view_count": 1240,
        "consensus_score": 0.82,
        "question_link": None,
    },
    {
        "title": "How do you handle ML model versioning and rollback?",
        "description": "We had a production incident last month where a model update caused a 30% spike in false positives. Rolling back was painful  we had to revert feature pipelines, model artifacts, AND shadow traffic routing. What's your team's model deployment and rollback story? Tools, processes, lessons learned?",
        "status": "RESOLVED",
        "view_count": 567,
        "consensus_score": 0.91,
        "question_link": None,
    },
    {
        "title": "Postgres vs ClickHouse for analytical queries on 10B+ rows",
        "description": "We're hitting the limits of our Postgres-based analytics setup. Aggregation queries over a week of data take 40+ seconds. Considering ClickHouse, DuckDB, and TimescaleDB. Anyone migrated from Postgres to a columnar store for similar workloads? What were the surprises, gotchas, and what would you do differently?",
        "status": "ACTIVE",
        "view_count": 423,
        "consensus_score": 0.65,
        "question_link": None,
    },
    {
        "title": "Why are microservices still controversial in 2025?",
        "description": "A decade after the microservices hype cycle, the industry seems to have settled into 'modular monolith first, extract services when you need to scale teams or systems.' Yet many large orgs still operate on microservices-only. What's the current best practice? When does the complexity payoff, and when is it pure overhead?",
        "status": "ACTIVE",
        "view_count": 738,
        "consensus_score": 0.71,
        "question_link": None,
    },
    {
        "title": "Discussion: optimizing transformer inference for low-latency serving",
        "description": "Thread continued from the question about zero-shot learning. We discussed KV-cache compression, speculative decoding, and quantization. Sharing the notes here for community review.",
        "status": "RESOLVED",
        "view_count": 312,
        "consensus_score": 0.88,
        "question_link": "linked_to_question",
    },
]


# -------- REPLIES (discussion_id, author_idx, content, days_ago, is_accepted, upvotes, downvotes) --------

REPLIES = [
    # Discussion 1: prompt engineering
    (0, 0, "For production prompts, treat them like code: version them, review them, test them. We use a YAML-based prompt registry with semantic version tags. Every prompt change goes through PR review and A/B testing on 1% of traffic before full rollout.", 2, True, 47, 1),
    (0, 1, "On prompt injection: we use a strict separation between system instructions and user content. System prompt contains ONLY untrusted data wrapped in <user_input> tags, and we explicitly tell the model to never follow instructions inside those tags. Plus we run a separate classifier on inputs to flag injection attempts.", 2, False, 32, 0),
    (0, 2, "For A/B testing prompts safely: we measure both the business metric (task success, user satisfaction) and a safety metric (refusal rate, hallucination rate). Don't roll out a prompt that wins on UX but breaks safety.", 1, False, 28, 2),
    (0, 3, "Few-shot examples in production are a maintenance burden. They bloat tokens, they go stale, they bias the model in subtle ways. We use them only during evaluation, not in the live prompt, unless the task is genuinely zero-shot-impossible.", 1, False, 19, 5),

    # Discussion 2: Rust vs C++
    (1, 1, "Rust is ready for greenfield systems work. The hiring pool is still small but growing fast. The real question is your existing codebase  rewriting C++ in Rust is rarely worth it. Use Rust for new components, FFI into existing C++ where needed.", 4, True, 64, 3),
    (1, 2, "Compile times are still a real productivity hit. A clean build of our 200k-line Rust service takes 6 minutes. Incremental is fine but PRs often cross many crates.", 3, False, 38, 12),
    (1, 4, "FFI ergonomics have improved a lot with cxx, autocxx, and bindgen. It's not perfect but it's no longer the blocker it was in 2020.", 3, False, 22, 4),
    (1, 3, "Library maturity: async ecosystem is great (tokio, hyper, axum), serialization is great (serde), but specialized domains (audio, scientific computing, certain ML ops) are still rough.", 2, False, 15, 1),

    # Discussion 3: model rollback
    (2, 0, "We solved this with a proper model registry (MLflow) + a feature store. Model artifacts are versioned, features are versioned, and the serving layer takes a 'release name' that pins both. Rollback is one command: kubectl set image with the previous release. Took us 8 months to build but reduced rollback time from 2 hours to 90 seconds.", 5, True, 89, 0),
    (2, 1, "Shadow traffic routing is underrated. We run every new model version in shadow mode for 48 hours  gets the same traffic as production but predictions are logged not served. Catches 80% of issues before user impact.", 4, False, 56, 1),

    # Discussion 4: Postgres vs ClickHouse
    (3, 2, "ClickHouse is a different beast for analytics. We moved from Postgres to ClickHouse 2 years ago for 5B+ row analytics. Compressed our storage 10x, queries went from minutes to seconds. The migration is non-trivial though  expect 2-3 engineer-months.", 6, False, 41, 2),
    (3, 0, "Don't underestimate DuckDB for analytics-in-process. If your data fits in memory (under 100GB compressed), DuckDB is faster than ClickHouse for most workloads and zero-ops. We use DuckDB for ad-hoc analysis and ClickHouse for the dashboards.", 5, False, 35, 0),
]


# -------- QUESTIONS --------

QUESTIONS = [
    {
        "title": "What are the key differences between gRPC and REST for service-to-service communication?",
        "description": "Evaluating gRPC vs REST for a new microservices system. Looking for real-world performance, developer experience, and observability trade-offs.",
        "category": "technology",
        "status": "ANALYZED",
        "ai_status": "COMPLETED",
    },
    {
        "title": "How can I debug a memory leak in a long-running Node.js service?",
        "description": "Our Node.js service slowly grows to 4GB RSS over 3 days then OOMs. heap snapshots show old generation growing but I can't find what's holding references.",
        "category": "programming",
        "status": "OPEN",
        "ai_status": "PENDING",
    },
    {
        "title": "When should I use a vector database vs a traditional search engine?",
        "description": "Building a semantic search feature. We have 1M documents, need to find the top-10 most semantically similar. Algolia, Elasticsearch, Pinecone, pgvector  which makes sense?",
        "category": "ai",
        "status": "ANALYZED",
        "ai_status": "COMPLETED",
    },
    {
        "title": "What is the most effective way to onboard a new senior engineer?",
        "description": "Just hired 3 senior engineers. What onboarding rituals have you seen actually work vs feel-good-but-don't-matter?",
        "category": "career",
        "status": "ANALYZED",
        "ai_status": "COMPLETED",
    },
    {
        "title": "How do I run a productive technical interview loop as an interviewer?",
        "description": "I've been an interviewer for years but I want to be better. What are the techniques interviewers use to actually evaluate signal vs noise?",
        "category": "career",
        "status": "OPEN",
        "ai_status": "PENDING",
    },
    {
        "title": "What's the current state of differential privacy in production?",
        "description": "Apple, Google, and the US Census use DP. But the academic-to-production gap feels huge. Who's actually deploying DP in 2025, and what tools are usable?",
        "category": "research",
        "status": "ANALYZED",
        "ai_status": "COMPLETED",
    },
    {
        "title": "Should I pursue a PhD or go directly into industry after my MS in ML?",
        "description": "Second-year MS student trying to decide. I like research but I'm also excited by industry impact and comp. Honest advice wanted.",
        "category": "career",
        "status": "OPEN",
        "ai_status": "PENDING",
    },
    {
        "title": "How do you measure developer productivity without harming engineering culture?",
        "description": "Leadership wants 'developer productivity metrics.' Every metric I know of is gameable and incentivizes the wrong behavior. Is there a measurement framework that actually works?",
        "category": "research",
        "status": "ANALYZED",
        "ai_status": "COMPLETED",
    },
]


# -------- REPORTS --------

REPORTS = [
    {
        "reporter_idx": 1,
        "target_type": "faq",
        "target_id": 0,  # will be replaced with actual FAQ id
        "reason": "Outdated information",
        "description": "This FAQ references practice patterns from 2022 that are no longer recommended.",
        "severity": "LOW",
        "status": "OPEN",
    },
    {
        "reporter_idx": 2,
        "target_type": "discussion",
        "target_id": 1,  # will be replaced
        "reason": "Off-topic",
        "description": "Thread has devolved into a language flame war. Please moderate.",
        "severity": "MEDIUM",
        "status": "OPEN",
    },
    {
        "reporter_idx": 3,
        "target_type": "reply",
        "target_id": 0,  # will be replaced with a reply id
        "reason": "Spam",
        "description": "This reply contains a promotional link to a competing product.",
        "severity": "HIGH",
        "status": "OPEN",
    },
    {
        "reporter_idx": 4,
        "target_type": "user",
        "target_id": 3,  # will be replaced
        "reason": "Harassment",
        "description": "User has been sending aggressive DMs to other members after disagreements.",
        "severity": "HIGH",
        "status": "RESOLVED",
    },
    {
        "reporter_idx": 0,
        "target_type": "faq",
        "target_id": 0,
        "reason": "Low quality",
        "description": "Test report - already resolved.",
        "severity": "LOW",
        "status": "DISMISSED",
    },
]


# -------- NOTIFICATIONS --------

NOTIFICATIONS = [
    {"user_idx": 1, "type": "faq", "title": "Your question was answered",
     "message": "A new FAQ was published based on the question you asked about RAG architectures.", "read": False, "days": 0},
    {"user_idx": 1, "type": "discussion", "title": "New reply on your discussion",
     "message": "Maya Patel replied to 'Best practices for prompt engineering in production LLM systems'", "read": False, "days": 0},
    {"user_idx": 1, "type": "reply", "title": "Your reply was accepted",
     "message": "Elena Vasquez marked your reply as the accepted solution.", "read": True, "days": 1},
    {"user_idx": 1, "type": "reputation", "title": "+50 reputation",
     "message": "You earned 50 reputation for your accepted answer.", "read": True, "days": 1},
    {"user_idx": 1, "type": "badge", "title": "New badge earned: Curious Mind",
     "message": "You asked 10 questions this month. Keep exploring!", "read": False, "days": 2},
    {"user_idx": 1, "type": "faq", "title": "FAQ you follow was updated",
     "message": "'What is retrieval-augmented generation (RAG)?' got a new version (v2).", "read": True, "days": 3},
    {"user_idx": 1, "type": "discussion", "title": "Discussion escalated to AI",
     "message": "Your discussion has been escalated for AI-assisted moderation.", "read": False, "days": 0},
    {"user_idx": 1, "type": "reputation", "title": "Top contributor this week",
     "message": "You're in the top 5% of contributors this week. Keep it up!", "read": False, "days": 0},
]


# -------- ACHIEVEMENTS --------

ACHIEVEMENTS = [
    {"name": "First Question", "description": "Asked your first question", "icon": "help"},
    {"name": "Curious Mind", "description": "Asked 10 questions", "icon": "psychology"},
    {"name": "Helpful Answer", "description": "Provided an accepted answer", "icon": "check_circle"},
    {"name": "Discussion Starter", "description": "Started 5 discussions", "icon": "forum"},
    {"name": "FAQ Contributor", "description": "Contributed to a published FAQ", "icon": "library_books"},
    {"name": "Top 1% Contributor", "description": "Top 1% of contributors this month", "icon": "emoji_events"},
    {"name": "Early Adopter", "description": "Joined CrowdMind in the first month", "icon": "stars"},
    {"name": "Verified Expert", "description": "Domain expertise verified by admins", "icon": "verified"},
]


# -------- MAIN SEED --------

async def clear_all(session: AsyncSession):
    """Clear all data tables for a fresh seed (idempotent reseed)."""
    # Order matters: respect FK dependencies
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
    for table in tables_in_order:
        await session.execute(_table_delete(table))
    await session.commit()


def _table_delete(table: str):
    from sqlalchemy import text
    return text(f"DELETE FROM {table}")


async def seed():
    async with async_session_factory() as session:
        existing = await session.execute(select(User).limit(1))
        if existing.scalars().first():
            print("Database already seeded. Skipping (delete rows first to reseed).")
            return

        print("[*] Seeding CrowdMind demo data...")

        # Clear in correct order
        await clear_all(session)

        # ---- USERS ----
        print("   users")
        for u in USERS:
            session.add(User(**u))

        await session.flush()
        admin = USERS[0]["id"]
        alex = USERS[1]["id"]
        maya = USERS[2]["id"]
        jordan = USERS[3]["id"]
        ravi = USERS[4]["id"]
        user_ids = [admin, alex, maya, jordan, ravi]

        # ---- CATEGORIES ----
        print("   categories")
        cat_map = {}
        for name, slug, desc in CATEGORIES:
            c = Category(id=uuid.uuid4(), name=name, slug=slug, description=desc)
            cat_map[slug] = c
            session.add(c)
        await session.flush()

        # ---- QUESTIONS ----
        print("   questions")
        question_ids = []
        for i, q in enumerate(QUESTIONS):
            qid = uuid.uuid4()
            question_ids.append(qid)
            session.add(Question(
                id=qid,
                user_id=user_ids[(i % 4) + 1],  # not admin
                title=q["title"],
                description=q["description"],
                category_id=cat_map[q["category"]].id,
                status=q["status"],
                ai_analysis_status=q["ai_status"],
                created_at=ago(days=i * 2 + 1),
            ))

        # ---- PUBLISHED FAQs ----
        print("   published FAQs")
        published_ids = []
        for i, f in enumerate(FAQS):
            fid = uuid.uuid4()
            published_ids.append(fid)
            slug = f["title"].lower()[:60].replace(" ", "-").replace("?", "").replace(",", "").replace("'", "")
            slug = "".join(c for c in slug if c.isalnum() or c == "-") + f"-{i}"
            session.add(PublishedFaq(
                id=fid,
                candidate_id=None,
                slug=slug,
                title=f["title"],
                content=f["content"],
                category_id=cat_map[f["category"]].id,
                version_number=1,
                confidence_score=f["confidence"],
                community_agreement_score=f["agreement"],
                published_by=admin,
                published_at=ago(days=i + 2),
                created_at=ago(days=i + 2),
            ))

        await session.flush()

        # ---- FAQ VERSIONS (for first 2 FAQs) ----
        print("   FAQ versions")
        for i in range(2):
            faq = await session.get(PublishedFaq, published_ids[i])
            # Add a v1 (initial)
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
            # Add a v2 (revised)
            session.add(FaqVersion(
                id=uuid.uuid4(),
                faq_id=faq.id,
                version_number=2,
                title=faq.title,
                content=faq.content + "\n\n## Update (v2)\nAdded additional context and examples based on community feedback.",
                change_summary="Added 3 examples and clarified section on trade-offs",
                created_by=admin,
                created_at=ago(days=i),
            ))
            # Update published FAQ to v2
            faq.version_number = 2
            faq.confidence_score = min(99.0, (faq.confidence_score or 90) + 3)
            faq.community_agreement_score = min(99.0, (faq.community_agreement_score or 85) + 4)

        # ---- FAQ CANDIDATES ----
        print("   FAQ candidates")
        candidate_ids = []
        # Need a discussion for each candidate  link to first 5 discussions
        # We'll create discussions first, then candidates

        # ---- DISCUSSIONS ----
        print("   discussions")
        discussion_ids = []
        for i, d in enumerate(DISCUSSIONS):
            did = uuid.uuid4()
            discussion_ids.append(did)
            q_id = question_ids[0] if (d["question_link"] == "linked_to_question" and question_ids) else None
            session.add(Discussion(
                id=did,
                question_id=q_id,
                created_by=user_ids[(i % 4) + 1],
                title=d["title"],
                description=d["description"],
                status=d["status"],
                view_count=d["view_count"],
                reply_count=0,  # updated after replies
                participant_count=0,
                consensus_score=d["consensus_score"],
                created_at=ago(days=i + 3),
            ))
        await session.flush()

        # Now create candidates linked to discussions
        for i, c in enumerate(FAQ_CANDIDATES):
            cid = uuid.uuid4()
            candidate_ids.append(cid)
            session.add(FaqCandidate(
                id=cid,
                discussion_id=discussion_ids[i % len(discussion_ids)],
                generated_by_ai=(i % 2 == 0),
                title=c["title"],
                content=c["content"],
                confidence_score=c["confidence"],
                status=c["status"],
                created_at=ago(days=i + 1, hours=i * 3),
            ))

        # ---- REPLIES ----
        print("   replies")
        reply_ids = []
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

        # Update discussion reply_count
        for i, did in enumerate(discussion_ids):
            disc = await session.get(Discussion, did)
            count = sum(1 for r in REPLIES if r[0] == i)
            disc.reply_count = count
            disc.participant_count = min(count, len(set(r[1] for r in REPLIES if r[0] == i)))

        # ---- VOTES ----
        print("   votes")
        # Give the first 2 discussions and first few replies some votes
        vote_targets = (
            [(published_ids[0], "faq"), (published_ids[1], "faq"), (published_ids[2], "faq")] +
            [(discussion_ids[0], "discussion"), (discussion_ids[1], "discussion"), (discussion_ids[2], "discussion")] +
            [(reply_ids[0], "reply"), (reply_ids[1], "reply"), (reply_ids[4], "reply"), (reply_ids[8], "reply")]
        )
        vote_count = 0
        for target_id, target_type in vote_targets:
            for voter_idx in [0, 1, 2, 3, 4]:
                if voter_idx == 1 and target_type in ("faq", "discussion"):
                    continue  # skip self-votes
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
        print("   reports")
        for r in REPORTS:
            # Resolve target_id based on type
            if r["target_type"] == "faq":
                tid = published_ids[r["target_id"] % len(published_ids)]
            elif r["target_type"] == "discussion":
                tid = discussion_ids[r["target_id"] % len(discussion_ids)]
            elif r["target_type"] == "reply":
                tid = reply_ids[r["target_id"] % len(reply_ids)]
            elif r["target_type"] == "user":
                tid = user_ids[r["target_id"]]
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
                created_at=ago(days=2 if r["status"] == "OPEN" else 5),
            ))

        # ---- NOTIFICATIONS ----
        print("   notifications")
        for n in NOTIFICATIONS:
            session.add(Notification(
                id=uuid.uuid4(),
                user_id=user_ids[n["user_idx"]],
                notif_type=n["type"],
                title=n["title"],
                message=n["message"],
                is_read=n["read"],
                created_at=ago(days=n["days"], hours=n["days"] * 3),
            ))

        # ---- ACHIEVEMENTS ----
        print("   achievements")
        for a in ACHIEVEMENTS:
            session.add(Achievement(
                id=uuid.uuid4(),
                name=a["name"],
                description=a["description"],
                icon=a["icon"],
            ))

        # ---- SAVED KNOWLEDGE (one for Alex) ----
        print("   saved knowledge")
        from app.models.collection import SavedKnowledge as SK
        for i, p in enumerate(published_ids[:3]):
            session.add(SK(
                id=uuid.uuid4(),
                user_id=alex,
                target_type="faq",
                target_id=p,
                created_at=ago(days=i + 1),
            ))

        # ---- EVOLUTION EVENTS ----
        print("   evolution events")
        for i, p in enumerate(published_ids[:3]):
            session.add(EvolutionEvent(
                id=uuid.uuid4(),
                faq_id=p,
                version_id=None,
                event_type="PUBLISHED" if i == 0 else "UPDATED",
                description=f"FAQ initially published" if i == 0 else f"FAQ revised based on community feedback",
                triggered_by=admin,
                created_at=ago(days=i + 2),
            ))

        await session.commit()
        print("[OK] Seed complete!")
        print()
        print("Summary:")
        print(f"  Users:        {len(USERS)} (1 admin, 4 regular)")
        print(f"  Categories:   {len(CATEGORIES)}")
        print(f"  FAQs:         {len(FAQS)} published, {len(FAQ_CANDIDATES)} candidates")
        print(f"  Discussions:  {len(DISCUSSIONS)}")
        print(f"  Replies:      {len(REPLIES)}")
        print(f"  Questions:    {len(QUESTIONS)}")
        print(f"  Reports:      {len(REPORTS)}")
        print(f"  Notifications:{len(NOTIFICATIONS)}")
        print(f"  Votes:        {vote_count}")
        print(f"  Achievements: {len(ACHIEVEMENTS)}")
        print()
        print("Admin user (for testing):")
        print(f"  username: admin")
        print(f"  email:    admin@crowdmind.ai")
        print()
        print("  To log in as admin in dev, set the Clerk user's publicMetadata.role to 'admin'.")
        print("    In Clerk dashboard: Users  select user  Metadata  Public: {\"role\": \"admin\"}")


if __name__ == "__main__":
    asyncio.run(seed())
