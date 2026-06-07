# CrowdMind Security Policy

Version: 1.0

Status: Active

Related Documents:

* ARCHITECTURE.md
* AI_ARCHITECTURE.md
* DATABASE.md
* API_SPEC.md

---

# Purpose

This document defines:

* Security Principles
* Authentication Security
* Authorization Security
* AI Security
* Data Protection
* Vulnerability Reporting
* Incident Response

Security is a product feature.

Not an afterthought.

---

# Security Philosophy

CrowdMind follows:

```text
Zero Trust Principles
```

Assume:

* Every request may be malicious
* Every input may be invalid
* Every integration may fail

Validation must occur at every layer.

---

# Security Objectives

Protect:

* User Accounts
* Knowledge Assets
* Reputation Systems
* Moderation Systems
* AI Infrastructure
* Platform Integrity

---

# Authentication Security

## Authentication Provider

Provider:

```text
Clerk
```

Responsibilities:

* Login
* Registration
* Session Management
* MFA Support
* Password Security
* Social Login

---

# Authentication Rules

Required:

```text
HTTPS Only

JWT Validation

Session Expiration

Secure Cookies
```

---

# Authentication Requirements

All protected endpoints must verify:

```text
User Identity

Session Validity

Token Integrity
```

before execution.

---

# Authorization Security

## Model

Role-Based Access Control (RBAC)

---

# Roles

```text
VISITOR

USER

TRUSTED_CONTRIBUTOR

MODERATOR

ADMIN
```

---

# Authorization Principles

Principle 1

Least Privilege

Users receive minimum permissions required.

---

Principle 2

Server Enforcement

Authorization must be enforced on backend.

Never trust frontend permissions.

---

Principle 3

Auditability

Permission changes must be logged.

---

# Protected Operations

Require elevated permissions:

```text
FAQ Publication

FAQ Approval

User Suspension

User Ban

Role Changes

Analytics Access
```

---

# Input Security

All inputs must be validated.

---

# Validation Layers

```text
Frontend Validation
        ↓
API Validation
        ↓
Business Validation
        ↓
Database Constraints
```

---

# Validate

Required:

```text
Headers

Query Parameters

Path Parameters

Request Bodies

File Uploads

Search Queries

AI Inputs
```

---

# File Upload Security

Validate:

```text
File Type

File Size

File Extension

Content Type
```

---

Future:

```text
Virus Scanning
```

---

# Database Security

## Database Access

Only through:

```text
Repository Layer
```

Never:

```text
Controller
 ↓
Database
```

directly.

---

# SQL Injection Protection

Use:

```text
SQLAlchemy ORM
```

and parameterized queries.

Avoid raw SQL whenever possible.

---

# Data Protection

## Encryption In Transit

Required:

```text
HTTPS
TLS 1.2+
```

---

## Encryption At Rest

Required for:

```text
User Data

Authentication Data

Secrets

Backups
```

---

# Sensitive Data

Never expose:

```text
Passwords

Tokens

Secret Keys

Internal Notes

Moderation Metadata
```

through public APIs.

---

# Secrets Management

## Forbidden

```python
API_KEY = "secret"
```

Never hardcode secrets.

---

# Required

Use:

```text
Environment Variables

Secret Managers

Platform Secrets
```

---

# Environment Variables

Examples:

```env
DATABASE_URL

REDIS_URL

CLERK_SECRET_KEY

GEMINI_API_KEY

GROQ_API_KEY

SUPABASE_KEY

SENTRY_DSN
```

---

# Logging Security

## Never Log

```text
Passwords

Tokens

Secret Keys

Authentication Headers

Private User Data
```

---

# Allowed Logging

```text
Event Names

Request IDs

Entity IDs

Status Codes

Execution Metrics
```

---

# Rate Limiting

Required For:

```text
Authentication

AI Requests

Search

Voting

Discussion Creation

Reporting
```

---

# Recommended Limits

Authentication:

```text
10 requests/minute
```

---

Search:

```text
60 requests/minute
```

---

AI:

```text
20 requests/minute
```

---

# Audit Logging

Critical actions must generate audit records.

---

# Required Audit Events

```text
FAQ Publication

FAQ Approval

Role Changes

User Suspensions

User Bans

Moderation Decisions

System Configuration Changes
```

---

# AI Security

AI introduces unique risks.

---

# AI Threats

