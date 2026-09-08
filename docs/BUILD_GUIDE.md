# Bridge Protocol MVP — Build & Compilation Guide

This document is the implementation companion to the Bridge Protocol Specification v1.0.

## 1. Architecture

```text
NETWORK LAYER
  Chapters · NGOs · Student Groups · Communities
                    ↓
PROTOCOL LAYER
  Verification · Matching · Safeguarding · Data Standards
  Case Lifecycle · Transparency
                    ↓
SOFTWARE LAYER
  Beneficiaries · Cases · Volunteers · Donors
  Dashboard · Analytics · Administration · API
```

The network layer represents independent organizations.
The protocol layer defines the shared operating language.
The software layer implements that language.

## 2. Tenant model

```text
Bridge Platform
├── Organization A
│   ├── Users
│   ├── Beneficiaries
│   ├── Volunteers
│   ├── Cases
│   └── Donors
├── Organization B
└── Organization C
```

Every private resource is owned by an organization.

The server checks organization membership before access.

## 3. Case lifecycle

```text
SUBMITTED
    ↓
UNDER REVIEW
    ↓
VERIFIED
    ↓
OPEN
    ↓
MATCHED
    ↓
IN PROGRESS
    ↓
FULFILLED
    ↓
CLOSED
```

Exceptional states:

- rejected
- cancelled
- suspended

## 4. Verification levels

- 0 — Unverified
- 1 — Reviewed
- 2 — Verified
- 3 — Fulfilled

The chapter owns the actual verification procedure.

## 5. Matching

The MVP uses a transparent rules-based scorer:

- proximity
- workload
- reliability
- category/skill match
- general skill
- emergency compatibility

The algorithm recommends; a human coordinator approves.

## 6. Setup

### Install Node

Use Node.js 20 LTS.

### Create project

The original guide uses:

```bash
npx create-next-app@14 bridge-protocol --typescript --tailwind --eslint --app --src-dir --no-import-alias
```

This repository already contains the resulting source structure, so cloning this repository does not require recreating the project.

### Install

```bash
npm install
```

### Configure environment

```bash
cp .env.example .env.local
```

Fill every required value.

### Database

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
```

### Run

```bash
npm run dev
```

### Validate

```bash
npm run typecheck
npm run lint
npm run build
```

### Test API

Use Bruno or curl.

Example:

```bash
curl http://localhost:3000/api/chapters
```

Private endpoints require a valid Supabase session.

## 7. Supabase

Create a project named `bridge-protocol`.

Use:

- PostgreSQL for Prisma
- Auth for identity
- Storage only after secure policies are defined
- Realtime only when a concrete use case exists

Do not put the service-role key in client code.

## 8. Resend

Set:

```env
RESEND_API_KEY="..."
RESEND_FROM_EMAIL="Bridge Protocol <onboarding@yourdomain>"
```

Then use:

```http
POST /api/orgs/:orgId/invites
Content-Type: application/json

{
  "email": "lead@example.org",
  "role": "volunteer"
}
```

The MVP sends an onboarding email. A production version should use signed invitation tokens and automatic membership acceptance.

## 9. Public layer

Required public routes:

- landing page
- chapter directory
- aggregate global dashboard
- documentation

The map uses Leaflet and OpenStreetMap tiles and shows only chapter-level locations.

## 10. Documentation

The repository contains an MVP documentation route at `/docs`.

The original guide recommends Nextra. If a dedicated documentation site is preferred, create a separate Nextra app and migrate the content from the `app/docs` routes into Markdown/MDX.

Recommended command:

```bash
npm install nextra nextra-theme-docs
```

Keep docs deployable independently if the project grows.

## 11. Design workflow

Figma is used for:

- information architecture
- page layouts
- design tokens
- onboarding flows
- public dashboard

Excalidraw is used for:

- architecture diagrams
- tenant isolation diagrams
- protocol diagrams

The supplied Bridge architecture graphics can be placed into the landing page and documentation.

## 12. Bruno collection

Create requests for:

1. create organization
2. list beneficiaries
3. create beneficiary
4. list volunteers
5. create volunteer
6. create case
7. get case
8. generate matches
9. approve match
10. complete match
11. analytics

For every private request, test:

- valid member
- wrong organization member
- insufficient role
- unauthenticated user

The wrong-organization case must return 403/404 and never leak the requested tenant's data.

## 13. 25-day implementation sequence

| Day | Phase | Deliverable |
|---|---|---|
| 1 | Setup | Repo, accounts, dependencies |
| 2–3 | Database | Prisma schema, migration, Supabase |
| 4–5 | Auth | Supabase Auth, tenant guard, RBAC |
| 6–7 | API | Beneficiaries, volunteers |
| 8–10 | API | Cases, donors, matches |
| 11–12 | Matching | Scoring + approval |
| 13–14 | Frontend | Auth + onboarding |
| 15–16 | Frontend | Organization dashboard |
| 17–18 | Public | Landing, chapters, dashboard |
| 19–20 | Matching UI | Coordinator workflow |
| 21 | Docs | Protocol documentation |
| 22–23 | Onboarding | Email + polish |
| 24 | Demo | Seed + demo mode |
| 25 | Release | Build, audit, deployment |

## 14. Post-MVP operations

Use GitHub Projects for:

- bugs
- feature requests
- chapter requests
- protocol changes

Use Discord for:

- chapter lead support
- developer discussion
- announcements

Use batch support windows rather than becoming a chapter's permanent operator.

## 15. Performance

Before launch:

```bash
npm run build
```

Then test:

- homepage
- auth
- onboarding
- dashboard
- API latency
- map loading
- mobile layouts

Run Lighthouse against the public pages.

Target a strong performance/accessibility score, but do not optimize the score at the expense of security or usability.

## 16. Deployment

```bash
git add .
git commit -m "release: Bridge Protocol v1.0 MVP"
git push origin main
```

Connect GitHub to Vercel.

Configure production variables.

Then:

```bash
npx prisma migrate deploy
```

## 17. Before inviting real chapters

Run the following acceptance tests:

### Tenant isolation

Organization A cannot read, modify or delete Organization B records.

### RBAC

Viewer cannot mutate cases.

Volunteer cannot administer an organization.

Coordinator cannot delete the organization.

### Case lifecycle

Every important transition is recorded.

### Matching

Recommendations are reproducible and explainable.

### Privacy

Public routes contain no beneficiary-level sensitive information.

### Demo mode

Every seeded record is visibly marked as simulated.

### Recovery

Database backups and restore procedures are documented.

### Safeguarding

Chapter onboarding explicitly acknowledges the safeguarding rules.

## 18. Definition of done

A stranger can:

1. sign up,
2. create a chapter,
3. configure it,
4. continue through onboarding,
5. add a volunteer,
6. add a beneficiary,
7. create a case,
8. view the case lifecycle,
9. generate match recommendations,
10. approve a match,
11. fulfill the case,
12. see aggregate chapter metrics.

That is the MVP.
