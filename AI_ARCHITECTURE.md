# CrowdMind AI Architecture

Version: 1.0

Status: Active

Related Documents:

* context.md
* ARCHITECTURE.md
* DATABASE.md
* API_SPEC.md

---

# Purpose

This document defines:

* AI Architecture
* AI Workflows
* AI Governance
* Prompt Management
* AI Provider Strategy
* Knowledge Synthesis Pipeline

This document is the authoritative source for all AI-related development within CrowdMind.

---

# AI Philosophy

CrowdMind does NOT use AI as the source of truth.

Instead:

```text id="4s7mtv"
Community
    ↓
Consensus
    ↓
AI Synthesis
    ↓
Moderator Review
    ↓
Knowledge
```

AI assists.

Humans govern.

---

# Core Principle

## Traditional AI Systems

```text id="v93w4v"
Question
    ↓
AI
    ↓
Answer
```

Problems:

* Hallucinations
* Low Trust
* No Traceability

---

## CrowdMind Approach

```text id="5y86qe"
Question
    ↓
Discussion
    ↓
Consensus
    ↓
AI Synthesis
    ↓
Review
    ↓
Knowledge
```

Advantages:

* Higher Trust
* Traceability
* Explainability
* Community Validation

---

# AI Responsibilities

AI is responsible for:

### Question Analysis

### Duplicate Detection

### Categorization

### Semantic Search

### Discussion Summarization

### FAQ Candidate Generation

### Knowledge Evolution Suggestions

AI is NOT responsible for:

### Publishing FAQs

### Moderation Decisions

### User Bans

### Governance Decisions

---

# AI Architecture Overview

```text id="i5mrru"
Application Layer
         │
         ▼

     AI Gateway
         │

 ┌───────┼────────┐

 ▼                ▼

Gemini         Groq

         │
         ▼

Prompt Engine
         │
         ▼

Response Validator
         │
         ▼

Business Services
```

---

# AI Provider Strategy

## Design Principle

Provider Independence.

Business logic must never depend on a specific model provider.

---

# Primary Provider

Google Gemini

Responsibilities:

* Question Analysis
* FAQ Generation
* Knowledge Synthesis
* Categorization

Reason:

* Large Context Window
* Strong Reasoning
* Cost Effective

---

# Secondary Provider

Groq

Responsibilities:

* Fast Inference
* Real-Time Summaries
* Fallback Provider

Reason:

* Low Latency
* Cost Efficiency

---

# Future Providers

Supported Architecture:

```text id="jlwmga"
Gemini

Groq

OpenAI

Claude

Self Hosted Models
```

No architectural changes should be required when adding providers.

---

# AI Gateway

The AI Gateway is the only component allowed to communicate with AI providers.

---

## Responsibilities

Provider Selection

Retry Logic

Fallback Logic

Prompt Injection

Response Validation

Observability

Rate Limiting

Usage Tracking

---

## Forbidden Pattern

```python id="wl2rji"
service
 ↓
gemini
```

---

## Required Pattern

```python id="4rb4bk"
service
 ↓
ai_gateway
 ↓
provider_adapter
 ↓
provider
```

---

# AI Gateway Interface

Every provider must implement:

```python id="r7mrv7"
generate()

analyze()

summarize()

embed()
```

Standardized contract.

---

# Provider Adapters

Example:

```text id="2r5g5g"
providers/

gemini_adapter.py

groq_adapter.py
```

---

# AI Operations

CrowdMind currently supports:

```text id="op43w4"
QUESTION_ANALYSIS

FAQ_GENERATION

DISCUSSION_SUMMARIZATION

KNOWLEDGE_EVOLUTION

SEMANTIC_SEARCH
```

---

# Operation 1

Question Analysis

---

## Purpose

Prevent duplicate knowledge creation.

---

## Workflow

```text id="djlwm1"
Question
     ↓
AI Analysis
     ↓
Existing FAQ Search
     ↓
Discussion Search
     ↓
Category Detection
     ↓
Response
```

