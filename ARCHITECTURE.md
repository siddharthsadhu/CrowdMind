# CrowdMind Architecture Document

Version: 1.0

Status: Architecture Frozen

Related Documents:

* context.md
* DATABASE.md
* API_SPEC.md
* AI_ARCHITECTURE.md
* DEPLOYMENT.md

---

# Purpose

This document defines the technical architecture of CrowdMind.

While `context.md` explains:

"What CrowdMind is"

this document explains:

"How CrowdMind is built."

This file serves as the primary engineering reference for:

* Backend Developers
* Frontend Developers
* AI Engineers
* DevOps Engineers
* Security Engineers
* Future Contributors

---

# Architecture Principles

CrowdMind follows several foundational engineering principles.

---

## Principle 1 — Modular Monolith First

Architecture Style:

Modular Monolith

Reason:

* Faster MVP development
* Easier deployment
* Lower operational complexity
* Easier debugging
* Future microservice migration path

Services are separated logically before they are separated physically.

---

## Principle 2 — Domain Driven Design

Code organization must follow business domains.

Not technical layers.

Bad:

```text
controllers/
services/
models/
```

Preferred:

```text
users/
discussions/
faqs/
moderation/
analytics/
```

Each domain owns its functionality.

---

## Principle 3 — Clean Architecture

Dependencies point inward.

Business logic must not depend on:

* FastAPI
* PostgreSQL
* Redis
* Gemini
* Groq

Frameworks are implementation details.

---

## Principle 4 — AI Provider Independence

Business logic must never directly call:

* Gemini
* Groq

Instead:

```text
Application Layer
        ↓
AI Gateway
        ↓
Provider Adapter
        ↓
Gemini / Groq
```

Allows provider replacement without system rewrites.

---

## Principle 5 — Public Knowledge First

Knowledge consumption should be accessible.

Authentication required only for participation.

---

# High Level Architecture

```text
                ┌─────────────────┐
                │    Next.js UI   │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │   FastAPI API   │
                └────────┬────────┘
                         │
      ┌──────────────────┼──────────────────┐
      ▼                  ▼                  ▼

┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│ PostgreSQL  │   │    Redis    │   │ Supabase    │
│ + pgvector  │   │   Cache     │   │   Storage   │
└─────────────┘   └─────────────┘   └─────────────┘

                         │
                         ▼

                ┌─────────────────┐
                │   AI Gateway    │
                └────────┬────────┘
                         │
              ┌──────────┴──────────┐
              ▼                     ▼

        Google Gemini          Groq API
```

---

# Technology Stack

## Frontend

Framework:

Next.js 15

Language:

TypeScript

UI:

ShadCN UI

Styling:

TailwindCSS

State Management:

Zustand

Forms:

React Hook Form

Validation:

Zod

---

## Backend

Framework:

FastAPI

Language:

Python

Validation:

Pydantic

ORM:

SQLAlchemy

Migrations:

Alembic

---

## Database

Primary Database:

PostgreSQL

Vector Search:

pgvector

---

## Authentication

Provider:

Clerk

Responsibilities:

* Authentication
* Session Management
* Social Login
* User Identity

---

## Caching

Technology:

Redis

Used For:

* Search caching
* FAQ caching
* Analytics caching
* Rate limiting

---

## File Storage

Provider:

Supabase Storage

Stores:

* User avatars
* Attachments
* Images
* Knowledge assets

---

## Monitoring

Sentry

PostHog

---

# System Domains

CrowdMind consists of multiple business domains.

Each domain becomes a backend module.

---

## Auth Domain

Responsibilities:

* Authentication
* Session validation
* Role assignment

---

## User Domain

Responsibilities:

* Profiles
* Reputation
* Preferences
* Achievements

---

## Question Domain

Responsibilities:

* Question creation
* Classification
* AI analysis

---

## Discussion Domain

Responsibilities:

* Discussions
* Replies
* Voting
* Consensus signals

---

