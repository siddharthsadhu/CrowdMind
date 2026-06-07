# CrowdMind Deployment Guide

Version: 1.0

Status: Active

Related Documents:

* ARCHITECTURE.md
* SECURITY.md
* DATABASE.md
* README.md

---

# Purpose

This document defines:

* Local Development Setup
* Development Environment
* Staging Environment
* Production Deployment
* Infrastructure Requirements
* CI/CD Process
* Monitoring Strategy

---

# Deployment Philosophy

CrowdMind should be deployable by:

* Students
* Startup Teams
* Open Source Contributors
* Enterprises

without architecture changes.

---

# Environment Strategy

CrowdMind uses three environments.

---

# Development

Purpose:

Local development.

Characteristics:

```text id="dev001"
Fast Iteration

Local Services

Debug Friendly
```

---

# Staging

Purpose:

Pre-production validation.

Characteristics:

```text id="stg001"
Production-like

Internal Testing

UAT Testing
```

---

# Production

Purpose:

Live platform.

Characteristics:

```text id="prd001"
Secure

Monitored

Scalable

Backed Up
```

---

# Infrastructure Overview

```text id="infra001"
Frontend
   │
   ▼

Vercel
   │
   ▼

FastAPI Backend
   │
   ▼

Railway

   │
   ├── PostgreSQL
   ├── Redis
   └── Storage

AI Gateway
   │
   ├── Gemini
   └── Groq
```

---

# Frontend Deployment

## Platform

Recommended:

```text id="fe001"
Vercel
```

Reason:

* Native Next.js Support
* Automatic Deployments
* Edge Optimization

---

# Frontend Build

```bash id="fe002"
npm install

npm run build
```

---

# Frontend Start

```bash id="fe003"
npm run start
```

---

# Backend Deployment

## Platform

Recommended:

```text id="be001"
Railway
```

Alternatives:

```text id="be002"
Render

Fly.io

DigitalOcean

AWS ECS
```

---

# Backend Build

```bash id="be003"
pip install -r requirements.txt
```

---

# Backend Run

```bash id="be004"
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

---

# Database Deployment

## Platform

Recommended:

```text id="db001"
PostgreSQL
```

---

## Extensions

Required:

```sql id="db002"
pgvector
```

---

## Migrations

Run:

```bash id="db003"
alembic upgrade head
```

on deployment.

---

# Redis Deployment

Purpose:

```text id="redis001"
Caching

Rate Limiting

Temporary Storage
```

---

Recommended Providers:

```text id="redis002"
Railway Redis

Upstash

Redis Cloud
```

---

# File Storage

Provider:

```text id="storage001"
Supabase Storage
```

Stores:

```text id="storage002"
User Avatars

Attachments

Images
```

---

# AI Infrastructure

Primary Provider:

```text id="ai001"
Google Gemini
```

---

Fallback Provider:

```text id="ai002"
Groq
```

---

# AI Health Requirement

Application startup should verify:

```text id="ai003"
Provider Reachability

API Key Validity
```

before serving requests.

---
# Docker Strategy

## Goal

Provide consistent environments across:

* Development
* Staging
* Production

---

# Docker Architecture

```text id="docker001"
Frontend Container
        │
        ▼

Backend Container
        │
        ├── PostgreSQL
        └── Redis
```

---

# Backend Dockerfile

Requirements:

```text id="docker002"
Python 3.12

Non-Root User

Multi-Stage Build

Health Check Support
```

---

# Frontend Dockerfile

Requirements:

```text id="docker003"
Node.js 22+

Production Build

Minimal Runtime Image
```

---

# Docker Compose (Development)

Services:

```text id="docker004"
frontend

backend

postgres

redis
```

Local development should run with a single command.

---

# Environment Variables

## General Rule

Never commit:

```text id="env001"
.env

.env.production

Secrets
```

to Git.

---

# Backend Variables

```env id="env002"
APP_ENV=

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

---

# Frontend Variables