---

## Output

```json id="8pjlwm"
{
  "duplicate_probability": 0.83,
  "related_faqs": [],
  "related_discussions": [],
  "suggested_category": "Education"
}
```

---

# Operation 2

Discussion Summarization

---

## Purpose

Condense large discussions.

---

## Inputs

Discussion

Replies

Consensus Signals

---

## Outputs

Key Insights

Agreement Areas

Disagreement Areas

Summary

---

# Operation 3

FAQ Candidate Generation

This is the most important AI workflow.

---

## Input

Discussion

Consensus Signals

Accepted Replies

High Reputation Contributors

---

## Output

FAQ Candidate

Not Published FAQ.

---

## Critical Rule

AI can generate:

```text id="34mnjz"
Candidate
```

AI cannot generate:

```text id="wo3gm5"
Published Knowledge
```

without human review.

---
# Consensus Intelligence Engine

The Consensus Intelligence Engine is the core differentiator of CrowdMind.

Unlike traditional forums:

```text id="7k91ma"
Discussion
    ↓
End
```

CrowdMind extracts structured agreement signals.

---

# Purpose

Measure:

* Community Agreement
* Community Confidence
* Knowledge Stability

Before AI synthesis occurs.

---

# Consensus Inputs

The engine evaluates:

```text id="j4qs7m"
Votes

Reply Quality

Accepted Answers

Contributor Reputation

Participation Diversity

Discussion Activity

Moderator Signals
```

---

# Consensus Score

Range:

```text id="l8twpa"
0.0 → 1.0
```

---

### Example

```text id="cb17m5"
0.0 - 0.30
Low Consensus

0.31 - 0.60
Moderate Consensus

0.61 - 0.80
Strong Consensus

0.81 - 1.00
High Consensus
```

---

# Consensus Workflow

```text id="r8xuw3"
Discussion
      ↓
Reply Analysis
      ↓
Trust Weighting
      ↓
Consensus Scoring
      ↓
Knowledge Readiness
      ↓
AI Synthesis
```

---

# Knowledge Readiness Score

Before FAQ generation:

```text id="95m67t"
Discussion Quality

+

Consensus Strength

+

Contributor Trust

+

Evidence Quality
```

---

Output:

```text id="e0wd5w"
READY

NEEDS_DISCUSSION

INSUFFICIENT_DATA
```

---

# Knowledge Synthesis Engine

The Knowledge Synthesis Engine converts consensus into structured knowledge.

---

# Workflow

```text id="mk92qo"
Discussion
      ↓
Consensus
      ↓
Knowledge Extraction
      ↓
FAQ Draft
      ↓
Review Queue
```

---

# Input Sources

Used:

```text id="s8xv5w"
Discussion Content

Replies

Accepted Answers

Consensus Signals

Existing FAQs

Category Context
```

---

# Output Structure

AI produces:

```json id="v2o6z9"
{
  "title": "",
  "summary": "",
  "answer": "",
  "key_points": [],
  "confidence_score": 0.0,
  "sources": []
}
```

---

# Critical Requirement

Every generated FAQ candidate must contain:

```text id="m3pq7n"
Sources

Confidence

Contributors

Discussion References
```

Traceability is mandatory.

---

# Prompt Architecture

Prompts are treated as source code.

---

# Prompt Storage

```text id="q2m7s8"
prompts/

question_analysis/

discussion_summary/

faq_generation/

knowledge_evolution/

semantic_search/
```

---

# Prompt Structure

Every prompt should contain:

```text id="c8v4rz"
System Prompt

Instructions

Output Schema

Examples

Constraints
```

---

# Example Layout

```text id="4jqh6n"
prompts/

faq_generation/

v1.md

v2.md

v3.md
```

---

# Prompt Versioning

All prompts must be version controlled.

---

# Example