## FAQ Domain

Responsibilities:

* FAQ candidates
* Published FAQs
* Version history

---

## Knowledge Domain

Responsibilities:

* Knowledge evolution
* Traceability
* Versioning

---

## Moderation Domain

Responsibilities:

* Reports
* Investigations
* Enforcement actions

---

## Analytics Domain

Responsibilities:

* Metrics
* Dashboards
* Growth analysis

---

## Notification Domain

Responsibilities:

* User notifications
* Event subscriptions

---

## Search Domain

Responsibilities:

* Keyword search
* Semantic search
* Recommendations

---

## AI Domain

Responsibilities:

* AI gateway
* Prompt management
* Provider orchestration

---
# Backend Architecture

## Architectural Style

CrowdMind follows:

```text
Modular Monolith
+
Domain Driven Design
+
Clean Architecture
```

The system is deployed as a single application but internally separated into independent business modules.

---

# Backend Folder Structure

```text
backend/

├── app/
│
├── modules/
│   ├── auth/
│   ├── users/
│   ├── questions/
│   ├── discussions/
│   ├── faqs/
│   ├── knowledge/
│   ├── moderation/
│   ├── analytics/
│   ├── notifications/
│   ├── search/
│   └── ai/
│
├── core/
│
├── infrastructure/
│
├── database/
│
├── tests/
│
└── migrations/
```

---

# Module Internal Structure

Every module follows the same structure.

Example:

```text
modules/discussions/

├── api/
├── services/
├── repositories/
├── schemas/
├── models/
├── domain/
├── events/
└── tests/
```

---

# Layered Architecture

Each module contains 5 major layers.

---

## API Layer

Responsibilities:

* Receive HTTP requests
* Validate requests
* Call services
* Return responses

Contains:

```text
routers
controllers
dto
request schemas
response schemas
```

Rule:

NO business logic.

---

## Service Layer

Responsibilities:

* Business workflows
* Use cases
* Orchestration

Examples:

```text
CreateDiscussion

GenerateFAQCandidate

PublishFAQ

ResolveReport
```

Rule:

All business logic lives here.

---

## Repository Layer

Responsibilities:

* Database communication

Rule:

No business rules.

Only data access.

---

## Domain Layer

Responsibilities:

* Domain entities
* Domain rules
* Domain events

Examples:

```text
Discussion

FAQ

Reputation

Report
```

---

## Infrastructure Layer

Responsibilities:

External systems.

Examples:

```text
Gemini

Groq

Redis

Email

Storage
```

---

# Dependency Rules

Allowed:

```text
API
 ↓
Service
 ↓
Repository
 ↓
Database
```

Allowed:

```text
Service
 ↓
Infrastructure
```

Forbidden:

```text
API
 ↓
Database
```

Forbidden:

```text
Repository
 ↓
Gemini
```

Forbidden:

```text
UI
 ↓
Database
```

---

# Request Lifecycle

Example:

Create Discussion

```text
User
 ↓
API Endpoint
 ↓
Validation
 ↓
Discussion Service
 ↓
Repository
 ↓
PostgreSQL
 ↓
Response
```

---

# Example Workflow

Ask Question

```text
User
 ↓
Question Endpoint
 ↓
Question Service
 ↓
Question Repository
 ↓
Database

 ↓

AI Analysis Service
 ↓
AI Gateway
 ↓
Gemini

 ↓

Analysis Result
 ↓
Response
```

---

# Event Driven Design

CrowdMind uses domain events.

Purpose:

Reduce coupling.

---

## Example

Discussion Created

```text
Discussion Created
        ↓
Notification Service
        ↓
Analytics Service
        ↓
AI Monitoring
```

Without services directly depending on each other.

---

# Event Types

DiscussionCreated

QuestionCreated

FAQCandidateGenerated

FAQPublished

ReportSubmitted

ReportResolved

ReputationChanged

KnowledgeUpdated

---

# Frontend Architecture

## Philosophy

