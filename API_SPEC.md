# CrowdMind API Specification

Version: 1.0

Status: Active

API Style:

REST API

Transport:

HTTPS

Data Format:

JSON

Authentication:

Clerk JWT

Related Documents:

* context.md
* ARCHITECTURE.md
* DATABASE.md

---

# Purpose

This document defines:

* API Standards
* Endpoint Structure
* Request Formats
* Response Formats
* Error Handling
* Authentication Rules
* Authorization Rules

---

# API Design Principles

## Principle 1

Consistency

Every endpoint must follow the same conventions.

---

## Principle 2

Predictability

Naming should be obvious.

---

## Principle 3

Versioning

All APIs must be versioned.

Example:

```text
/api/v1/
```

---

## Principle 4

Resource Based Design

Use nouns.

Good:

```text
/api/v1/questions
```

Bad:

```text
/api/v1/createQuestion
```

---

# Base URL

Development:

```text
http://localhost:8000/api/v1
```

Production:

```text
https://api.crowdmind.com/api/v1
```

---

# Authentication

Provider:

Clerk

Authentication Method:

Bearer Token

---

# Authorization Header

```http
Authorization: Bearer <token>
```

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

# Standard Response Format

## Success Response

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}
```

---

## Error Response

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "FAQ not found"
  }
}
```

---

# Pagination Standard

## Request

```http
GET /faqs?page=1&page_size=20
```

---

## Response

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 125,
    "total_pages": 7
  }
}
```

---

# Health Endpoints

## Health Check

```http
GET /health
```

Response:

```json
{
  "status": "healthy"
}
```

---

# Authentication APIs

Base Route:

```text
/auth
```

---

## Current User

```http
GET /auth/me
```

Returns:

Authenticated user profile.

---

## User Session

```http
GET /auth/session
```

Returns:

Current session information.

---

# User APIs

Base Route:

```text
/users
```

---

## Get User Profile

```http
GET /users/{user_id}
```

Public.

---

## Update User Profile

```http
PATCH /users/{user_id}
```

Authentication Required.

---

## User Contributions

```http
GET /users/{user_id}/contributions
```

Returns:

* Questions
* Discussions
* FAQs

---

## User Reputation History

```http
GET /users/{user_id}/reputation
```

---

## User Achievements

```http
GET /users/{user_id}/achievements
```

---

# Category APIs

Base Route:

```text
/categories
```

---

## List Categories

```http
GET /categories
```

Public.

---

## Category Detail

```http
GET /categories/{category_id}
```

Public.

---

# Question APIs

Base Route:

```text
/questions
```

---

## Create Question

```http
POST /questions
```

Role:

USER+

---

### Request

```json
{
  "title": "How can students improve quantitative reasoning?",
  "description": "Need strategies and resources.",
  "category_id": "uuid"
}
```

---

### Response

```json
{
  "question_id": "uuid",
  "status": "OPEN"
}
```

---

## Get Question

```http
GET /questions/{question_id}
```

Public.

---

## List Questions

```http
GET /questions
```

Supports:

* Search
* Category Filter
* Status Filter

---

## Update Question

```http
PATCH /questions/{question_id}
```

Owner only.

---

## Delete Question

Soft Delete.

```http
DELETE /questions/{question_id}
```

---

# AI Analysis APIs

Base Route:

```text
/ai
```

---

## Analyze Question

```http
POST /ai/question-analysis
```

Purpose:

Pre-discussion evaluation.

---

### Response

```json
{
  "duplicates": [],
  "related_faqs": [],
  "related_discussions": [],
  "suggested_category": "Education"
}
```

---
# Discussion APIs

Base Route:

```text id="1rjcxv"
/discussions
```

---

## Create Discussion

```http id="uw43q5"
POST /discussions
```

Role:

USER+

---

### Request

```json id="ndjlwm"
{
  "question_id": "uuid",
  "title": "Improving Quantitative Reasoning Skills",
  "description": "Community discussion on strategies."
}
```

---

### Response

```json id="76prig"
{
  "discussion_id": "uuid",
  "status": "ACTIVE"
}
```

---

## List Discussions

```http id="n03t8u"
GET /discussions
```

Public.

---

### Filters

```text id="2hjlwm"
search
category
status
sort
page
page_size
```

---

## Get Discussion

```http id="zrr73d"
GET /discussions/{discussion_id}
```

Public.

---

## Update Discussion

```http id="ap7sdw"
PATCH /discussions/{discussion_id}
```

Owner or Moderator.

---

## Archive Discussion

Soft Delete.

```http id="0w8c7t"
DELETE /discussions/{discussion_id}
```

---

# Reply APIs

Base Route:

```text id="tjlwm3"
/replies
```

---

## Create Reply

```http id="vjlwm1"
POST /replies
```

Role:

USER+

---

### Request

```json id="j4g17m"
{
  "discussion_id": "uuid",
  "parent_reply_id": null,
  "content": "Students should practice daily..."
}
```

---

## Update Reply

```http id="1dxitd"
PATCH /replies/{reply_id}
```

Owner only.

---

## Delete Reply

Soft Delete.

```http id="8txv66"
DELETE /replies/{reply_id}
```

Owner or Moderator.

---

## Get Discussion Replies

```http id="0xj56o"
GET /discussions/{discussion_id}/replies
```

Returns nested reply structure.

---

# Voting APIs

Base Route:

```text id="mjlwm6"
/votes
```

---

## Vote

```http id="44dsp0"
POST /votes
```

Role:

USER+

---

### Request

```json id="zjlwm2"
{
  "target_type": "REPLY",
  "target_id": "uuid",
  "vote_type": "UPVOTE"
}
```

---

### Target Types

```text id="vjlwm8"
DISCUSSION

