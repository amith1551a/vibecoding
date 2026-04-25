# INF-OS: Master Production Deployment Guide

This document defines the final architectural requirements, security protocols, and governance standards for the Infylogy Staffing OS production environment.

## 1. Zero-Trust AI Proxy Execution Flow
All LLM orchestration MUST flow through a secure backend proxy (Firebase Cloud Functions) following this exact operational order:

1.  **Identity & Authorization**: Verify `admin.auth().verifyIdToken()`.
2.  **Action-Level AuthZ**: Confirm user role has permission for the specific action (e.g., Match, Risk, Signal).
3.  **Scope Enforcement**: Verify user possesses Read Access to the target `recordId`.
4.  **Privacy Minimization**: Redact PII and minimize context BEFORE any processing logic. 
5.  **Rate Limiting**: Enforce role-aware throttling (Default: 5/min; Recruiter/Admin: 20/min).
6.  **Quota & Cooldown Check**: 
    - Verify Project Daily ($5) and Monthly ($100) caps.
    - Block request if user is in their **10-minute restorative cooldown** (Mandatory backend block).
7.  **Cache Interrogation**: 
    - Compute Key: `hash(prompt + relevant_context + task_parameters)`.
    - Return cached result immediately if valid match exists ($0 cost).
8.  **Provider Execution**: 
    - Call Primary (Groq) with a **5–10 second timeout**.
    - Retry once on timeout/5xx.
    - Fallback to Secondary (OpenRouter) if failure persists.
9.  **Finalization**: Log metadata to `ai_usage_logs` and return sanitized response.

## 2. High-Availability & Cache Strategy
1.  **Cache TTL & Invalidation**: 
    - Implement a 24-hour expiration on `ai_cache` entries.
    - Automatically invalidate cache keys if the linked record (**Consultant Resume**/Lead Meta) is modified.
    - **Execution Rule**: If a valid cache exists, the proxy MUST skip LLM provider execution entirely and return the cached response.
2.  **Request Idempotency & Cooldown**: 
    - Block duplicate execution (30s window) using a shared `requestHash` lock.
    - **Persistence**: Cooldown state and daily usage tallies MUST be stored in persistent shared storage (e.g., Firestore) to ensure consistency across stateless function execution.
3.  **Governance Failure Handling**: 
    - If both external providers fail, return a structured error: `{ "status": "FAIL_SAFE" }`.

## 3. Platform Audit & Logging Hierarchy
Maintain four distinct collection streams for absolute traceability:

| Collection | Data Type | Usage |
| :--- | :--- | :--- |
| `engine_logs` | Workflow Transitions | Stage changes only (e.g., Submitted -> Approved). |
| `ai_usage_logs` | AI Execution Data | Metadata only. **NO PII**. |
| `security_audit` | Governance Overrides | Admin Bypasses, Multi-User Overrides (Append-only). |
| `system_logs` | Diagnostics | **Metadata Only**. No prompt contents. **NO PII**. |

## 4. Governance Quotas
Daily role-based credits are strictly enforced at the API layer:
- **Admin**: 500 tasks/day (Subject to project-wide caps).
- **Supervisor**: 50; **Recruiter**: 30; **Accounting**: 20; **Client**: 5.

## 5. Monitoring & Scaling (Cloud Functions)
- **Monitoring Triggers**: Configure **Firebase Alerts** for Fallback Spikes, Budget Thresholds (85%), and repeated user cooldowns.
- **Cold-Start Optimization**: Maintain `minInstances: 1` during core business hours (9AM-5PM EST) to ensure responsive intelligence.
- **Concurrency**: Set initial `maxInstances: 10`. Tune based on production traffic/cost.

## 6. Deployment Roadmap
1.  **Environment Sync**: Run `npm run validate-env` to verify `.env.production`.
2.  **Security Rules**: Deploy `firestore.rules` (Strict immutability for logs/audit).
3.  **Secrets Manager**: Upload `GROQ_API_KEY` and `OPEN_ROUTER_API_KEY` to GCP Secret Manager.
4.  **Backend Logic**: Deploy the AI Proxy with its identity, persistent cache, shared cooldown, and quota logic.

---
**The Infylogy OS is now production-hardened.** This configuration ensures maximum fiscal responsibility while delivering state-of-the-art AI intelligence.