```env id="env003"
NEXT_PUBLIC_API_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

NEXT_PUBLIC_POSTHOG_KEY=
```

---

# Environment Separation

Development:

```text id="env004"
.env.local
```

---

Staging:

```text id="env005"
.env.staging
```

---

Production:

```text id="env006"
Environment Secrets
```

managed by hosting platform.

---

# CI/CD Architecture

## Source Control

Platform:

```text id="cicd001"
GitHub
```

---

# Branch Workflow

```text id="cicd002"
main

develop

feature/*

fix/*

hotfix/*
```

---

# Deployment Flow

```text id="cicd003"
Developer
      ↓

Feature Branch
      ↓

Pull Request
      ↓

Code Review
      ↓

Automated Checks
      ↓

Merge
      ↓

Deployment
```

---

# Required CI Checks

Every Pull Request must run:

```text id="cicd004"
Lint

Type Check

Unit Tests

Build Verification

Security Checks
```

---

# Frontend Pipeline

```text id="cicd005"
GitHub
      ↓

Vercel Build
      ↓

Deploy Preview
      ↓

Production Deploy
```

---

# Backend Pipeline

```text id="cicd006"
GitHub
      ↓

Tests
      ↓

Build
      ↓

Railway Deploy
```

---

# Database Deployment Strategy

## Migration Rule

Every schema change requires:

```text id="dbm001"
Alembic Migration
```

---

Forbidden:

```text id="dbm002"
Manual Production Changes
```

---

# Deployment Order

```text id="dbm003"
Database Migration
      ↓

Backend Deployment
      ↓

Frontend Deployment
```

---

# Monitoring Strategy

## Philosophy

If a system cannot be observed:

```text id="mon001"
It cannot be trusted.
```

---

# Monitoring Stack

## Sentry

Purpose:

```text id="mon002"
Error Tracking
```

Tracks:

* Backend Exceptions
* Frontend Exceptions
* Stack Traces

---

## PostHog

Purpose:

```text id="mon003"
Product Analytics
```

Tracks:

* User Behavior
* Feature Usage
* Conversion Metrics

---

# Health Monitoring

Required Endpoints:

```http id="mon004"
GET /health
```

---

```http id="mon005"
GET /health/database
```

---

```http id="mon006"
GET /health/ai
```

---

```http id="mon007"
GET /health/redis
```

---

# Logging Strategy

## Format

Structured JSON Logs

---

Example:

```json id="log001"
{
  "event": "faq_published",
  "faq_id": "uuid",
  "user_id": "uuid",
  "timestamp": "..."
}
```

---

# Log Categories

```text id="log002"
Application Logs

Audit Logs

Security Logs

AI Logs

Analytics Logs
```

---

# Logging Rules

Never log:

```text id="log003"
Passwords

Tokens

Secrets

Private Data
```

---

# Backup Strategy

## PostgreSQL

Frequency:

```text id="backup001"
Daily
```

Retention:

```text id="backup002"
30 Days
```

---

# Supabase Storage

Frequency:

```text id="backup003"
Daily
```

Retention:

```text id="backup004"
30 Days
```

---

# Backup Verification

Monthly restore testing required.

Backups that cannot be restored are considered invalid.

---

# Disaster Recovery

## Recovery Objectives

RPO:

```text id="dr001"
24 Hours
```

Maximum acceptable data loss.

---

RTO:

```text id="dr002"
4 Hours
```

Maximum acceptable downtime.

---

# Incident Response Workflow

```text id="dr003"
Detection
      ↓

Investigation
      ↓

Containment
      ↓

Recovery
      ↓

Postmortem
```

---

# Production Checklist

Before every production deployment:

---

## Infrastructure

```text id="chk001"
✓ Database Available

✓ Redis Available

✓ Storage Available

✓ AI Providers Reachable
```

---

## Security

```text id="chk002"
✓ Secrets Configured

✓ HTTPS Enabled

✓ RBAC Verified

✓ Rate Limiting Enabled
```

---

## Monitoring