```text id="m5p4zu"
FAQ Generation V1

FAQ Generation V2

FAQ Generation V3
```

---

# AI Request Metadata

Every request should record:

```text id="p6o3wk"
Provider

Prompt Version

Response Time

Token Usage

Success Status
```

Stored in:

```text id="e2s1vf"
ai_requests
```

table.

---

# Hallucination Prevention Strategy

CrowdMind prioritizes trust over creativity.

---

# Rule 1

AI cannot invent sources.

Only use:

```text id="q9n5xk"
Discussions

Replies

FAQs

Validated References
```

---

# Rule 2

AI cannot publish knowledge.

Only humans can publish.

---

# Rule 3

AI must explain confidence.

---

# Confidence Levels

```text id="z1h2wk"
LOW

MEDIUM

HIGH
```

based on consensus quality.

---

# Rule 4

AI outputs require schema validation.

---

# Response Validation Layer

```text id="o4k7ma"
Provider Response
        ↓
JSON Validation
        ↓
Schema Validation
        ↓
Business Validation
        ↓
Accepted Response
```

---

# Invalid Response Handling

If validation fails:

```text id="v9m4sd"
Retry

Fallback Provider

Escalate Error
```

---

# RAG Architecture

Future-ready Retrieval-Augmented Generation architecture.

---

# Goal

Improve:

* Accuracy
* Relevance
* Traceability

---

# RAG Workflow

```text id="n5v2xa"
User Query
      ↓
Vector Search
      ↓
Knowledge Retrieval
      ↓
Context Assembly
      ↓
LLM
      ↓
Response
```

---

# Retrieval Sources

```text id="g3m9qw"
Published FAQs

FAQ Versions

Discussions

Accepted Replies
```

---

# Context Prioritization

Priority Order:

```text id="d8v7mr"
Published FAQs

↓

FAQ Versions

↓

Accepted Replies

↓

Discussion Content
```

---

# Embedding Architecture

Embeddings power semantic understanding.

---

# Supported Entities

```text id="k7t5na"
Questions

Discussions

FAQs
```

---

# Embedding Workflow

```text id="y2s4kc"
Entity Created
      ↓
Embedding Generated
      ↓
Stored In pgvector
      ↓
Searchable
```

---

# Embedding Storage

Table:

```text id="j1q8vf"
vector_embeddings
```

---

# Embedding Operations

Supported:

```text id="x6v9wb"
Create

Update

Delete

Refresh
```

---

# Semantic Search Engine

Purpose:

Meaning-based retrieval.

---

# Example

Query:

```text id="f8q2lm"
How can I improve mathematics skills?
```

Should find:

```text id="m9k6ya"
Numeracy Improvement

Quantitative Reasoning

Problem Solving Skills
```

even if exact words differ.

---

# Ranking Strategy

Ranking Score Based On:

```text id="a7u5px"
Vector Similarity

Keyword Relevance

Community Trust

FAQ Quality

Recency
```

---

# Search Pipeline

```text id="q4k7ns"
Keyword Search
      ↓
Vector Search
      ↓
Ranking Engine
      ↓
Results
```

---

# AI Performance Goals

Question Analysis:

```text id="v6m2aq"
< 5 Seconds
```

---

Discussion Summary:

```text id="n7q5ut"
< 10 Seconds
```

---

FAQ Generation:

```text id="p8z3wr"
< 15 Seconds
```

---

Semantic Search:

```text id="w1x7kl"
< 500ms
```

---

# AI Success Metrics

Track:

```text id="c4n8vs"
FAQ Approval Rate

AI Confidence Accuracy

Duplicate Detection Accuracy

Search Relevance

Knowledge Growth

Moderator Acceptance Rate
```

---

# AI Design Principles

Principle 1:

```text id="u2q9wf"
AI Assists
```

---

Principle 2:

```text id="z5m7rk"
Humans Govern
```

---

Principle 3:

```text id="t8v4ny"
Knowledge Must Be Traceable
```

---

