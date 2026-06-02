# CrowdMind Database Architecture

Version: 1.0

Status: Active

Related Documents:

* context.md
* ARCHITECTURE.md
* API_SPEC.md

---

# Purpose

This document defines the database architecture of CrowdMind.

It serves as the authoritative source for:

* Database Design
* Entity Relationships
* Naming Conventions
* Indexing Strategy
* Data Integrity Rules

---

# Database Philosophy

CrowdMind is a Knowledge Evolution Platform.

The database must support:

* Traceability
* Auditability
* Knowledge Evolution
* Reputation Tracking
* Moderation History
* Analytics

Every important action should be reconstructable.

---

# Database Technology

Primary Database:

```text
PostgreSQL 16+
```

Vector Search:

```text
pgvector
```

ORM:

```text
SQLAlchemy 2.0
```

Migration Tool:

```text
Alembic
```

---

# Database Design Principles

## Principle 1

UUID Everywhere

All primary keys must use UUID.

Never use:

```sql
SERIAL
BIGSERIAL
INT
```

for primary entities.

---

## Principle 2

Soft Deletes

Critical records are never permanently deleted.

Use:

```sql
deleted_at TIMESTAMP NULL
```

---

## Principle 3

Auditability

Important actions must be traceable.

---

## Principle 4

Timestamp Everything

Every table should include:

```sql
created_at TIMESTAMP

updated_at TIMESTAMP
```

---

## Principle 5

Referential Integrity

Use foreign keys.

Avoid orphaned records.

---

# Naming Conventions

## Tables

Plural

Examples:

```text
users

questions

discussions

replies

faq_candidates

published_faqs
```

---

## Columns

Snake Case

Examples:

```text
created_at

user_id

reputation_score
```

---

## Foreign Keys

Pattern:

```text
entity_id
```

Examples:

```text
user_id

discussion_id

faq_id
```

---

# Core Database Domains

CrowdMind consists of:

```text
Identity Domain

Knowledge Domain

Discussion Domain

Moderation Domain

Analytics Domain

AI Domain
```

---

# Identity Domain

## Users Table

Purpose:

Platform identity management.

---

### Fields

```sql
id UUID PRIMARY KEY

clerk_user_id VARCHAR UNIQUE

username VARCHAR UNIQUE

email VARCHAR UNIQUE

full_name VARCHAR

avatar_url TEXT

bio TEXT

reputation_score INTEGER

role VARCHAR

is_active BOOLEAN

created_at TIMESTAMP

updated_at TIMESTAMP

deleted_at TIMESTAMP NULL
```

---

### Relationships

```text
User
 ├── Questions
 ├── Discussions
 ├── Replies
 ├── Votes
 ├── Reports
 ├── Saved Knowledge
 └── Reputation History
```

---

# User Profiles

Additional profile information.

---

### Fields

```sql
id UUID PRIMARY KEY

user_id UUID

location VARCHAR

website VARCHAR

linkedin_url VARCHAR

github_url VARCHAR

expertise JSONB

preferences JSONB

created_at TIMESTAMP

updated_at TIMESTAMP
```

---

# Roles

Supported Roles:

```text
VISITOR

USER

TRUSTED_CONTRIBUTOR

MODERATOR

ADMIN
```

---

# Knowledge Domain

## Questions Table

Purpose:

Store knowledge seeds.

---

### Fields

```sql
id UUID PRIMARY KEY

user_id UUID

title VARCHAR

description TEXT

category_id UUID

status VARCHAR

ai_analysis_status VARCHAR

created_at TIMESTAMP

updated_at TIMESTAMP

deleted_at TIMESTAMP NULL
```

---

### Statuses

```text
OPEN

UNDER_DISCUSSION

CONVERTED_TO_FAQ

ARCHIVED
```

---

### Relationships

```text
Question
      │
      ▼
Discussion
```

---

# Categories Table

Purpose:

Knowledge classification.

---

### Fields

