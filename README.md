# Bridge Protocol v1.0 MVP

Open infrastructure for grassroots welfare coordination.

## What this repository implements

This MVP follows the Bridge Protocol v1.0 operating model:

- three-layer architecture: Network / Protocol / Software
- multi-tenant organization workspaces
- tenant isolation at the application authorization boundary
- RBAC
- beneficiaries
- volunteers
- donors/resources
- case lifecycle
- verification levels
- audit logging
- rules-based matching with human approval
- public chapter directory
- public aggregate dashboard
- onboarding wizard
- optional Resend transactional email
- seed/demo data
- Vercel Analytics
- documentation routes
- Leaflet + OpenStreetMap chapter map

## Important implementation note

The supplied build guide names `@supabase/auth-helpers-nextjs`. That package has been replaced in this implementation by `@supabase/ssr`, which is the compatible server/browser integration used by the code below. The guide's intended architecture remains the same: Supabase Auth provides identity, Prisma provides application data, and every private organization route checks membership before reading or writing tenant data.

## Requirements

- Node.js 20 LTS recommended
- npm 10+
- a Supabase project
- Git
- a GitHub repository for deployment
- optional: Vercel, Resend, Bruno, Figma, Discord

## Local setup

1. Create a Supabase project named `bridge-protocol`.
2. Copy `.env.example` to `.env.local`.
3. Fill in `DATABASE_URL`, `DIRECT_URL`, Supabase URL/key values.
4. Install dependencies:

```bash
npm install
```

5. Generate Prisma client:

```bash
npx prisma generate
```

6. Create the database:

```bash
npx prisma migrate dev --name init
```

7. Seed simulated chapters:

```bash
npm run db:seed
```

8. Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Supabase Auth configuration

In Supabase Auth URL Configuration:

- Site URL: `http://localhost:3000`
- Redirect URL: `http://localhost:3000/api/auth/callback`

For production, replace these with your Vercel/custom-domain equivalents.

For email confirmation, the signup form sets the redirect to `/api/auth/callback`, which exchanges the confirmation code for a session.

## Useful commands

```bash
npm run dev
npm run build
npm run start
npm run typecheck
npm run lint
npm run db:generate
npm run db:migrate
npm run db:push
npm run db:seed
npm run db:studio
```

## Route map

### Public

- `/`
- `/chapters`
- `/dashboard`
- `/docs`

### Authentication

- `/login`
- `/signup`
- `/api/auth/callback`

### Onboarding

- `/onboarding`

### Organization workspace

- `/:orgSlug/cases`
- `/:orgSlug/beneficiaries`
- `/:orgSlug/volunteers`
- `/:orgSlug/matching`
- `/:orgSlug/analytics`

### API

- `POST /api/orgs`
- `GET /api/chapters`
- `GET/POST /api/orgs/:orgId/beneficiaries`
- `GET/PATCH/DELETE /api/orgs/:orgId/beneficiaries/:id`
- `GET/POST /api/orgs/:orgId/volunteers`
- `PATCH/DELETE /api/orgs/:orgId/volunteers/:id`
- `GET/POST /api/orgs/:orgId/cases`
- `GET/PATCH/DELETE /api/orgs/:orgId/cases/:id`
- `GET/POST/PATCH /api/orgs/:orgId/matches`
- `DELETE /api/orgs/:orgId/matches/:id`
- `GET/POST /api/orgs/:orgId/donors`
- `PATCH/DELETE /api/orgs/:orgId/donors/:id`
- `GET /api/orgs/:orgId/analytics`
- `POST /api/orgs/:orgId/invites`

## Security boundary

Every organization-scoped route calls:

```ts
requireOrgAccess(orgId, allowedRoles?)
```

The guard:

1. obtains the Supabase-authenticated user,
2. maps that identity to the Prisma `User`,
3. finds the organization membership,
4. rejects users who are not members,
5. optionally checks role.

All database queries also include `organizationId` where appropriate. Do not remove either check.

## Demo data

The seed creates:

- Kolkata Chapter
- Dhaka Chapter
- Nairobi Chapter
- one simulated admin
- 3 volunteers per chapter
- 5 beneficiaries per chapter
- 10 cases per chapter spanning lifecycle states

Demo data is explicitly synthetic.

## Deployment to Vercel

1. Push the repository to GitHub.
2. Import it into Vercel.
3. Add the production environment variables.
4. Deploy.
5. Update Supabase Site URL and Redirect URL.
6. Run migrations against production:

```bash
npx prisma migrate deploy
```

Do not expose `SUPABASE_SERVICE_ROLE_KEY` to browser code.

## Production hardening before real beneficiaries

This repository is an MVP. Before real-world deployment:

- enable Supabase Row Level Security if application tables are exposed through Supabase APIs,
- review the privacy/data retention model,
- add rate limiting,
- add CSRF/abuse protections appropriate to the deployment,
- add secure file storage policies before handling documents,
- replace simplistic invitation flow with signed invitations,
- add structured error monitoring,
- perform a tenant-isolation test suite,
- conduct a safeguarding review,
- conduct a jurisdiction-specific legal/privacy review,
- use production email/domain configuration,
- establish backups and recovery procedures.

## Open-source workflow

Recommended branch model:

- `main` — deployable
- `develop` — integration
- feature branches — individual changes

Every meaningful protocol change should update the public specification/changelog.

## Tools from the 25-day guide

The implementation is designed around the guide's stack:

- Zed
- Figma
- Next.js
- Supabase
- Prisma
- Tailwind CSS
- shadcn/ui-compatible component style
- Leaflet/OpenStreetMap
- Resend
- Vercel
- GitHub
- Bruno
- Nextra
- Excalidraw
- GitHub Projects
- Discord
- Vercel Analytics
- optional Tally

The core application itself does not require Figma, Bruno, Excalidraw, Discord or Tally to compile.