Frontend follows:

Feature First Architecture

NOT page-first architecture.

---

# Frontend Folder Structure

```text
frontend/src/

├── app/
├── components/
├── features/
├── hooks/
├── services/
├── stores/
├── providers/
├── types/
└── utils/
```

---

# Feature Structure

Example:

```text
features/discussions/

├── components/
├── hooks/
├── api/
├── types/
├── pages/
├── validations/
└── services/
```

Every feature owns its code.

---

# Shared Components

Location:

```text
components/
```

Contains:

Buttons

Modals

Tables

Forms

Dialogs

Cards

Layout Components

---

# State Management

Technology:

Zustand

---

## Global State

Only:

Authentication

Theme

Notifications

User Session

---

## Local State

Remain inside components.

Avoid unnecessary global stores.

---

# Data Fetching

Preferred:

TanStack Query

Responsibilities:

* Caching
* Refetching
* Retry Logic
* Background Updates

---

# Form Management

Technology:

React Hook Form

Validation:

Zod

---

# Routing Architecture

Next.js App Router

Structure:

```text
app/

faq/

discussion/

profile/

admin/

settings/
```

---

# Access Control

Public Routes

```text
/
faq
faq/[id]
discussion
discussion/[id]
knowledge
```

Protected Routes

```text
ask-question

create-discussion

saved

notifications
```

Admin Routes

```text
/admin
/admin/faqs
/admin/moderation
/admin/analytics
```

---

# Frontend Design Rules

Rule 1

No direct API calls inside components.

Use service layer.

---

Rule 2

No business logic inside UI.

---

Rule 3

Keep components small.

Maximum:

~200 lines preferred.

---

Rule 4

Extract reusable components early.

---

Rule 5

Prefer composition over inheritance.

---

# API Communication Pattern

Frontend

```text
Page
 ↓
Feature Service
 ↓
API Client
 ↓
Backend
```

Never:

```text
Page
 ↓
fetch()
 ↓
Backend
```

directly.

---

# Error Handling Strategy

Backend:

Structured Error Responses

Frontend:

Global Error Boundary

Feature Error Boundary

Toast Notifications

Fallback UI

---

# Logging Strategy

Backend:

Structured JSON Logging

Frontend:

Error Tracking Only

Using:

Sentry

---

# Architecture Goals

The architecture must optimize for:

* Maintainability
* Scalability
* Testability
* Security
* Developer Experience
* Long-Term Evolution

Every engineering decision should favor clarity and maintainability over short-term convenience.
# Database Architecture

## Database Philosophy

CrowdMind treats knowledge as a first-class entity.

The database is designed to support:

* Traceability
* Knowledge Evolution
* Reputation Tracking
* Moderation History
* Analytics
* Auditability

Every important action must be reconstructable.

---

# Database Strategy

Primary Database:

PostgreSQL

Vector Search:

pgvector

Migration Tool:

Alembic

ORM:

SQLAlchemy

---

# Core Database Domains

```text
Users
Questions
Discussions
Replies
Votes
FAQ Candidates
Published FAQs
FAQ Versions
Knowledge Evolution
Reports
Moderation Actions
Notifications
Saved Knowledge
Reputation
Analytics
```

---

# User Domain

## Users Table

Purpose:

Identity Management

Stores:

* Clerk ID
* Username
* Email
* Profile Data
* Reputation Score
* Role

---

## User Roles

```text
VISITOR

USER

TRUSTED_CONTRIBUTOR

MODERATOR

ADMIN
```

---

# Question Domain

## Questions Table

Stores:

* Title
* Description
* Category
* Creator
* AI Analysis Status

Relationships:

```text
Question
    ↓
Discussion
```

---

# Discussion Domain

## Discussions Table

Stores:

* Discussion Metadata
* Status
* Engagement Metrics

---

## Replies Table

Stores:

* Answers
* Comments
* Nested Responses

Supports:

```text
Parent Reply
      ↓
Child Reply
```