```sql
id UUID PRIMARY KEY

name VARCHAR

slug VARCHAR

description TEXT

created_at TIMESTAMP

updated_at TIMESTAMP
```

---

### Examples

```text
Education

Technology

AI

Programming

Career

Research
```

---
# Discussion Domain

The Discussion Domain is the collaboration engine of CrowdMind.

It transforms questions into community intelligence.

---

# Discussions Table

## Purpose

Represents a discussion thread associated with a question.

---

### Fields

```sql
id UUID PRIMARY KEY

question_id UUID

created_by UUID

title VARCHAR

description TEXT

status VARCHAR

view_count INTEGER

reply_count INTEGER

participant_count INTEGER

consensus_score DECIMAL

created_at TIMESTAMP

updated_at TIMESTAMP

deleted_at TIMESTAMP NULL
```

---

### Status Values

```text
ACTIVE

LOCKED

RESOLVED

ARCHIVED
```

---

### Relationships

```text
Question
     │
     ▼
Discussion
     │
     ├── Replies
     ├── Votes
     └── Consensus Signals
```

---

# Replies Table

## Purpose

Stores:

* Answers
* Comments
* Nested Replies

---

### Fields

```sql
id UUID PRIMARY KEY

discussion_id UUID

parent_reply_id UUID NULL

user_id UUID

content TEXT

is_accepted BOOLEAN

upvote_count INTEGER

downvote_count INTEGER

created_at TIMESTAMP

updated_at TIMESTAMP

deleted_at TIMESTAMP NULL
```

---

### Nested Reply Structure

```text
Reply
  │
  ├── Child Reply
  │
  └── Child Reply
```

Supports Reddit-style discussions.

---

# Votes Table

## Purpose

Stores user voting activity.

---

### Fields

```sql
id UUID PRIMARY KEY

user_id UUID

target_type VARCHAR

target_id UUID

vote_type VARCHAR

created_at TIMESTAMP
```

---

### Target Types

```text
DISCUSSION

REPLY

FAQ
```

---

### Vote Types

```text
UPVOTE

DOWNVOTE
```

---

# Consensus Domain

Consensus is one of CrowdMind's core differentiators.

The platform measures community agreement before AI synthesis.

---

# Consensus Signals Table

## Purpose

Stores agreement indicators.

---

### Fields

```sql
id UUID PRIMARY KEY

discussion_id UUID

reply_id UUID

agreement_score DECIMAL

trust_score DECIMAL

reputation_weight DECIMAL

created_at TIMESTAMP
```

---

### Consensus Calculation Factors

```text
Upvotes

Downvotes

Contributor Reputation

Discussion Activity

Accepted Answers

Participation Diversity
```

---

# FAQ Domain

FAQs are the primary knowledge artifacts.

---

# FAQ Candidates Table

## Purpose

Stores AI-generated draft knowledge.

Candidates require human review.

---

### Fields

```sql
id UUID PRIMARY KEY

discussion_id UUID

generated_by_ai BOOLEAN

title VARCHAR

content TEXT

confidence_score DECIMAL

status VARCHAR

created_at TIMESTAMP

updated_at TIMESTAMP
```

---

### Status Values

```text
PENDING

UNDER_REVIEW

APPROVED

REJECTED
```

---

### Relationships

```text
Discussion
      │
      ▼
FAQ Candidate
```

---

# Published FAQs Table

## Purpose

Stores approved knowledge artifacts.

---

### Fields

```sql
id UUID PRIMARY KEY

candidate_id UUID

slug VARCHAR UNIQUE

title VARCHAR

content TEXT

category_id UUID

version_number INTEGER

confidence_score DECIMAL

community_agreement_score DECIMAL

published_by UUID

published_at TIMESTAMP

created_at TIMESTAMP

updated_at TIMESTAMP

deleted_at TIMESTAMP NULL
```

---

### Relationships

```text
FAQ
 │
 ├── Versions
 ├── Contributors
 ├── Sources
 └── Analytics
```