```text id="chk003"
✓ Sentry Active

✓ PostHog Active

✓ Health Checks Active
```

---

## Database

```text id="chk004"
✓ Backups Enabled

✓ Migrations Applied

✓ pgvector Installed
```

---

## Application

```text id="chk005"
✓ Build Successful

✓ Tests Passing

✓ Documentation Updated
```

---

# Rollback Strategy

If deployment fails:

```text id="rollback001"
Rollback Frontend
      ↓

Rollback Backend
      ↓

Restore Previous Stable Version
```

---

Database rollbacks require:

```text id="rollback002"
Validated Migration Rollback
```

before execution.

---

# Scalability Roadmap

## Current

```text id="scale001"
Single PostgreSQL Instance

Single Backend Deployment
```

---

## Future

```text id="scale002"
Read Replicas

Connection Pooling

Dedicated Search Infrastructure

Dedicated AI Infrastructure
```

---

# Hosting Recommendations

## MVP

Frontend:

```text id="host001"
Vercel
```

Backend:

```text id="host002"
Railway
```

Database:

```text id="host003"
Railway PostgreSQL
```

Cache:

```text id="host004"
Railway Redis
```

Storage:

```text id="host005"
Supabase Storage
```

---

## Production Scale

Frontend:

```text id="host006"
Vercel Pro
```

Backend:

```text id="host007"
AWS ECS / Kubernetes
```

Database:

```text id="host008"
Managed PostgreSQL
```

Cache:

```text id="host009"
Redis Cluster
```

---

# Final Deployment Statement

CrowdMind deployment architecture is designed to be:

```text id="final001"
Simple

Reliable

Secure

Observable

Scalable
```

The deployment process should prioritize:

* Stability
* Recoverability
* Security
* Maintainability

over deployment speed.

Every production release should be:

```text id="final002"
Tested

Monitored

Recoverable
```

before reaching users.


---

# Pre-Deployment Checklist (Phase 6.9)

Before deploying to production, verify the following items are completed.

## Environment Variables

- [ ] CLERK_SECRET_KEY is set to a production Clerk secret
- [ ] CLERK_PUBLISHABLE_KEY is set to a production Clerk publishable key
- [ ] NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set to the same production value
- [ ] APP_ENV=production (NOT development)
- [ ] DATABASE_URL points to production Postgres
- [ ] GEMINI_API_KEY is set
- [ ] GROQ_API_KEY is set (for fallback)
- [ ] No .env file is committed to git

## Security

- [ ] ackend/app/core/security.py dev-bypass path is unreachable (verify CLERK_SECRET_KEY is non-empty)
- [ ] create_test_token is not exposed via any public endpoint
- [ ] All admin endpoints (POST /faqs/{id}/rollback, POST /discussions/{id}/synthesize, /admin/*) require admin role server-side
- [ ] CORS allows only the production frontend origin
- [ ] HTTPS is enforced

## Database

- [ ] 
pm run db:migrate (or equivalent) has been run
- [ ] seed.py has been run
- [ ] seed_evolution_demo.py has been run (optional, creates the flagship ViBe FAQ)
- [ ] pgvector extension is enabled in production DB

## Frontend

- [ ] 
pm run build completes in < 5s with 0 errors
- [ ] data-cm-* attribute count: 193 (run grep -rh "data-cm-" web/public/stitch-ref/*.html | wc -l)
- [ ] 
ode verify-public.mjs reports 31/31 PASS
- [ ] 
ode verify-browser.mjs reports 22/23 PASS (test 19 /ask is INFO by design)

## Backend

- [ ] python -m pytest reports 70/70 PASS
- [ ] Health check (/health) returns 200
- [ ] All 7 evolution endpoints return 401 for unauthenticated requests
- [ ] Admin endpoints return 403 for non-admin requests

## Observability

- [ ] Logs are structured (JSON) and shipped to a central log store
- [ ] Error tracking (Sentry or equivalent) is configured
- [ ] Uptime monitoring is active on /health
- [ ] Alert on auth-bypass activation (should never fire in production)