REPLY

FAQ
```

---

### Vote Types

```text id="kjlwm7"
UPVOTE

DOWNVOTE
```

---

## Remove Vote

```http id="9jlwm4"
DELETE /votes/{vote_id}
```

---

# Consensus APIs

Base Route:

```text id="jlwm9p"
/consensus
```

---

## Get Discussion Consensus

```http id="jlwm0x"
GET /consensus/discussions/{discussion_id}
```

Returns:

```json id="jlwm2q"
{
  "consensus_score": 0.87,
  "agreement_level": "HIGH",
  "top_contributors": []
}
```

---

# FAQ APIs

Base Route:

```text id="jlwm4a"
/faqs
```

---

## List FAQs

```http id="jlwm5b"
GET /faqs
```

Public.

Supports:

* Search
* Category
* Sort
* Pagination

---

## Get FAQ

```http id="jlwm6c"
GET /faqs/{faq_id}
```

Public.

---

### Response Includes

```text id="jlwm7d"
FAQ Content

Sources

Contributors

Confidence Score

Version History

Related Knowledge
```

---

## Get FAQ By Slug

```http id="jlwm8e"
GET /faqs/slug/{slug}
```

SEO-friendly route.

---

## Get FAQ Versions

```http id="jlwm9f"
GET /faqs/{faq_id}/versions
```

Public.

---

## Get FAQ Contributors

```http id="jlwm0g"
GET /faqs/{faq_id}/contributors
```

Public.

---

## Get FAQ Sources

```http id="jlwm1h"
GET /faqs/{faq_id}/sources
```

Public.

---

# Knowledge Evolution APIs

Base Route:

```text id="jlwm2i"
/knowledge
```

---

## Get Evolution Timeline

```http id="jlwm3j"
GET /knowledge/faqs/{faq_id}/evolution
```

Returns:

```json id="jlwm4k"
{
  "faq_id": "uuid",
  "versions": [],
  "events": []
}
```

---

## Get Evolution Events

```http id="jlwm5l"
GET /knowledge/faqs/{faq_id}/events
```

Public.

---

## Get FAQ Version Diff

```http
GET /evolution/diff/{faq_id}?from=1&to=4
```

Returns unified-diff style hunks between two FAQ versions.

Auth: Public (read-only).

Response:

```json
{
  "faq_id": "uuid",
  "from_version": 1,
  "to_version": 4,
  "from_title": "ViBe Team Formation Policy v1",
  "to_title": "ViBe Team Formation Policy v4",
  "hunks": [
    {
      "field": "answer",
      "op": "modified",
      "old_value": "Teams were fixed post-Phase 1...",
      "new_value": "Self-formation is the default; faculty intervenes when self-formation fails..."
    }
  ],
  "change_summary": "Made self-formation the default; added NOC requirement"
}
```

---

## Get FAQ Versions

```http
GET /faqs/{faq_id}/versions
```

Returns paginated version history for a FAQ.

Auth: Public.

---

## Rollback FAQ Version (Admin only)

```http
POST /faqs/{faq_id}/rollback
```

Request:

```json
{ "target_version": 2, "reason": "v4 introduced regression in team size policy" }
```

Response:

```json
{
  "faq_id": "uuid",
  "rolled_back_from": 4,
  "rolled_back_to": 2,
  "new_version": 5,
  "auto_snapshot_id": "uuid",
  "rollback_event_id": "uuid"
}
```

Auth: **Admin** (403 otherwise). Non-destructive — auto-snapshots the current version before reverting.

Errors:

* `400` — `target_version` does not exist
* `404` — FAQ not found
* `403` — caller is not admin

---

## Synthesize FAQ from Discussion (Admin only)

```http
POST /discussions/{discussion_id}/synthesize
```

Triggers AI synthesis of an accepted-reply into a new FAQ candidate or version.

Auth: **Admin**.

Response:

```json
{
  "discussion_id": "uuid",
  "synthesized_faq_id": "uuid",
  "candidate_id": "uuid",
  "consensus_score": 87.5,
  "used_fallback": false
}
```

---

## Flush All Analysis Cache (Admin only)

```http
POST /admin/analysis/cache/flush-all
```

Auth: **Admin**.

---

## Delete Analysis Cache Entry (Admin only)

```http
DELETE /admin/analysis/cache/{question_id}
```

Auth: **Admin**.

---

## Question Analysis with Force Refresh

```http
POST /questions/analyze?force=true
```

Request body: `QuestionAnalysisRequest` (text, categories, context)

Auth: Authenticated user.

When `force=true`, the analysis cache is bypassed and a fresh Gemini call is made. On Gemini failure, Groq is tried as fallback. On both failures, a generic response with `used_fallback=true` is returned.

---

---

# Search APIs

Base Route:

```text id="jlwm6m"
/search
```

---

## Global Search

```http id="jlwm7n"
GET /search?q=machine+learning
```

Public.

---

### Response

```json id="jlwm8o"
{
  "faqs": [],
  "questions": [],
  "discussions": []
}
```

---

## Semantic Search

```http id="jlwm9p"
GET /search/semantic?q=artificial+intelligence
```

Uses:

pgvector

---

## Related Knowledge

```http id="jlwm0q"
GET /search/related/{entity_type}/{entity_id}
```

---

### Entity Types

```text id="jlwm1r"
FAQ

