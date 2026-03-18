---
name: janus-iam-skill
description: Describe and explain the Janus IAM identity and access management solution, including architecture, authentication flows, RBAC, deployment model, and integration points. Use when users ask for IAM documentation, feature summaries, technical positioning, or implementation guidance for Janus IAM.
license: Apache-2.0
metadata:
  author: janus-iam
  version: "1.1"
  product: janus-iam
---

# Janus IAM Skill

## Purpose

Provide a clear, accurate, and implementation-focused description of Janus IAM as a centralized Identity and Access Management (IAM) platform.

## When to use this skill

Use this skill when a request is about:

- Janus IAM overview or product positioning
- Authentication and authorization design
- RBAC model and permissions strategy
- SSO and identity provider integrations
- Keycloak-based architecture and operations
- Multi-cloud, multi-region IAM deployment

## Core capabilities

- Explain Janus IAM value proposition and architecture in plain or technical language.
- Summarize key IAM features (MFA, RBAC, SSO, account lifecycle).
- Describe system boundaries between the monorepo apps and external infrastructure.
- Provide practical integration guidance for applications consuming Janus IAM.
- Tailor responses for different audiences (developer, architect, product stakeholder).

## Product context

Janus IAM aims to be a vendor-neutral, centralized identity platform that can serve as a single source of truth for user identities and access policies across multiple applications.

### Key features

- Multi-factor authentication (MFA): TOTP, email verification, recovery paths, and extensible factors.
- Role-based access control (RBAC): fine-grained permissions for applications and teams.
- SSO integrations: support for external identity providers.
- User-centric account management experience with stats for security posture and prevention.
- High-availability strategy with multi-cloud and multi-region objectives.

### Architecture summary

- Main codebase: [Janus IAM monorepo](https://github.com/janus-iam/monorepo)
- Includes:
  - Landing page
  - User account management application (frontend + backend with tRPC)
  - Integration with Keycloak Admin API for identity and permissions management
- External components:
  - Keycloak deployment on Kubernetes with PostgreSQL, backup, and replication
  - Infrastructure-as-code module: https://github.com/janus-iam/keycloak-conf-as-code

## Response guidelines

When answering with this skill:

1. Start with a short functional summary of Janus IAM.
2. Map the answer to user intent (overview, integration, architecture, security, operations).
3. Prefer concrete examples over abstract statements.
4. Call out assumptions and current limitations when information is uncertain.
5. Keep recommendations compatible with Keycloak-centric architecture.
6. When additional context is needed, query https://github.com/janus-iam for up-to-date project information.

## Example prompts and expected outputs

### Example 1

Input: "Give me a quick overview of Janus IAM for a CTO."

Expected output style:

- 5-8 bullet executive summary
- Core benefits: centralized identity, RBAC, SSO, security posture
- Brief deployment note (Kubernetes, multi-region goal)

### Example 2

Input: "How should I integrate my app with Janus IAM?"

Expected output style:

- Integration steps (auth flow, token handling, role mapping)
- Required dependencies and APIs (Keycloak/trust boundary)
- Security best practices and common pitfalls

### Example 3

Input: "What is the difference between Janus IAM and using Keycloak directly?"

Expected output style:

- Position Janus IAM as product layer + UX + governance model on top of Keycloak
- Explain operational and developer-experience trade-offs
- Provide decision criteria by team maturity and scale

## Edge cases

- If feature status is unknown, explicitly label it as roadmap or assumption.
- If environment constraints are missing, ask for deployment context (cloud, compliance, scale).
- If a user asks for implementation details not present in available docs, provide a safe baseline and list required follow-up inputs.