---

# FAQ Contributors Table

## Purpose

Tracks contributors.

Knowledge attribution is mandatory.

---

### Fields

```sql
id UUID PRIMARY KEY

faq_id UUID

user_id UUID

contribution_type VARCHAR

created_at TIMESTAMP
```

---

### Contribution Types

```text
QUESTION_AUTHOR

DISCUSSION_PARTICIPANT

FAQ_EDITOR

FAQ_APPROVER
```

---

# FAQ Sources Table

## Purpose

Maintain traceability.

Every FAQ must explain where knowledge originated.

---

### Fields

```sql
id UUID PRIMARY KEY

faq_id UUID

source_type VARCHAR

source_id UUID

created_at TIMESTAMP
```

---

### Source Types

```text
QUESTION

DISCUSSION

REPLY

EXTERNAL_REFERENCE
```

---

# Knowledge Evolution Domain

Knowledge should evolve continuously.

---

# FAQ Versions Table

## Purpose

Version history for knowledge.

---

### Fields

```sql
id UUID PRIMARY KEY

faq_id UUID

version_number INTEGER

title VARCHAR

content TEXT

change_summary TEXT

created_by UUID

approved_by UUID

created_at TIMESTAMP
```

---

### Example

```text
Version 1
    ↓
Discussion Update
    ↓
Version 2
    ↓
Community Validation
    ↓
Version 3
```

---

# Knowledge Evolution Events Table

## Purpose

Track why knowledge changed.

---

### Fields

```sql
id UUID PRIMARY KEY

faq_id UUID

version_id UUID

event_type VARCHAR

description TEXT

triggered_by UUID

created_at TIMESTAMP
```

---

### Event Types

```text
NEW_DISCUSSION

CORRECTION

CLARIFICATION

COMMUNITY_REQUEST

MODERATOR_UPDATE
```

---

# Knowledge Collections

## Purpose

Personal knowledge management.

Users can save and organize knowledge.

---

# Collections Table

### Fields

```sql
id UUID PRIMARY KEY

user_id UUID

name VARCHAR

description TEXT

created_at TIMESTAMP

updated_at TIMESTAMP
```

---

# Collection Items Table

### Fields

```sql
id UUID PRIMARY KEY

collection_id UUID

target_type VARCHAR

target_id UUID

created_at TIMESTAMP
```

---

### Target Types

```text
FAQ

DISCUSSION

QUESTION
```

---

# Saved Knowledge Table

## Purpose

Quick bookmarks.

---

### Fields

```sql
id UUID PRIMARY KEY

user_id UUID

target_type VARCHAR

target_id UUID

created_at TIMESTAMP
```

---

# Relationship Overview

```text
User
 │
 ├── Questions
 │
 ├── Discussions
 │
 ├── Replies
 │
 └── Votes

Question
 │
 ▼
Discussion
 │
 ├── Replies
 ├── Votes
 └── Consensus

Discussion
 │
 ▼
FAQ Candidate
 │
 ▼
Published FAQ
 │
 ├── Versions
 ├── Contributors
 ├── Sources
 └── Evolution Events
```
# Moderation Domain

The Moderation Domain protects:

* Knowledge Quality
* Community Safety
* Platform Integrity

Every moderation action must be auditable.

---

# Reports Table

## Purpose

Stores reports submitted by users.

---

### Fields

```sql
id UUID PRIMARY KEY

reporter_id UUID

target_type VARCHAR

target_id UUID

reason VARCHAR

description TEXT

severity VARCHAR

status VARCHAR

created_at TIMESTAMP

updated_at TIMESTAMP
```

---

### Target Types

```text
QUESTION

DISCUSSION

REPLY

FAQ

USER
```

---

### Severity Levels

```text
LOW

MEDIUM

HIGH

CRITICAL
```

---

### Status Values

```text
OPEN

UNDER_REVIEW

RESOLVED

DISMISSED
```

---

# Moderation Actions Table