for threaded conversations.

---

## Votes Table

Stores:

* Upvotes
* Downvotes
* Agreement Signals

Used by:

* Reputation Engine
* Consensus Engine

---

# FAQ Domain

## FAQ Candidates

Purpose:

AI-generated draft knowledge.

States:

```text
PENDING

UNDER_REVIEW

APPROVED

REJECTED
```

---

## Published FAQs

Purpose:

Official knowledge artifacts.

Stores:

* Content
* Sources
* Confidence Scores
* Contributors

---

## FAQ Versions

Purpose:

Knowledge Evolution

Stores:

* Version Number
* Change Summary
* Source Discussion
* Approval Metadata

---

# Knowledge Evolution Domain

Purpose:

Track knowledge growth.

Example:

```text
FAQ V1
 ↓
Discussion
 ↓
FAQ V2
 ↓
Discussion
 ↓
FAQ V3
```

Knowledge never becomes static.

---

# Moderation Domain

## Reports Table

Stores:

* Reporter
* Target Content
* Report Type
* Severity

---

## Moderation Actions

Stores:

* Warnings
* Suspensions
* Bans
* Escalations

Purpose:

Complete moderation audit trail.

---

# Reputation Domain

## Reputation History

Stores:

* Reputation Changes
* Source Events
* Explanations

Example:

```text
+10
Helpful Answer

+25
FAQ Published

-50
Moderation Violation
```

---

# Notification Domain

Stores:

* Mentions
* Replies
* Reputation Events
* Moderation Updates

---

# Analytics Domain

## Analytics Events

Stores:

* User Activity
* Feature Usage
* Platform Metrics

Event-based design.

---

# Database Standards

Every table must contain:

```sql
id UUID PRIMARY KEY

created_at TIMESTAMP

updated_at TIMESTAMP

deleted_at TIMESTAMP NULL
```

---

# Soft Delete Strategy

Never permanently delete:

* Discussions
* FAQs
* Reports
* Reputation Records

Use:

```sql
deleted_at
```

instead.

---

# AI Gateway Architecture

## Goal

Prevent vendor lock-in.

Business logic must never directly call AI providers.

---

# Architecture

```text
Application Layer
        ↓
AI Gateway
        ↓
Provider Adapters
        ↓
Gemini / Groq
```

---

# AI Gateway Responsibilities

Request Routing

Prompt Management

Retry Logic

Provider Selection

Response Validation

Fallback Handling

Monitoring

---

# AI Services

## Question Analysis Service

Tasks:

* Duplicate Detection
* Similar FAQ Search
* Categorization

---

## Discussion Summarization Service

Tasks:

* Summaries
* Key Takeaways

---

## FAQ Generation Service

Tasks:

* Candidate Creation
* Structured Knowledge Drafting

---

## Knowledge Evolution Service

Tasks:

* Version Suggestions
* Knowledge Updates

---

# Provider Selection Strategy

Default:

Gemini

Fallback:

Groq

Future:

OpenAI

Claude

Self-hosted Models

---

# Prompt Management

Prompts must never be hardcoded.

Structure:

```text
prompts/

question_analysis/

faq_generation/

discussion_summary/

knowledge_evolution/
```

Version controlled.

---

# Search Architecture

## Search Layers

### Layer 1

Keyword Search

---

### Layer 2

Full Text Search

PostgreSQL FTS

---

### Layer 3

Semantic Search

pgvector

---

# Search Workflow

```text
User Query
      ↓
Keyword Search
      ↓
Vector Search
      ↓
Ranking Engine
      ↓
Results
```

---

# Search Ranking Factors

Relevance

Community Trust

Recency

FAQ Quality

Engagement

Reputation Signals

---

# Recommendation Engine

Generates:

Related FAQs

Related Discussions

Suggested Knowledge

---

# Caching Strategy

Technology:

Redis

---

# Cache Categories

## FAQ Cache

Purpose:

Fast knowledge delivery.

