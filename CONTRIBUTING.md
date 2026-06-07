# Contributing to CrowdMind

Thank you for contributing to CrowdMind.

CrowdMind is a Knowledge Evolution Platform focused on transforming community intelligence into trusted, evolving knowledge.

This document defines contribution standards, development workflow, and repository expectations.

---

# Before You Start

Read:

```text
README.md

context.md

ARCHITECTURE.md

DATABASE.md

API_SPEC.md

AI_ARCHITECTURE.md

.cursor/project_context.md

.cursor/engineering_rules.md
```

before contributing.

These documents are the source of truth.

---

# Contribution Philosophy

We prioritize:

* Correctness
* Maintainability
* Security
* Documentation
* Scalability

over:

* Quick hacks
* Temporary fixes
* Architecture violations

---

# Development Workflow

```text
Issue
 ↓
Discussion
 ↓
Design
 ↓
Implementation
 ↓
Testing
 ↓
Documentation
 ↓
Pull Request
 ↓
Review
 ↓
Merge
```

---

# Branch Naming

Use:

```bash
feature/<feature-name>

fix/<bug-name>

hotfix/<critical-fix>

docs/<documentation-update>

refactor/<module-name>
```

Examples:

```bash
feature/faq-publishing

fix/search-ranking

docs/api-spec

refactor/moderation-service
```

---

# Commit Convention

Use Conventional Commits.

---

## Feature

```bash
feat: add FAQ publishing workflow
```

---

## Fix

```bash
fix: resolve duplicate discussion creation
```

---

## Documentation

```bash
docs: update AI architecture
```

---

## Refactor

```bash
refactor: simplify consensus engine
```

---

## Test

```bash
test: add FAQ service unit tests
```

### Phase 6.5+ Test Suite

23 new pytest cases (added 2026-06-07):

```
backend/tests/test_consensus.py        # 4 cases — weighted consensus scoring
backend/tests/test_synthesis.py        # 4 cases — FAQ candidate generation
backend/tests/test_evolution.py        # 11 cases — timeline, events, diff, rollback
backend/tests/test_question_analysis.py  # 4 cases — force-refresh, cache, fallback
```

Total: 70 cases passing (47 existing + 23 new).

Run: `cd backend && python -m pytest --tb=short -v`

---

## Performance

```bash
perf: optimize semantic search
```

---

# Pull Request Checklist

Before creating a PR:

```text
✓ Code Complete

✓ Tests Added

✓ Types Added

✓ Validation Added

✓ Documentation Updated

✓ Security Considered

✓ No Console Logs

✓ No Dead Code

✓ No Hardcoded Secrets
```

---

# Code Review Standards

Reviewers evaluate:

* Architecture
* Security
* Testing
* Performance
* Documentation
* Readability

---

# Definition Of Ready

A task is ready when:

```text
✓ Requirements Clear

✓ Acceptance Criteria Defined

✓ Dependencies Known

✓ Security Considered
```

---

# Definition Of Done

A task is complete only when:

```text
✓ Code Written

✓ Tests Passing

✓ Documentation Updated

✓ Code Reviewed

✓ Merged Successfully
```

---

# Architecture Rules

Never:

```text
Business Logic In UI

Database Access In Controllers

Direct AI Provider Calls

Massive Components

God Services
```

Always follow:

```text
Router
 ↓
Service
 ↓
Repository
 ↓
Database
```

---

# Documentation Requirement

Every major change must update:

```text
ARCHITECTURE.md

DATABASE.md

API_SPEC.md

AI_ARCHITECTURE.md
```

when applicable.

---

# Final Rule

If documentation and code disagree:

```text
Documentation Must Be Updated
```

before merge.