## Purpose

Tracks enforcement actions.

---

### Fields

```sql
id UUID PRIMARY KEY

report_id UUID

target_user_id UUID

moderator_id UUID

action_type VARCHAR

action_reason TEXT

expires_at TIMESTAMP NULL

created_at TIMESTAMP
```

---

### Action Types

```text
WARNING

CONTENT_REMOVAL

TEMP_SUSPENSION

PERMANENT_BAN

ESCALATION
```

---

# Investigation Notes Table

## Purpose

Internal moderator notes.

---

### Fields

```sql
id UUID PRIMARY KEY

report_id UUID

moderator_id UUID

note TEXT

created_at TIMESTAMP
```

---

# Moderation Audit Log

## Purpose

Complete moderation traceability.

---

### Fields

```sql
id UUID PRIMARY KEY

entity_type VARCHAR

entity_id UUID

action VARCHAR

performed_by UUID

metadata JSONB

created_at TIMESTAMP
```

---

# Reputation Domain

Reputation reflects trust.

It is not gamification.

---

# Reputation History Table

## Purpose

Stores reputation changes.

---

### Fields

```sql
id UUID PRIMARY KEY

user_id UUID

change_amount INTEGER

event_type VARCHAR

description TEXT

created_at TIMESTAMP
```

---

### Event Types

```text
QUESTION_CREATED

ANSWER_UPVOTED

FAQ_PUBLISHED

FAQ_APPROVED

COMMUNITY_CONTRIBUTION

MODERATION_PENALTY
```

---

# Achievements Table

## Purpose

Recognition system.

---

### Fields

```sql
id UUID PRIMARY KEY

name VARCHAR

description TEXT

icon VARCHAR

created_at TIMESTAMP
```

---

# User Achievements Table

## Purpose

Achievement assignment.

---

### Fields

```sql
id UUID PRIMARY KEY

user_id UUID

achievement_id UUID

awarded_at TIMESTAMP
```

---

# Notification Domain

Notifications increase engagement and awareness.

---

# Notifications Table

## Purpose

Stores user notifications.

---

### Fields

```sql
id UUID PRIMARY KEY

user_id UUID

type VARCHAR

title VARCHAR

message TEXT

metadata JSONB

is_read BOOLEAN

created_at TIMESTAMP
```

---

### Notification Types

```text
REPLY_RECEIVED

MENTION

FAQ_PUBLISHED

REPUTATION_CHANGED

MODERATION_UPDATE

SYSTEM_NOTIFICATION
```

---

# Notification Preferences Table

## Purpose

User notification settings.

---

### Fields

```sql
id UUID PRIMARY KEY

user_id UUID

email_enabled BOOLEAN

push_enabled BOOLEAN

in_app_enabled BOOLEAN

preferences JSONB

updated_at TIMESTAMP
```

---

# Analytics Domain

Analytics powers platform intelligence.

---

# Analytics Events Table

## Purpose

Store product events.

---

### Fields

```sql
id UUID PRIMARY KEY

event_name VARCHAR

user_id UUID NULL

entity_type VARCHAR

entity_id UUID

metadata JSONB

created_at TIMESTAMP
```

---

### Example Events

```text
QUESTION_CREATED

DISCUSSION_CREATED

FAQ_PUBLISHED

SEARCH_EXECUTED

REPORT_SUBMITTED
```

---

# Daily Analytics Table

## Purpose

Pre-aggregated metrics.

---

### Fields

```sql
id UUID PRIMARY KEY

date DATE

new_users INTEGER

new_questions INTEGER

new_discussions INTEGER

new_faqs INTEGER

active_users INTEGER

created_at TIMESTAMP
```

---

# AI Domain

AI actions should be observable.

---

# AI Requests Table

## Purpose

Track AI usage.

---

### Fields

```sql
id UUID PRIMARY KEY

user_id UUID

provider VARCHAR

operation_type VARCHAR

prompt_version VARCHAR

response_time_ms INTEGER

token_usage INTEGER

status VARCHAR

created_at TIMESTAMP
```