QUESTION

DISCUSSION
```

---

## Trending Knowledge

```http id="jlwm2s"
GET /search/trending
```

Public.

---

# Saved Knowledge APIs

Base Route:

```text id="jlwm3t"
/saved
```

---

## Save Knowledge

```http id="jlwm4u"
POST /saved
```

Role:

USER+

---

### Request

```json id="jlwm5v"
{
  "target_type": "FAQ",
  "target_id": "uuid"
}
```

---

## List Saved Knowledge

```http id="jlwm6w"
GET /saved
```

Authenticated.

---

## Remove Saved Knowledge

```http id="jlwm7x"
DELETE /saved/{saved_id}
```

---

# Collection APIs

Base Route:

```text id="jlwm8y"
/collections
```

---

## Create Collection

```http id="jlwm9z"
POST /collections
```

---

## List Collections

```http id="jlwm0a"
GET /collections
```

---

## Add Item To Collection

```http id="jlwm1b"
POST /collections/{collection_id}/items
```

---

## Remove Item

```http id="jlwm2c"
DELETE /collections/{collection_id}/items/{item_id}
```

---

# Notification APIs

Base Route:

```text id="jlwm3d"
/notifications
```

---

## List Notifications

```http id="jlwm4e"
GET /notifications
```

Authenticated.

---

## Mark As Read

```http id="jlwm5f"
PATCH /notifications/{notification_id}/read
```

---

## Mark All As Read

```http id="jlwm6g"
PATCH /notifications/read-all
```

---

## Notification Preferences

```http id="jlwm7h"
GET /notifications/preferences
```

---

```http id="jlwm8i"
PATCH /notifications/preferences
```

Update user preferences.

---

# My Contributions APIs

Base Route:

```text id="jlwm9j"
/me
```

---

## My Contributions

```http id="jlwm0k"
GET /me/contributions
```

Returns:

```json id="jlwm1l"
{
  "questions": [],
  "discussions": [],
  "replies": [],
  "faqs": []
}
```

---

## My Reputation

```http id="jlwm2m"
GET /me/reputation
```

---

## My Activity

```http id="jlwm3n"
GET /me/activity
```

Recent activity feed.

---
# Admin APIs

All Admin APIs require:

```text
ADMIN
```

or

```text
MODERATOR
```

depending on endpoint permissions.

---

# Mission Control APIs

Base Route:

```text
/admin/mission-control
```

---

## Dashboard Summary

```http
GET /admin/mission-control/overview
```

Returns:

```json
{
  "total_users": 0,
  "total_questions": 0,
  "total_discussions": 0,
  "total_faqs": 0,
  "pending_reports": 0
}
```

---

## Platform Health

```http
GET /admin/mission-control/health
```

Returns:

* System Health
* Database Health
* AI Health
* Search Health

---

# FAQ Management APIs

Base Route:

```text
/admin/faqs
```

---

## FAQ Candidates

```http
GET /admin/faqs/candidates
```

Role:

MODERATOR+

---

Supports:

* Pagination
* Filtering
* Sorting

---

## Candidate Detail

```http
GET /admin/faqs/candidates/{candidate_id}
```

---

## Approve Candidate

```http
POST /admin/faqs/candidates/{candidate_id}/approve
```

Role:

MODERATOR+

---

### Request

```json
{
  "publish_notes": "Approved after review"
}
```

---

## Reject Candidate

```http
POST /admin/faqs/candidates/{candidate_id}/reject
```

---

### Request

```json
{
  "reason": "Insufficient evidence"
}
```

---

## Publish FAQ

```http
POST /admin/faqs/publish
```

Role:

MODERATOR+

---

## Archive FAQ

```http
POST /admin/faqs/{faq_id}/archive
```

---

## Restore FAQ

```http
POST /admin/faqs/{faq_id}/restore
```

---

# FAQ Version APIs

## Create New Version

```http
POST /admin/faqs/{faq_id}/versions
```

---

## Approve Version

```http
POST /admin/faqs/{faq_id}/versions/{version_id}/approve
```

---

## Version History

```http
GET /admin/faqs/{faq_id}/versions
```

---

# Moderation APIs

Base Route:

```text
/admin/moderation
```

---

## List Reports

```http
GET /admin/moderation/reports
```

Filters:

* Status
* Severity
* Date Range

---

## Report Detail

```http
GET /admin/moderation/reports/{report_id}
```

Returns:

* Report
* Investigation Notes
* User History
* AI Assessment

---

## Add Investigation Note

```http
POST /admin/moderation/reports/{report_id}/notes
```

---

## Resolve Report

```http
POST /admin/moderation/reports/{report_id}/resolve
```

---

### Request

```json
{
  "action": "WARNING",
  "reason": "Violation confirmed"
}
```

---

# User Enforcement APIs

## Warning

```http
POST /admin/users/{user_id}/warn
```

---

## Suspend User

```http
POST /admin/users/{user_id}/suspend
```

---

### Request

```json
{
  "duration_days": 7,
  "reason": "Repeated violations"
}
```

---

## Ban User

```http
POST /admin/users/{user_id}/ban
```

---

## Reinstate User

```http
POST /admin/users/{user_id}/reinstate
```

---

# Analytics APIs

Base Route:

```text
/admin/analytics
```

---

## Overview Analytics

```http
GET /admin/analytics/overview
```

---

## User Analytics

```http
GET /admin/analytics/users
```

---

## Knowledge Analytics

```http
GET /admin/analytics/knowledge
```

---

## Community Analytics

```http
GET /admin/analytics/community
```

---

## Moderation Analytics

```http
GET /admin/analytics/moderation
```

---

## AI Analytics

```http
GET /admin/analytics/ai
```

---

## Export Analytics

```http
POST /admin/analytics/export
```

Formats:

```text
CSV

