# CrowdMind - Cursor Project Context

Version: 1.0

Purpose:

This document provides condensed project intelligence for Cursor.

Cursor must use this file as the primary project memory when generating code.

This document takes precedence over assumptions.

If uncertainty exists:

Follow this document.

---

# Project Identity

Project Name:

CrowdMind

Category:

Knowledge Evolution Platform

Type:

Production SaaS Application

Status:

Active Development

Architecture Status:

Frozen

---

# What CrowdMind Is

CrowdMind is an AI-assisted knowledge evolution platform.

The platform transforms:

Question
↓
Discussion
↓
Consensus
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

The platform is NOT:

* A discussion forum
* A FAQ website
* A Reddit clone
* A Stack Overflow clone

It borrows ideas from those systems but introduces knowledge evolution as the primary concept.

---

# Core Mission

Convert community intelligence into:

* Structured
* Searchable
* Traceable
* Continuously evolving

knowledge.

---

# Product Principles

These principles are mandatory.

---

## Principle 1

Knowledge should be public.

Reading must not require authentication.

---

## Principle 2

Participation requires identity.

Creating knowledge requires authentication.

---

## Principle 3

AI assists.

Community validates.

Moderators govern.

---

## Principle 4

Every knowledge artifact must be traceable.

---

## Principle 5

Knowledge must evolve.

No static knowledge.

---

# Authentication Rules

Anonymous Users Can:

* Read FAQs
* Browse repository
* Search knowledge
* Read discussions
* View profiles
* View knowledge evolution

Anonymous Users Cannot:

* Ask questions
* Create discussions
* Vote
* Save knowledge
* Comment

---

# User Roles

VISITOR

USER

TRUSTED_CONTRIBUTOR

MODERATOR

ADMIN

---

# Screen Architecture

User Platform:

01 Landing Page

02 FAQ Repository

03 FAQ Detail

04 Login/Register

05 Ask Question

06 AI Analysis Result

07 Discussion Listing

08 Discussion Thread

09 Create Discussion

10 User Profile

11 Notifications

12 Saved Knowledge

13 My Contributions

14 Knowledge Evolution

---

Admin Platform:

15 Mission Control

16 FAQ Management

17 Moderation Queue

18 Platform Intelligence Center

19 Report Detail

20 Settings & Preferences

---

# FAQ Management Structure

FAQ Management contains:

* Candidate Review
* Published FAQs
* Version History
* Archive

Candidate Review is NOT a separate screen.

Never generate a separate Candidate Review page.

---

# Knowledge Lifecycle

Question
↓
AI Analysis
↓
Discussion
↓
Consensus
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

This workflow is the most important system in the platform.

Do not bypass it.

---

# Reputation System

Purpose:

Trust Measurement

Not Gamification

Levels:

Basic User

Trusted Contributor

Knowledge Curator

Community Expert

Reputation affects permissions.

It is not cosmetic.

---
# Technical Stack

Cursor must assume the following stack unless explicitly changed.

---

## Frontend

Framework:

Next.js 15

Language:

TypeScript

UI Library:

ShadCN UI

Styling:

Tailwind CSS

Forms:

React Hook Form

Validation:

Zod

State Management:

Zustand

Data Fetching:

TanStack Query

---

## Backend

Framework:

FastAPI

Language:

Python 3.12+

Validation:

Pydantic v2

ORM:

SQLAlchemy 2.0

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

---

## Storage

Supabase Storage

---

## Cache

Redis

---

## Monitoring

Sentry

PostHog

---

## AI Providers

Primary:

Google Gemini

Secondary:

Groq

---

# Architectural Constraints

Cursor must respect all architectural boundaries.

---

## Rule 1

Never place business logic inside UI components.

Forbidden:

```tsx
const Component = () => {
  const publishFAQ = () => {
     // business logic
  }
}
```

Business logic belongs inside services.

---

## Rule 2

Never call the database from API routes directly.

Forbidden:

```python
@router.post("/")
def create():
    db.execute(...)
```

Required:

```python
Router
 ↓
Service
 ↓
Repository
 ↓
Database
```

---

## Rule 3

Never directly call Gemini or Groq.

Forbidden:

```python
response = gemini.generate(...)
```

Required:

```python
Service
 ↓
AI Gateway
 ↓
Provider Adapter
 ↓
Gemini/Groq
```

---

## Rule 4

Never bypass repositories.

Forbidden:

```python
Service
 ↓
Database
```

Required:

```python
Service
 ↓
Repository
 ↓
Database
```

---

# Backend Module Boundaries

Cursor must keep modules independent.

---

## Auth Module