---

### Providers

```text
GEMINI

GROQ
```

---

### Operations

```text
QUESTION_ANALYSIS

FAQ_GENERATION

DISCUSSION_SUMMARY

KNOWLEDGE_EVOLUTION
```

---

# Search Domain

## Vector Embeddings Table

Purpose:

Semantic Search.

---

### Fields

```sql
id UUID PRIMARY KEY

entity_type VARCHAR

entity_id UUID

embedding VECTOR(1536)

created_at TIMESTAMP
```

---

### Entity Types

```text
QUESTION

DISCUSSION

FAQ
```

---

# Search History Table

## Purpose

Search analytics.

---

### Fields

```sql
id UUID PRIMARY KEY

user_id UUID NULL

query TEXT

results_count INTEGER

created_at TIMESTAMP
```

---

# Indexing Strategy

## Mandatory Indexes

Users

```sql
username

email

clerk_user_id
```

---

Questions

```sql
category_id

user_id

status
```

---

Discussions

```sql
question_id

status

created_by
```

---

Replies

```sql
discussion_id

user_id

parent_reply_id
```

---

Published FAQs

```sql
slug

category_id

published_at
```

---

Reports

```sql
status

severity

reporter_id
```

---

Notifications

```sql
user_id

is_read
```

---

Analytics Events

```sql
event_name

created_at
```

---

# Full Text Search Indexes

Use PostgreSQL Full Text Search.

Recommended:

```sql
GIN Index
```

For:

```text
Questions

Discussions

Replies

Published FAQs
```

---

# Vector Indexes

Use:

```sql
IVFFLAT
```

or

```sql
HNSW
```

depending on pgvector version.

For:

```text
Embeddings Table
```

---

# Constraints

## Unique Constraints

Users

```sql
username

email

clerk_user_id
```

---

Categories

```sql
slug
```

---

Published FAQs

```sql
slug
```

---

# Foreign Key Rules

Always use:

```sql
ON DELETE RESTRICT
```

for critical entities.

Avoid cascade deletion on knowledge records.

---

# ERD Overview

```text
Users
 │
 ├── Questions
 │
 ├── Discussions
 │
 ├── Replies
 │
 ├── Votes
 │
 ├── Reports
 │
 ├── Reputation History
 │
 └── Notifications

Questions
 │
 ▼
Discussions
 │
 ├── Replies
 ├── Votes
 └── Consensus Signals

Discussions
 │
 ▼
FAQ Candidates
 │
 ▼
Published FAQs
 │
 ├── FAQ Versions
 ├── Contributors
 ├── Sources
 └── Evolution Events

Reports
 │
 ▼
Moderation Actions

FAQs
 │
 ▼
Embeddings
```

---

# Database Scaling Strategy

## Current Stage

Single PostgreSQL Instance.

Supports:

```text
100K+ Users

1M+ Discussions

1M+ FAQs
```

---

## Future Scaling

Phase 1

```text
Read Replicas
```

---

Phase 2

```text
Connection Pooling
```

---

Phase 3

```text
Partitioning
```

for:

* Analytics Events
* Notifications
* AI Requests

---

Phase 4

```text
Dedicated Search Infrastructure
```

if required.

---

# Backup Strategy

Database Backup:

Daily

Retention:

30 Days

---

# Recovery Objectives

RPO:

```text
24 Hours
```

Maximum acceptable data loss.

---

RTO:

```text
4 Hours
```

Maximum acceptable downtime.

---

# Final Database Statement

The CrowdMind database is designed around one core principle:

```text
Knowledge Must Be Traceable.
```

Every question, discussion, consensus signal, AI synthesis, moderation action, reputation event, and knowledge evolution step must be explainable, auditable, and recoverable.

The schema prioritizes:

* Integrity
* Traceability
* Scalability
* Knowledge Evolution

over short-term implementation convenience.