TTL:

24 Hours

---

## Search Cache

Purpose:

Repeated searches.

TTL:

15 Minutes

---

## Analytics Cache

Purpose:

Dashboard performance.

TTL:

5 Minutes

---

## User Cache

Purpose:

Profile optimization.

TTL:

30 Minutes

---

# Cache Invalidation

Invalidate when:

FAQ Updated

Discussion Updated

Knowledge Published

User Updated

---

# RBAC Architecture

Role Based Access Control

---

# Roles

Visitor

User

Trusted Contributor

Moderator

Admin

---

# Permissions Matrix

Visitor

```text
Read Only
```

---

User

```text
Create Discussions
Vote
Comment
Save Knowledge
```

---

Trusted Contributor

```text
Enhanced Validation
Higher Trust Signals
```

---

Moderator

```text
Review FAQ Candidates
Moderate Content
Resolve Reports
```

---

Admin

```text
Full Platform Control
```

---

# Authorization Strategy

Backend enforces authorization.

Frontend only improves UX.

Never trust frontend permissions.

---

# Moderation System Design

## Multi-Layer Moderation

Layer 1:

AI Detection

Layer 2:

Community Reporting

Layer 3:

Human Moderation

---

# Investigation Workflow

```text
Report
 ↓
AI Risk Analysis
 ↓
Moderation Queue
 ↓
Investigation
 ↓
Decision
 ↓
Audit Trail
```

---

# Enforcement Actions

Warning

Content Removal

Temporary Suspension

Permanent Ban

Escalation

---

# Moderation Principles

Fairness

Transparency

Consistency

Traceability

---

# Analytics Architecture

## Event Driven Design

Every important action generates an event.

Examples:

Discussion Created

FAQ Published

Question Asked

Report Submitted

Knowledge Updated

---

# Analytics Pipeline

```text
Application Event
        ↓
Event Collector
        ↓
Analytics Store
        ↓
Dashboard
```

---

# Analytics Categories

Growth

Community

Knowledge

AI

Moderation

System Health

---

# Strategic Recommendation Engine

Uses analytics data to generate:

* Growth Suggestions
* Community Health Alerts
* Knowledge Gaps
* Moderation Insights

---

# Scalability Objectives

Current Architecture Target:

```text
100K+ Users

1M+ Discussions

1M+ FAQs

Millions of Events
```

without major redesign.

This architecture intentionally optimizes for long-term maintainability, future AI expansion, and knowledge evolution rather than short-term feature velocity.
# Deployment Architecture

## Deployment Philosophy

CrowdMind should be deployable by:

* Student teams
* Startups
* Enterprises

The architecture should support:

* Low-cost MVP deployment
* Production SaaS deployment
* Future scaling

without requiring architectural rewrites.

---

# Production Deployment Topology

```text
                        Internet
                            │
                            ▼

                    ┌─────────────┐
                    │   Vercel    │
                    │  Frontend   │
                    └──────┬──────┘
                           │
                           ▼

                    ┌─────────────┐
                    │   Railway   │
                    │   FastAPI   │
                    └──────┬──────┘
                           │

      ┌────────────────────┼────────────────────┐

      ▼                    ▼                    ▼

┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ PostgreSQL  │    │    Redis    │    │  Supabase   │
│ + pgvector  │    │   Cache     │    │   Storage   │
└─────────────┘    └─────────────┘    └─────────────┘

                           │
                           ▼

                    ┌─────────────┐
                    │ AI Gateway  │
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐

              ▼                         ▼

       Google Gemini               Groq API
```

---

# Environment Strategy

## Development

Purpose:

Local development.

Components:

* Local Frontend
* Local Backend
* Local PostgreSQL
* Local Redis

---

## Staging

Purpose:

Integration testing.

Used for:

* QA
* UAT
* Internal testing

---

## Production

Purpose:

Live platform.

Requirements:

* Monitoring
* Backups
* Security
* Performance Tracking

---

# Environment Variables