PDF

JSON
```

---

# AI Administration APIs

Base Route:

```text
/admin/ai
```

---

## AI Usage Metrics

```http
GET /admin/ai/usage
```

---

## AI Provider Health

```http
GET /admin/ai/providers
```

---

## Prompt Versions

```http
GET /admin/ai/prompts
```

---

## Prompt Detail

```http
GET /admin/ai/prompts/{prompt_id}
```

---

## AI Performance Metrics

```http
GET /admin/ai/performance
```

---

# Reporting APIs

Base Route:

```text
/reports
```

---

## Create Report

```http
POST /reports
```

Role:

USER+

---

### Request

```json
{
  "target_type": "REPLY",
  "target_id": "uuid",
  "reason": "Misinformation",
  "description": "Content appears inaccurate"
}
```

---

## My Reports

```http
GET /reports/my
```

---

# RBAC Matrix

| Endpoint Category | Visitor | User   | Trusted Contributor | Moderator | Admin  |
| ----------------- | ------- | ------ | ------------------- | --------- | ------ |
| Read FAQs         | ✓       | ✓      | ✓                   | ✓         | ✓      |
| Search            | ✓       | ✓      | ✓                   | ✓         | ✓      |
| Discussions       | Read    | Create | Create              | Manage    | Manage |
| Vote              | ✗       | ✓      | ✓                   | ✓         | ✓      |
| Reports           | ✗       | ✓      | ✓                   | ✓         | ✓      |
| FAQ Review        | ✗       | ✗      | ✗                   | ✓         | ✓      |
| Moderation        | ✗       | ✗      | ✗                   | ✓         | ✓      |
| Analytics         | ✗       | ✗      | ✗                   | Limited   | ✓      |
| Settings          | Own     | Own    | Own                 | Own       | Global |

---

# Error Codes

## Authentication

```text
UNAUTHORIZED

