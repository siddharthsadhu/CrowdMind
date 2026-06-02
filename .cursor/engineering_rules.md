# CrowdMind Engineering Rules

Version: 1.0

Status: Active

Purpose:

This document defines mandatory engineering standards for CrowdMind.

Cursor must follow these rules whenever generating:

* Backend Code
* Frontend Code
* Database Schemas
* APIs
* Tests
* Infrastructure

These rules take precedence over convenience.

---

# Core Engineering Philosophy

Priority Order:

1. Correctness
2. Security
3. Maintainability
4. Scalability
5. Performance

Never sacrifice architecture quality for speed.

---

# Golden Rule

Every piece of code should be easy to:

* Understand
* Test
* Replace
* Extend
* Debug

---

# Architecture Rules

## Rule A1

Follow Modular Monolith Architecture.

Never create random folders.

Every feature belongs to a domain.

---

## Rule A2

Business logic must live in Services.

Forbidden:

```python
router -> business logic
```

Required:

```python
router
 ↓
service
 ↓
repository
 ↓
database
```

---

## Rule A3

Repositories own persistence.

Services own business logic.

Controllers own request handling.

Never mix responsibilities.

---

## Rule A4

Never create God Classes.

Maximum Responsibility:

One clear purpose per class.

---

# Naming Rules

## Classes

Use:

```python
CreateDiscussionService

PublishFAQService

ResolveReportService
```

Never:

```python
Manager

Helper

Processor

Utils
```

---

## Functions

Use verbs.

Good:

```python
create_discussion()

publish_faq()

resolve_report()
```

Bad:

```python
discussion()

faq()

report()
```

---

## Variables

Must be descriptive.

Good:

```python
discussion_id

published_faq

user_reputation
```

Bad:

```python
d

obj

temp

x
```

---

# Python Standards

## Python Version

Minimum:

```text
Python 3.12
```

---

## Type Hints

Required.

Bad:

```python
def create(data):
```

Good:

```python
def create(data: DiscussionCreateDTO) -> Discussion:
```

---

## Pydantic

Required for:

Requests

Responses

Configuration

Validation

---

## Exceptions

Never swallow exceptions.

Bad:

```python
try:
    ...
except:
    pass
```

Forbidden.

---

Good:

```python
try:
    ...
except ValidationError as exc:
    logger.exception(exc)
    raise
```

---

# FastAPI Rules

## Routers

Routers must:

* Validate
* Delegate
* Respond

Nothing else.

---

## Dependency Injection

Required.

Never instantiate services manually inside routes.

Bad:

```python
service = DiscussionService()
```

---

Use:

```python
Depends(...)
```

---

## Response Models

Required.

Every endpoint must return typed responses.

---

# Database Rules

## Primary Keys

Always:

```sql
UUID
```

Never:

```sql
SERIAL
INT
```

---

## Timestamps

Required:

created_at

updated_at

---

## Soft Deletes

Required:

deleted_at

for business entities.

---

## Foreign Keys

Always define relationships explicitly.

---

## Indexes

Add indexes for:

* Search fields
* Foreign keys
* Frequently queried columns

---

# SQL Rules

Use:

SQLAlchemy ORM

Avoid raw SQL.

Use raw SQL only when:

* Performance justified
* Documented

---

# Migration Rules

Every schema change requires:

Alembic migration.

Never modify production schema manually.

# Frontend Engineering Rules

## Frontend Philosophy

The frontend exists to:

* Present information
* Collect user input
* Trigger business workflows

The frontend does NOT own business logic.

Business logic belongs to backend services.

---

# Next.js Rules

## Framework Version

Required:

```text
Next.js 15+
```

Use:

App Router

Do not use Pages Router.

---

## Route Structure

Organize by domain.

Good:

```text
app/

faq/
discussion/
profile/
admin/
settings/
```

Bad:

```text
app/

page1/
page2/
page3/
```

---

## Server Components

Default:

Server Components

Use Client Components only when required.

Examples:

* Forms
* Local State
* Browser APIs

---

## Data Fetching

Preferred:

TanStack Query

Never scatter fetch requests across components.

Required Pattern:

```text
Component
 ↓
Feature Service
 ↓
API Client
 ↓
Backend
```

---

# React Rules

## Component Size

Target:

< 200 lines

Hard Limit:

500 lines

If exceeded:

Refactor.

---

## Component Responsibility

One component.

One purpose.

Bad:

```tsx
DiscussionPage
 ├── Fetching
 ├── Business Logic
 ├── Voting Logic
 ├── Moderation Logic
 └── Rendering
```

Good:

```tsx
DiscussionPage

DiscussionHeader
DiscussionContent
DiscussionActions
DiscussionReplies
```

---

## Props

Prefer explicit props.

Avoid:

```tsx
any
```

Use:

```tsx
DiscussionCardProps
```

---

## State

Keep state local whenever possible.

Do NOT create global state for:

* Modal visibility
* Form fields
* UI toggles