Principle 4:

```text id="r3k8qx"
Consensus Before Synthesis
```

---

# Final AI Statement

CrowdMind's AI layer is not designed to replace human expertise.

It is designed to amplify community intelligence.

The AI system exists to:

* Discover patterns
* Organize knowledge
* Summarize consensus
* Suggest improvements

while preserving transparency, traceability, and human governance.

The ultimate source of truth remains:

```text id="m1v6zp"
Community Validated Knowledge
```


---

# Phase 6.5+ AI Services (Implementation Detail)

## Provider-Agnostic AI Service

Location: `backend/app/services/ai_provider.py`

Interface:

```python
async def call_ai(prompt: str, *, json_mode: bool = False, max_tokens: int = 1024) -> dict:
    """Call the active AI provider with automatic fallback.
    Returns: { text, provider, used_fallback, latency_ms }
    """
```

Provider priority:

1. **Google Gemini 2.5 Flash** — primary
2. **Groq (Llama 3.3 70B Versatile)** — fallback on Gemini failure (rate limit, network, timeout)

Failure mode:

- If both providers fail, returns `{ text: "", used_fallback: true, error: "..." }`
- The caller is expected to handle the empty text gracefully (return a generic fallback response, log the error, and emit a metric)

## Consensus Service

Location: `backend/app/services/consensus.py`

Function:

```python
async def calculate_consensus(discussion: Discussion) -> float:
    """Weighted consensus score 0-100.
    Formula:
      consensus = (has_accepted_reply * 30)
                + (upvote_ratio * 30)
                + (participant_diversity * 20)
                + (avg_reputation * 20)
    """
```

Used by: `synthesis.py` (decides if consensus is high enough to trigger auto-synthesis).

## Synthesis Service

Location: `backend/app/services/synthesis.py`

Function:

```python
async def synthesize_faq_from_discussion(
    discussion: Discussion,
    db: AsyncSession,
    *,
    force: bool = False,
) -> FaqCandidate | None:
    """Generate a FAQ candidate from a discussion's accepted reply.
    Returns None if consensus < threshold and force is False.
    """
```

Workflow:

1. Compute consensus score
2. If consensus < 60 and not force → return None (no candidate)
3. Build prompt: accepted reply + community agreement + discussion context
4. Call `call_ai()` with JSON mode
5. Parse response into a `FaqCandidate` draft
6. Save to DB, return the candidate

Hallucination guardrails:

- Source = accepted reply text (required)
- Community quote = highest-upvoted reply
- LLM only summarizes and rephrases
- Output flagged `used_fallback` if AI provider failed

## Evolution Service

Location: `backend/app/services/evolution.py`

Functions:

```python
async def get_timeline(faq_id: UUID) -> dict:
    """Returns { timeline: [versions], events: [events], current_version: int }"""

async def get_diff(faq_id: UUID, from_v: int, to_v: int) -> dict:
    """Returns unified-diff style hunks between two versions."""

async def record_event(faq_id: UUID, event_type: str, description: str, user_id: UUID | None = None) -> EvolutionEvent:
    """Append an EvolutionEvent to the timeline (idempotent on type+timestamp)."""

async def rollback(faq_id: UUID, target_version: int, reason: str, user_id: UUID) -> dict:
    """Non-destructive rollback: auto-snapshots current, reverts to target_version.
    Creates a new FaqVersion + EvolutionEvent.
    """
```

## Knowledge Evolution Pipeline

```
Discussion
    ↓
Reply Accepted
    ↓
ConsensusService.calculate_consensus()  → score
    ↓ ≥ 60
SynthesisService.synthesize_faq_from_discussion()
    ↓
AI Provider (Gemini → Groq fallback)
    ↓
FaqCandidate (status = PENDING)
    ↓
Moderator Review
    ↓
PublishedFaq
    ↓
EvolutionService.record_event("FAQ_PUBLISHED")
    ↓
Visible on /evolution page
```