TOKEN_EXPIRED

INVALID_TOKEN
```

---

## Authorization

```text
FORBIDDEN

INSUFFICIENT_PERMISSIONS
```

---

## Validation

```text
VALIDATION_ERROR

INVALID_INPUT
```

---

## Resource Errors

```text
RESOURCE_NOT_FOUND

RESOURCE_CONFLICT

RESOURCE_ARCHIVED
```

---

## AI Errors

```text
AI_PROVIDER_UNAVAILABLE

AI_TIMEOUT

AI_GENERATION_FAILED
```

---

## System Errors

```text
INTERNAL_SERVER_ERROR

SERVICE_UNAVAILABLE
```

---

# HTTP Status Standards

```text
200 OK

201 CREATED

204 NO CONTENT

400 BAD REQUEST

401 UNAUTHORIZED

403 FORBIDDEN

404 NOT FOUND

409 CONFLICT

422 UNPROCESSABLE ENTITY

429 TOO MANY REQUESTS

500 INTERNAL SERVER ERROR
```

---

# Rate Limiting

## Anonymous Users

Search:

```text
60 requests/minute
```

---

## Authenticated Users

General APIs:

```text
120 requests/minute
```

---

## AI Endpoints

```text
20 requests/minute
```

---

## Authentication Endpoints

```text
10 requests/minute
```

---

# API Versioning Strategy

Current Version:

```text
v1
```

---

Pattern:

```text
/api/v1/
```

---

Future:

```text
/ api/v2 /
```

New versions must remain backward compatible whenever possible.

---

# Webhook Architecture (Future)

Base Route:

```text
/webhooks
```

Supported Events:

```text
FAQ_PUBLISHED

FAQ_UPDATED

DISCUSSION_CREATED

REPORT_RESOLVED

USER_REPUTATION_CHANGED
```

---

# Event Architecture

All major actions generate domain events.

Examples:

```text
QuestionCreated

DiscussionCreated

ReplyCreated

FAQCandidateGenerated

FAQPublished

ReportSubmitted

ReportResolved

ReputationChanged
```

---

# API Security Requirements

All APIs must enforce:

* Authentication Validation
* Authorization Validation
* Input Validation
* Audit Logging
* Rate Limiting
* Structured Error Responses

---

# API Documentation Standard

Future Implementation:

OpenAPI 3.1

Swagger UI

Redoc

Generated automatically from FastAPI schemas.

---

# Final API Statement

The CrowdMind API is designed around:

```text
Consistency
Security
Traceability
Scalability
```

The API contract should remain stable, predictable, and strongly typed.

Frontend applications, mobile clients, AI services, and future integrations should be able to interact with CrowdMind without ambiguity.

This document serves as the official API contract for the CrowdMind platform.