Never hardcode secrets.

Store:

```env
DATABASE_URL

REDIS_URL

CLERK_SECRET_KEY

CLERK_PUBLISHABLE_KEY

GEMINI_API_KEY

GROQ_API_KEY

SUPABASE_URL

SUPABASE_KEY

SENTRY_DSN

POSTHOG_KEY
```

---

# CI/CD Architecture

## Source Control

GitHub

---

# Branch Strategy

```text
main

develop

feature/*

fix/*

hotfix/*
```

---

# Pull Request Workflow

Developer
↓
Feature Branch
↓
Pull Request
↓
Review
↓
Automated Checks
↓
Merge

---

# Automated Checks

Every PR must run:

Lint

Type Check

Unit Tests

Security Checks

Build Verification

---

# Deployment Workflow

```text
Push
 ↓
GitHub
 ↓
CI Pipeline
 ↓
Tests
 ↓
Build
 ↓
Deploy
```

---

# Monitoring & Observability

## Philosophy

If a system cannot be observed,
it cannot be trusted.

---

# Monitoring Stack

## Sentry

Purpose:

Error Tracking

Tracks:

* Backend Errors
* Frontend Errors
* Exceptions
* Stack Traces

---

## PostHog

Purpose:

Product Analytics

Tracks:

* User Behavior
* Feature Usage
* Growth Metrics

---

# Logging Strategy

Use structured logging.

Format:

JSON

Example:

```json
{
  "event": "faq_published",
  "faq_id": "123",
  "user_id": "456",
  "timestamp": "..."
}
```

---

# Log Categories

Application Logs

Audit Logs

Security Logs

AI Logs

Analytics Logs

---

# Security Architecture

## Security Philosophy

Security is a feature.

Not an afterthought.

---

# Authentication Security

Provider:

Clerk

Responsibilities:

* Session Management
* MFA
* Social Login
* Password Security

---

# Authorization Security

Backend enforced.

Never rely on frontend checks.

---

# Input Validation

Every request must be validated.

Tools:

Pydantic

Zod

---

# API Security

Requirements:

Rate Limiting

Request Validation

Role Validation

Audit Logging

---

# Application Security

Protect against:

Cross Site Scripting (XSS)

Cross Site Request Forgery (CSRF)

SQL Injection

Credential Stuffing

Spam Attacks

Prompt Injection

---

# AI Security

## AI Risks

Hallucinations

Prompt Injection

Data Leakage

Model Abuse

---

# AI Mitigation Strategy

AI is never the source of truth.

AI outputs require:

Community Validation

Moderator Review

Traceability

---

# Data Security

Sensitive Data:

Encrypted at rest.

Encrypted in transit.

Use HTTPS everywhere.

---

# Backup Strategy

## Database Backups

Frequency:

Daily

Retention:

30 Days

---

## Storage Backups

Frequency:

Daily

Retention:

30 Days

---

## Disaster Recovery Goal

RPO:

24 Hours

RTO:

4 Hours

Definitions:

RPO = Maximum acceptable data loss.

RTO = Maximum acceptable downtime.

---

# Testing Strategy

## Philosophy

Testing is mandatory.

Not optional.

---

# Testing Pyramid

```text
          E2E
           ▲

      Integration
           ▲

         Unit
```

---

# Unit Tests

Purpose:

Validate business logic.

Target Coverage:

80%+

---

# Integration Tests

Purpose:

Validate service interactions.

Examples:

* API + Database
* API + Redis
* API + AI Gateway

---

# End-to-End Tests

Purpose:

Validate complete user workflows.

Examples:

Question
↓
Discussion
↓
FAQ Candidate
↓
Published FAQ

---

# Test Categories

Authentication Tests

Authorization Tests

Discussion Tests

FAQ Tests

Moderation Tests

Analytics Tests

AI Tests

---

# Performance Strategy

## Backend Goals

Average API Response:

< 300 ms

---

# Search Goals

Search Response:

< 500 ms

---

# Page Load Goals

Largest Contentful Paint:

< 2.5 Seconds

---

# AI Goals

Question Analysis:

< 5 Seconds

Discussion Summary:

< 10 Seconds

---

# Future Scalability Strategy

## Current Architecture

Modular Monolith

---

## Future Architecture

When required:

```text
Modular Monolith

       ↓

Microservices
```

---

# Extraction Candidates

Most likely future services:

AI Service

Search Service

Analytics Service

Notification Service

---

# Migration Rule

Never build premature microservices.

Extract only when:

* Team size grows
* Traffic increases
* Operational needs justify it

---

# Architecture Decision Records (ADR)

All major architectural decisions must be documented.

Location:

```text
docs/adr/
```

---

# ADR Format

Example:

```text
ADR-001

Title:
Use Modular Monolith

Status:
Accepted

Context:
Need scalable MVP architecture

Decision:
Adopt Modular Monolith

Consequences:
Simpler deployment
Future service extraction
```

---

# Engineering Success Criteria

CrowdMind architecture is considered successful if:

* New developers onboard quickly.
* Features can be added safely.
* Knowledge remains traceable.
* AI providers can be replaced.
* Platform scales without rewrites.
* Documentation remains synchronized with code.
* Business rules remain independent from frameworks.

---

# Final Architecture Statement

CrowdMind is designed as a production-grade knowledge evolution platform.

The architecture prioritizes:

* Maintainability
* Scalability
* Security
* Traceability
* AI Flexibility
* Community Trust

Every future engineering decision must align with these principles.

This document serves as the definitive technical architecture reference for the CrowdMind platform.


---

# Phase 6.5+ Architecture Additions

## New Services (under `backend/app/services/`)

```
backend/app/services/
├── ai_provider.py     # Provider-agnostic AI gateway (Gemini → Groq fallback)
├── consensus.py       # Weighted consensus scoring (0-100)
├── synthesis.py       # FAQ candidate generation from discussions
├── evolution.py       # Version timeline, events, diff, rollback
├── faqs.py            # (existing) Updated to record evolution events
└── discussions.py     # (existing) Updated to trigger synthesis on accept-reply
```

## New API Router

```
backend/app/api/evolution.py   # 7 endpoints:
  GET    /evolution/timeline/{faq_id}
  GET    /evolution/events
  GET    /evolution/diff/{faq_id}?from=&to=
  GET    /faqs/{faq_id}/versions
  POST   /faqs/{faq_id}/rollback              (admin)
  POST   /discussions/{id}/synthesize         (admin)
  POST   /admin/analysis/cache/flush-all      (admin)
  DELETE /admin/analysis/cache/{question_id}  (admin)
```

## Frontend Service

```
web/src/services/api/evolution.ts   # TypeScript client for /evolution/*
```

## New UI Page

```
web/src/pages/user/EvolutionPage.tsx  # Public timeline + admin-only diff/rollback
```

## Database Tables (no migrations needed — tables existed)

- `faq_versions` — version history (extended with `updated_at`, `updated_by`, `deleted_at`)
- `faq_evolution_events` — event log (extended with same audit fields)
- `reputation_history` — used for consensus calculation
- `discussions`, `replies`, `votes` — read for consensus scoring

## Frontend Contract: `data-cm-*` attributes

Every dynamic DOM injection is gated on a `data-cm-*` attribute present in the source Stitch template. The `npm run stitch:extract` step regenerates `web/src/stitch-content/*.ts` from `web/public/stitch-ref/*.html`, so all dynamic hooks must live in the `.html` files.

Total `data-cm-*` attribute contract coverage (after Phase 6.9):

| File | Count |
|---|---|
| 03-faq-detail.html | 61 |
| 08-thread.html | 28 |
| 10-profile.html | 16 |
| 12-saved.html | 3 |
| 14-evolution.html | 26 |
| 18-analytics.html | 59 |
| **Total** | **193** |