---

# TypeScript Rules

## Strict Mode

Required.

Never disable.

---

## Any

Forbidden.

Bad:

```ts
const data: any
```

Use:

```ts
DiscussionResponse
FAQResponse
UserProfile
```

---

## Shared Types

Location:

```text
types/
```

Shared across features.

---

## Enums

Prefer enums for:

Roles

Statuses

Permissions

Workflow States

---

# State Management Rules

## Technology

Zustand

---

## Global State Allowed

Authentication

Theme

User Session

Notifications

---

## Global State Forbidden

Forms

Temporary UI State

Modal Visibility

Component State

---

# Form Rules

## Technology

React Hook Form

Validation:

Zod

---

## Validation

Validate:

Frontend

AND

Backend

Never trust frontend validation alone.

---

# UI Component Rules

## Design System

Use:

ShadCN UI

---

## Styling

Use:

Tailwind CSS

Avoid:

Custom CSS files unless necessary.

---

## Component Reuse

Before creating:

Search existing components.

Prefer:

Reuse

Over

Duplication

---

# Accessibility Rules

Required:

Keyboard Navigation

Focus States

ARIA Labels

Semantic HTML

Screen Reader Support

Color Contrast Compliance

---

# API Communication Rules

## API Layer

Create dedicated clients.

Bad:

```tsx
fetch(...)
```

inside components.

---

Good:

```text
services/
 ↓
api/
 ↓
backend
```

---

## Error Handling

Every request must handle:

Loading

Success

Failure

Retry

Timeout

---

# Table Rules

All tables should support:

Sorting

Filtering

Pagination

Empty States

Loading States

Error States

---

# Search Rules

Search UI should support:

Debouncing

Loading Indicators

No Results State

Error State

Recent Searches (future)

---

# Notifications Rules

Support:

Unread State

Read State

Bulk Mark Read

Pagination

---

# Admin UI Rules

Admin pages require:

Permission Checks

Audit Visibility

Action Confirmations

Role Validation

---

# Responsive Design Rules

Support:

Mobile

Tablet

Desktop

Large Screens

---

# Mobile First

Design:

Mobile First

Enhance upward.

Do not design desktop only.

---

# Loading States

Every async action requires:

Skeleton

Spinner

Progress Indicator

or equivalent.

Never leave users guessing.

---

# Empty States

Every screen requires:

Empty State

Example:

No FAQs Found

No Discussions Yet

No Saved Knowledge

---

# Error States

Every screen requires:

User Friendly Error State

Retry Action

Recovery Path

---

# UI Performance Rules

Use:

Lazy Loading

Code Splitting

Dynamic Imports

Image Optimization

---

# SEO Rules

Public Pages Must Include:

Title

Description

Open Graph Tags

Structured Metadata

Examples:

FAQ Pages

Repository Pages

Discussion Pages

Landing Page

---

# Frontend Testing Rules

Required:

Component Tests

Hook Tests

Feature Tests

Critical Flow Tests

---

# Frontend Success Criteria

Frontend is complete only when:

✓ Fully Typed

✓ Responsive

✓ Accessible

✓ Error Handled

✓ Loading States Present

✓ Empty States Present

✓ Tested

✓ Reusable

✓ Documented

If any item is missing:

Frontend feature is not complete.
# Testing Standards

## Testing Philosophy

Testing is not optional.

If code is important enough to exist,
it is important enough to test.

---

# Testing Pyramid

```text
            E2E
             ▲

       Integration
             ▲

          Unit
```

Most tests should be:

Unit Tests

Fewer:

Integration Tests

Even fewer:

End-to-End Tests

---

# Unit Testing Rules

Required For:

Services

Domain Logic

Validators

Utilities

Permission Logic

Reputation Logic

Consensus Logic

---

## Unit Test Requirements

Every test should follow:

```text
Arrange
Act
Assert
```

Pattern.

---

# Integration Testing Rules

Required For:

Database Access

Redis

AI Gateway

Authentication

Storage

Search

---

## Example

```text
API
 ↓
Service
 ↓
Repository
 ↓
Database
```

Validate complete interaction.

---

# End-To-End Testing Rules

Required User Flows:

Question
↓
Discussion
↓
FAQ Candidate
↓
Published FAQ

---

Authentication

Login
↓
Protected Action
↓
Success

---

Moderation

Report
↓
Review
↓
Decision

---

# Test Coverage Targets

Backend:

Minimum:

80%

Target:

90%+

---

Frontend:

Critical User Flows:

100%

---

# Security Standards

## Security Philosophy

Assume:

Every request is malicious until validated.

---

# Authentication Rules

Never:

Trust client state.

Always:

Validate server-side.

---

# Authorization Rules

Backend must enforce:

RBAC

Never rely on:

Frontend permissions.

---

# Input Validation Rules

Validate:

Headers

Query Parameters

Request Body

File Uploads

AI Inputs

Search Inputs

---

# Secrets Management

