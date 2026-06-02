# CrowdMind

> Transforming Community Intelligence into Evolving Knowledge

![Status](https://img.shields.io/badge/status-active-success)
![Architecture](https://img.shields.io/badge/architecture-modular_monolith-blue)
![Frontend](https://img.shields.io/badge/frontend-next.js_15-black)
![Backend](https://img.shields.io/badge/backend-fastapi-green)
![Database](https://img.shields.io/badge/database-postgresql-blue)
![AI](https://img.shields.io/badge/ai-gemini_+_groq-orange)

---

# Overview

CrowdMind is an AI-assisted Knowledge Evolution Platform that transforms fragmented discussions into structured, validated, searchable, and continuously evolving knowledge.

Traditional communities generate valuable insights every day.

Unfortunately, those insights often remain buried inside:

* Discussion threads
* Community forums
* Group chats
* Knowledge silos

CrowdMind solves this problem by introducing a Knowledge Evolution Lifecycle.

Instead of ending with discussions, community intelligence becomes reusable knowledge.

---

# The Problem

Most platforms stop at conversation.

```text
Question
    ↓
Discussion
```

Knowledge remains trapped inside threads.

Users repeatedly ask the same questions.

Information becomes difficult to find.

Community expertise becomes fragmented.

---

# The CrowdMind Solution

CrowdMind extends the lifecycle.

```text
Question
      ↓
AI Analysis
      ↓
Discussion
      ↓
Community Consensus
      ↓
AI Synthesis
      ↓
FAQ Candidate
      ↓
Moderator Review
      ↓
Published FAQ
      ↓
Knowledge Evolution
```

Knowledge becomes:

* Structured
* Searchable
* Traceable
* Versioned
* Continuously improving

---

# Core Principles

### Public Knowledge

Knowledge should be accessible without login.

---

### Participation Requires Identity

Contributions require authenticated users.

---

### AI Assists

AI supports synthesis and discovery.

AI is not the source of truth.

---

### Community Validation

Knowledge emerges through consensus.

---

### Continuous Evolution

Knowledge should improve over time.

---

# Key Features

## AI-Assisted Question Analysis

Before discussions begin:

* Duplicate Detection
* Similar FAQ Discovery
* Category Suggestions
* Quality Assessment

---

## Community Discussions

Users collaborate through:

* Discussions
* Replies
* Voting
* Consensus Signals

---

## Knowledge Synthesis

AI generates FAQ candidates from community consensus.

---

## Knowledge Repository

Published FAQs become:

* Searchable
* Versioned
* Traceable

knowledge assets.

---

## Knowledge Evolution

Knowledge continuously improves through:

* New Discussions
* Community Feedback
* Updated Versions

---

## Moderation & Governance

Multi-layer moderation:

* AI Screening
* Community Reporting
* Human Review

---

## Analytics & Intelligence

Track:

* Community Health
* Knowledge Growth
* Platform Adoption
* AI Effectiveness

---

# System Architecture

```text
                   Next.js Frontend
                           │
                           ▼

                      FastAPI API
                           │

       ┌────────────┬────────────┬────────────┐

       ▼            ▼            ▼

 PostgreSQL      Redis       Supabase

       │
       ▼

    AI Gateway
       │
  ┌────┴────┐

  ▼         ▼

Gemini     Groq
```

---

# Technology Stack

## Frontend

* Next.js 15
* TypeScript
* Tailwind CSS
* ShadCN UI
* TanStack Query
* Zustand
* React Hook Form
* Zod

---

## Backend

* FastAPI
* Python 3.12+
* SQLAlchemy
* Pydantic
* Alembic

---

## Database

* PostgreSQL
* pgvector

---

## Authentication

* Clerk

---

## Storage

* Supabase Storage

---

## Cache

* Redis

---

## Monitoring

* Sentry
* PostHog

---

## AI

Primary Provider:

* Google Gemini

Secondary Provider:

* Groq

---

# Project Structure

```text
crowdmind/

├── frontend/
├── backend/
├── docs/
├── infrastructure/
├── scripts/
├── .cursor/
└── .github/
```

---
# User Platform

CrowdMind's public-facing platform consists of 14 core screens.

---

## 01 — Landing Page

Platform introduction and discovery.

---

## 02 — FAQ Repository

Browse verified knowledge artifacts.

---

## 03 — FAQ Detail

Read published FAQs with:

* Sources
* Contributors
* Confidence Signals
* Version History

---

## 04 — Login / Register

Authentication gateway.

---

## 05 — Ask Question

Create new knowledge seeds.

---

## 06 — AI Analysis Result

Review:

* Similar FAQs
* Similar Discussions
* Duplicate Detection

before discussion creation.

---

## 07 — Discussion Listing

Explore community discussions.

---

## 08 — Discussion Thread

Community collaboration space.

---

## 09 — Create Discussion

Start knowledge conversations.

---

## 10 — User Profile

Identity, reputation, and contribution history.

---

## 11 — Notifications Center

Track platform activity.

---

## 12 — Saved Knowledge

Personal knowledge collections.

---

## 13 — My Contributions

Contribution tracking dashboard.

---

## 14 — Knowledge Evolution

Explore knowledge version history.

---

# Admin Platform

CrowdMind includes a dedicated governance layer.

---

## 15 — Mission Control

Platform operations dashboard.

---

## 16 — FAQ Management

Includes:

* Candidate Review
* Published FAQs
* Version History
* Archive

---

## 17 — Moderation Queue

Manage reports and moderation workflows.

---

## 18 — Platform Intelligence Center

Analytics and strategic insights.

---

## 19 — Report Detail & Investigation Center

Deep moderation investigations.

---

## 20 — Settings & Preferences

Administrative configuration center.

---

# Authentication Model

## Public Access

Visitors can:

* Search FAQs
* Browse Repository
* Read Discussions
* View Knowledge Evolution

Without authentication.

---

## Authenticated Actions

Require login:

* Ask Question
* Create Discussion
* Reply
* Vote
* Save Knowledge
* Build Reputation

---

# Local Development Setup

## Prerequisites

Install:

```text
Node.js 22+

Python 3.12+

PostgreSQL 16+

Redis

Git
```

---

# Clone Repository

```bash
git clone https://github.com/your-org/crowdmind.git

cd crowdmind
```

---

# Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Runs on:

```text
http://localhost:3000
```

---

# Backend Setup

```bash
cd backend

python -m venv venv

source venv/bin/activate
```

Windows:

```powershell
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run migrations:

```bash
alembic upgrade head
```

Start API:

```bash
uvicorn app.main:app --reload
```

Runs on:

```text
http://localhost:8000
```

---

# Environment Variables

Create:

```text
.env
```

Example:

```env
DATABASE_URL=

REDIS_URL=

CLERK_SECRET_KEY=
CLERK_PUBLISHABLE_KEY=

GEMINI_API_KEY=
GROQ_API_KEY=

SUPABASE_URL=
SUPABASE_KEY=

SENTRY_DSN=

POSTHOG_KEY=
```

Never commit secrets.

---

# Documentation Index

Core Documents:

```text
docs/

context.md
ARCHITECTURE.md
DATABASE.md
API_SPEC.md
AI_ARCHITECTURE.md
DEPLOYMENT.md
ROADMAP.md
```

---

# Engineering Documents

```text
.cursor/

project_context.md
engineering_rules.md
```

These files act as AI development memory for Cursor.

---

# Development Workflow

```text
Requirement
    ↓
Architecture
    ↓
Database
    ↓
API
    ↓
Backend
    ↓
Frontend
    ↓
Testing
    ↓
Documentation
```

Documentation is part of development.

Not an afterthought.

---

# Contribution Workflow

Create:

```text
feature/*
```

branch.

---

Develop feature.

---

Run tests.

---

Update documentation.

---

Open Pull Request.

---

Review.

---

Merge.

---

# Conventional Commits

Examples:

```bash
feat: add FAQ publishing workflow

fix: resolve duplicate discussion creation

docs: update architecture document

refactor: simplify moderation service

test: add AI gateway tests

perf: optimize vector search
```

---

# Roadmap

## Phase 1 — Foundation

* Authentication
* Discussions
* FAQ Repository
* AI Analysis
* FAQ Pipeline

---

## Phase 2 — Governance

* Moderation
* FAQ Review
* Analytics

---

## Phase 3 — Knowledge Evolution

* Version Tracking
* Consensus Intelligence
* Knowledge Evolution Engine

---

## Phase 4 — Intelligence Layer

* Recommendation Engine
* Knowledge Graph
* Advanced Analytics

---

## Phase 5 — Ecosystem Expansion

Potential Integrations:

* Discourse
* GitHub
* Slack
* Microsoft Teams
* Learning Management Systems

---

# Team

## Team Lead

Govind Upadhyay

---

## Contributors

* Siddharth Sadhu
* Bhavesh Malviya
* Anoogna Gunjari
* Yash Parmar
* Muskan Kumari
* Swanand Sirsikar
* Muralikrishnan N
* P Lokesh Reddy
* Vicky Kumar
* Poorti Swarup
* Purandareswari Kaki

---

# Success Metrics

CrowdMind succeeds when:

* Knowledge becomes easier to discover.
* Duplicate questions decrease.
* Community intelligence becomes reusable.
* AI improves knowledge quality.
* Contributors build trust.
* Knowledge continuously evolves.

---

# License

To be decided by the project team.

Recommended:

```text
MIT License
```

for maximum collaboration.

---

# Final Statement

CrowdMind is a Knowledge Evolution Platform.

It exists to transform discussions into trusted, searchable, and continuously evolving knowledge.

The goal is not to store conversations.

The goal is to preserve and evolve collective intelligence.
