# ADR-002

Title:

Adopt AI Gateway Pattern

Status:

Accepted

Date:

2026-06-01

---

# Context

CrowdMind depends heavily on AI.

Direct provider integrations create:

- Vendor Lock-In
- Harder Testing
- Poor Maintainability

---

# Decision

All AI requests must pass through:

Application
↓
AI Gateway
↓
Provider Adapter
↓
Provider

---

# Consequences

Benefits:

- Provider Independence
- Easier Testing
- Better Monitoring
- Centralized Security

Tradeoffs:

- Additional Abstraction Layer

Accepted.