Responsibilities:

Authentication only.

Never manage discussions.

Never manage FAQs.

---

## User Module

Responsibilities:

Profiles

Preferences

Achievements

Reputation

---

## Question Module

Responsibilities:

Question creation

Question lifecycle

AI analysis requests

---

## Discussion Module

Responsibilities:

Discussions

Replies

Voting

Consensus Signals

---

## FAQ Module

Responsibilities:

FAQ Candidates

Published FAQs

Version History

---

## Knowledge Module

Responsibilities:

Knowledge evolution

Traceability

Version tracking

---

## Moderation Module

Responsibilities:

Reports

Investigations

Enforcement

---

## Analytics Module

Responsibilities:

Metrics

Events

Insights

---

## Notification Module

Responsibilities:

User notifications

Subscriptions

Event delivery

---

## Search Module

Responsibilities:

Keyword search

Semantic search

Recommendations

---

## AI Module

Responsibilities:

Prompt management

Provider orchestration

AI gateway

---

# Data Rules

## UUID Everywhere

All primary keys must use UUID.

Never use incremental IDs.

---

## Timestamps Everywhere

Every entity must contain:

```python
created_at
updated_at
```

---

## Soft Deletes

Required:

```python
deleted_at
```

Never permanently delete critical records.

---

## Auditability

Every important action should be traceable.

Examples:

* FAQ publication
* Report resolution
* Reputation changes
* Role changes

---

# AI Rules

## AI Is Not The Source Of Truth

AI outputs are suggestions.

Community validation and moderation are authoritative.

---

## AI Candidate Workflow

Required:

Discussion
↓
Consensus
↓
AI Candidate
↓
Moderator Review

Never:

Discussion
↓
AI
↓
Published FAQ

---

## Prompt Storage

Prompts must be stored in dedicated files.

Never hardcode prompts inside services.

Required:

```text
prompts/
 ├── faq_generation/
 ├── question_analysis/
 ├── discussion_summary/
 └── knowledge_evolution/
```

---

# Search Rules

Search must support:

Keyword Search

Semantic Search

Vector Search

Related Content

Recommendation Engine

---

# Caching Rules

Use Redis.

Cache:

FAQs

Search Results

Analytics

Profiles

Never cache authorization decisions.

Never cache security-sensitive operations.

---

# Security Rules

Cursor must assume security is mandatory.

Required:

Input Validation

Rate Limiting

RBAC

Audit Logging

Secure Sessions

Encryption In Transit

Encryption At Rest

---

# Things Cursor Must Never Do

Never generate:

* Monolithic services
* God classes
* Massive React components
* Business logic inside pages
* Database queries inside routes
* AI calls inside controllers
* Hardcoded secrets
* Hardcoded API keys
* Hardcoded prompts
* Raw SQL scattered throughout code

---

# Code Generation Preferences

Prefer:

Small Services

Reusable Components

Strong Typing

Dependency Injection

Repository Pattern

Event-Driven Workflows

Feature-Based Organization

---

# Performance Targets

API Response:

< 300ms

Search:

< 500ms

Question Analysis:

< 5 seconds

Discussion Summary:

< 10 seconds

---

# Documentation Requirements

Whenever Cursor creates:

Feature

Module

Service

API

Database Entity

It should also update documentation.

Documentation is not optional.

Documentation is part of the feature.

---

# Definition Of Done

A task is only complete when:

✓ Code Exists

✓ Tests Exist

✓ Types Exist

✓ Validation Exists

✓ Documentation Exists

✓ Error Handling Exists

✓ Logging Exists

✓ Security Reviewed

If any item is missing:

Task is not complete.
# Engineering Philosophy

CrowdMind is a long-term software product.

Engineering decisions must optimize for:

* Maintainability
* Scalability
* Readability
* Testability
* Security
* Developer Experience

Never optimize for:

* Short-term hacks
* Temporary shortcuts
* Premature optimization

---

# Development Philosophy

## Rule 1

Build systems.

Not pages.

Every feature should be viewed as:

```text
Business Capability
```

not:

```text
UI Screen
```

---

## Rule 2

Design before implementation.

Before writing code:

Understand:

* Problem
* Domain
* Data Flow
* User Flow
* Edge Cases

---

## Rule 3

Documentation First

Before implementing major features:

Update:

* context.md
* ARCHITECTURE.md
* API_SPEC.md
* DATABASE.md

when applicable.

---

# Feature Development Workflow

Every feature should follow:

```text
Requirement
    ↓
Architecture
    ↓
Database
    ↓
API
    ↓
Backend Service
    ↓
Frontend Integration
    ↓
Testing
    ↓
Documentation
```