```text
Prompt Injection

Data Leakage

Hallucinations

Abuse Of AI Services

Model Manipulation
```

---

# AI Security Principle

AI is never the source of truth.

AI outputs are suggestions.

Humans remain authoritative.

---

# Prompt Injection Protection

Never allow prompts to:

```text
Ignore Instructions

Reveal Secrets

Access Internal Data

Bypass Governance Rules
```

---

# Prompt Isolation

System prompts must remain separated from user content.

---

# AI Output Validation

Every AI response must pass:

```text
Schema Validation

Business Validation

Safety Validation
```

before use.

---

# Hallucination Mitigation

AI responses should prioritize:

```text
Published FAQs

Validated Discussions

Consensus Signals

Approved Knowledge
```

over model inference.

---

# Moderation Security

Moderation actions require:

```text
Authentication

Authorization

Audit Logging
```

---

# Moderator Actions

Must be traceable.

Required fields:

```text
Who

What

Why

When
```

---

# Reputation Security

Reputation impacts trust.

Protect against:

```text
Vote Manipulation

Fake Accounts

Automated Abuse

Reputation Farming
```

---

# Anti-Abuse Strategy

Future Enhancements:

```text
Device Fingerprinting

Spam Detection

Behavior Analysis

Trust Scoring
```

---

# Infrastructure Security

## Backend

Protect:

```text
API Endpoints

Admin Endpoints

AI Services
```

---

## Frontend

Protect:

```text
XSS

CSRF

Open Redirects
```

---

# Monitoring & Detection

Monitor:

```text
Authentication Failures

Suspicious Activity

AI Abuse

Rate Limit Violations

Moderation Abuse
```

---

# Security Incident Response

## Severity Levels

```text
LOW

MEDIUM

HIGH

CRITICAL
```

---

# Response Process

```text
Detection
    ↓
Investigation
    ↓
Containment
    ↓
Resolution
    ↓
Postmortem
```

---

# Backup Security

Database Backups:

Daily

Retention:

30 Days

Encryption:

Required

---

# Responsible Disclosure

If you discover a security issue:

Please do NOT publicly disclose it.

Instead:

```text
Contact Project Maintainers
        ↓
Provide Reproduction Steps
        ↓
Allow Time For Remediation
```

---

# Security Review Checklist

Before release:

```text
✓ Authentication Tested

✓ Authorization Tested

✓ Input Validation Verified

✓ Secrets Protected

✓ Rate Limiting Enabled

✓ Logging Reviewed

✓ Audit Trails Verified

✓ AI Validation Verified
```

---

# Final Security Statement

CrowdMind is built around:

```text
Trust
Transparency
Traceability
```

Security exists to protect:

* Community Intelligence
* Knowledge Integrity
* User Trust

Every engineering decision should consider security from the beginning rather than attempting to add it later.


---

# Development Mode Auth Bypass (PRODUCTION HAZARD)

## Overview

The backend contains a **development-mode authentication bypass** to support local testing without Clerk credentials.

Location: `backend/app/core/security.py:46-49`

Behavior: When the environment variable `CLERK_SECRET_KEY` is empty, JWT signature verification is **skipped entirely** and a test token (`create_test_token`) is accepted without cryptographic validation.

## Production Requirements

**Before any production deployment, all of the following must be true:**

1. `CLERK_SECRET_KEY` must be set in the production environment.
2. `CLERK_PUBLISHABLE_KEY` must be set in the production environment.
3. The startup health check should fail if either of the above is missing.
4. `create_test_token` must NOT be exposed via any HTTP endpoint.
5. The dev-bypass code path should be removed or feature-flagged `ENV=production` and unreachable in production builds.

## Pre-Deployment Checklist

`
[ ] CLERK_SECRET_KEY set in production env
[ ] CLERK_PUBLISHABLE_KEY set in production env
[ ] Dev-bypass code path reviewed and disabled
[ ] create_test_token NOT reachable from any public endpoint
[ ] Health check fails when Clerk keys are missing
[ ] Security audit log includes "auth-bypass-disabled" event on startup
`

## Related Risks

- Anyone who knows the dev-bypass trick can forge JWTs by sending a hand-crafted payload.
- The bypass is silent � no log, no warning, no header.
- Test tokens are valid forever (no expiry) and grant any role including admin.

## Status

Fixed in Block 2.2 of the post-build hardening pass (2026-06-07).
Documentation only � code hardening is a separate workstream.