Forbidden:

```python
API_KEY = "abc123"
```

Never commit secrets.

Use:

Environment Variables

Secret Managers

---

# File Upload Rules

Validate:

Type

Size

Content

Virus Scanning (future)

---

# Rate Limiting Rules

Required For:

Authentication

Search

AI Requests

Discussion Creation

Voting

Reporting

---

# Audit Logging

Required For:

Role Changes

FAQ Publication

Moderation Actions

User Suspensions

System Configuration

---

# AI Development Standards

## AI Philosophy

AI assists.

Humans govern.

---

# AI Rules

Never allow AI to:

Publish FAQs

Suspend Users

Ban Users

Change Roles

Delete Knowledge

Without human review.

---

# Prompt Engineering Standards

Prompts are code.

Treat prompts like source code.

---

## Prompt Requirements

Versioned

Reviewed

Documented

Tested

Stored Separately

---

# Prompt Storage

```text
prompts/

question_analysis/

faq_generation/

discussion_summary/

knowledge_evolution/
```

---

# AI Output Validation

Every AI response should be:

Validated

Parsed

Structured

Logged

---

# Hallucination Prevention

Prioritize:

Discussion Content

Community Consensus

Existing FAQs

Supporting Evidence

Only then:

LLM Reasoning

---

# AI Gateway Rules

All AI requests must flow through:

```text
Application
 ↓
AI Gateway
 ↓
Provider
```

Never:

```text
Service
 ↓
Gemini
```

directly.

---

# Git Standards

## Branch Strategy

```text
main

develop

feature/*

fix/*

hotfix/*
```

---

# Commit Standards

Use Conventional Commits.

Examples:

```bash
feat: add FAQ publishing workflow

fix: resolve duplicate discussion creation

docs: update architecture documentation

refactor: simplify moderation service

test: add FAQ generation tests

perf: optimize semantic search
```

---

# Pull Request Standards

Every PR must contain:

## Problem

What issue is being solved?

---

## Solution

How was it solved?

---

## Testing

How was it verified?

---

## Documentation

What documentation changed?

---

# PR Size Rule

Preferred:

< 500 lines

Avoid:

Massive PRs

---

# Documentation Standards

## Documentation Philosophy

Documentation is part of the product.

Not an afterthought.

---

# Required Updates

Whenever changing:

Architecture

Database

API

AI Workflow

Authentication

Moderation

Update documentation.

---

# Documentation Files

Required Repository Files:

```text
README.md

context.md

ARCHITECTURE.md

DATABASE.md

API_SPEC.md

AI_ARCHITECTURE.md

DEPLOYMENT.md

ROADMAP.md

CONTRIBUTING.md

SECURITY.md

CHANGELOG.md

TEAM.md
```

---

# Code Review Checklist

Reviewers must verify:

Architecture

Security

Performance

Readability

Testing

Documentation

Error Handling

Typing

Accessibility

---

# Definition Of Ready (DoR)

A task is ready when:

✓ Requirements Clear

✓ Acceptance Criteria Defined

✓ Dependencies Known

✓ Architecture Understood

✓ Security Considered

---

# Definition Of Done (DoD)

A task is complete only when:

✓ Code Implemented

✓ Tests Written

✓ Types Added

✓ Validation Added

✓ Logging Added

✓ Documentation Updated

✓ Error Handling Present

✓ Security Reviewed

✓ Code Reviewed

✓ Merged Successfully

---

# Anti-Patterns

The following are forbidden.

---

## God Components

Bad:

```tsx
DiscussionPage.tsx

2000+ lines
```

---

## God Services

Bad:

```python
KnowledgeManagerService
```

that handles everything.

---

## Business Logic In UI

Forbidden.

---

## Direct Database Access From Controllers

Forbidden.

---

## Direct AI Calls From Services

Forbidden.

Must use AI Gateway.

---

## Massive Utility Files

Bad:

```text
utils.py

helpers.py
```

containing unrelated logic.

---

## Premature Microservices

Forbidden.

Current architecture:

Modular Monolith.

---

## Hardcoded Values

Bad:

```python
if role == "admin":
```

Use constants/enums.

---

## Silent Failures

Forbidden.

Never:

```python
except:
    pass
```

---

# Engineering Success Criteria

CrowdMind engineering is successful when:

New developers can onboard quickly.

Features can be added safely.

Architecture remains understandable.

Documentation remains synchronized.

Business logic remains isolated.

AI providers can be replaced.

Knowledge remains traceable.

System scales without major rewrites.

---

# Final Cursor Directive

When generating code for CrowdMind:

Always optimize for:

1. Correctness
2. Security
3. Maintainability
4. Scalability
5. Developer Experience

Never optimize for:

* Shortcuts
* Temporary hacks
* Architecture violations

If uncertain:

Follow:

context.md
↓
ARCHITECTURE.md
↓
project_context.md
↓
engineering_rules.md

in that order.

These documents are the source of truth for the entire codebase.