Never start from UI first.

---

# Feature Development Checklist

Before implementing any feature:

## Product Understanding

Understand:

* Why it exists
* User value
* Business value

---

## Architecture Review

Determine:

* Module ownership
* Data ownership
* Dependencies

---

## Security Review

Determine:

* Authentication needs
* Authorization needs
* Abuse risks

---

## Documentation Review

Check:

* Existing architecture
* Existing APIs
* Existing domain rules

---

# UI/UX Constraints

## Design System

Use:

ShadCN UI

Tailwind CSS

---

## Consistency

New UI must match:

* Existing spacing
* Typography
* Component behavior
* Color system

---

## Component Reuse

Before creating a component:

Check:

```text
components/
```

Reuse first.

Create later.

---

## Accessibility

Required:

Keyboard Navigation

Focus States

ARIA Labels

Semantic HTML

Color Contrast

---

# Frontend Rules

## Components

Prefer:

Small Components

Target:

< 200 Lines

---

## Hooks

Extract logic into hooks.

Avoid large components.

---

## Pages

Pages should:

Compose features.

Not contain business logic.

---

## API Access

Use:

Feature Services

Never:

Direct fetch calls scattered across pages.

---

# Backend Rules

## Services

Services own business logic.

Examples:

CreateDiscussionService

PublishFAQService

ResolveReportService

---

## Repositories

Repositories own data access.

Nothing else.

---

## Controllers

Controllers only:

* Validate
* Delegate
* Respond

---

## Models

Models represent persistence.

Do not put business logic inside ORM models.

---

# AI Development Constraints

## AI Is An Assistant

Never allow AI to:

* Publish FAQs
* Moderate content
* Ban users

without human review.

---

## Human Governance Required

Required for:

FAQ Publication

Moderation Decisions

Role Changes

---

## Prompt Engineering

Prompts must:

* Be versioned
* Be reviewed
* Be tested

Treat prompts as code.

---

# Knowledge Integrity Rules

Knowledge must remain:

Traceable

Explainable

Auditable

---

## FAQ Requirements

Every FAQ should contain:

* Sources
* Contributors
* Version History
* Confidence Signals

---

## Evolution Requirements

Every FAQ update should record:

* What changed
* Why it changed
* Source discussion
* Approval information

---

# Repository Conventions

## Naming

Use descriptive names.

Good:

```python
PublishFAQService
```

Bad:

```python
Manager
Helper
Utils
Stuff
```

---

## Files

Prefer:

```text
single responsibility
```

per file.

Avoid giant files.

---

## Imports

Prefer explicit imports.

Avoid wildcard imports.

---

# Testing Standards

## Unit Tests

Required for:

Services

Domain Logic

Utilities

---

## Integration Tests

Required for:

Database

Redis

AI Gateway

---

## End-to-End Tests

Required for:

Critical user journeys.

Examples:

Question
↓
Discussion
↓
FAQ Candidate
↓
Published FAQ

---

# Pull Request Standards

Every Pull Request should answer:

## What changed?

## Why?

## How was it tested?

## What documentation changed?

---

# Code Review Expectations

Review:

Architecture

Security

Performance

Readability

Test Coverage

Documentation

---

# Technical Debt Policy

Technical debt is allowed only when:

* Documented
* Justified
* Scheduled for resolution

Never hide technical debt.

---

# Observability Requirements

Every critical workflow must include:

Logging

Metrics

Error Tracking

Examples:

FAQ Publication

Moderation Actions

AI Requests

Search Requests

Authentication Events

---

# Success Criteria

CrowdMind is successful when:

Users can:

* Find knowledge quickly
* Trust knowledge
* Contribute knowledge

Moderators can:

* Govern efficiently
* Resolve issues quickly

Administrators can:

* Understand platform health
* Measure growth

Engineers can:

* Add features safely
* Understand architecture quickly
* Maintain the system long term

---

# Cursor Instructions

When generating code:

Always prioritize:

1. Correctness
2. Maintainability
3. Security
4. Scalability
5. Readability

Never sacrifice architecture quality for speed.

If multiple implementations are possible:

Choose the solution that best aligns with:

* Clean Architecture
* Domain Driven Design
* Modular Monolith Principles
* CrowdMind Product Philosophy

---

# Final Reminder

CrowdMind is not a CRUD application.

CrowdMind is not a forum.

CrowdMind is not a FAQ website.

CrowdMind is a Knowledge Evolution Platform.

Every design decision, feature, API, service, and database entity should contribute toward transforming community intelligence into trusted, evolving knowledge.
