# Riyada Open Banking MVP

Saudi-centric Open Banking scaffolding that demonstrates how to orchestrate CIBA-style authentication, consent-as-a-service, and national integrations (Nafath, Absher, SIMAH) within SAMA and FAPI Advanced + CIBA guardrails. This repository focuses on developer experience, security placeholders, and PDPL-aligned compliance hooks for an investor-ready minimum viable product.

## Platform Overview

- **Consent-as-a-Service**: Mocked CIBA journey with consent lifecycle management built on TypeScript, Express, Prisma, and Redis.
- **National Connectors**: Sandbox stubs for Nafath (authentication), Absher (identity verification), and SIMAH (credit bureau data).
- **Security & Compliance**: JWT validation middleware, nonce replay detection, rate limiting, Helmet hardening, PDPL consent receipts, audit log hooks, and placeholders for mTLS + JWS signing.
- **Developer Experience**: OpenAPI specification with Swagger UI, static consent demo UI, Jest test skeletons, Dockerized local stack, and Prisma seed script.

## Repository Structure

```
├── src
│   ├── app.ts                 # Express application factory
│   ├── index.ts               # Runtime bootstrap
│   ├── auth/                  # Mocked CIBA flow controllers & services
│   ├── consents/              # Consent service + controller
│   ├── connectors/            # Nafath, Absher, SIMAH stubs
│   ├── compliance/            # PDPL consent receipt & audit placeholders
│   ├── middleware/            # JWT, nonce, rate limiting, mTLS placeholder
│   ├── config/                # Env, logging, Prisma, Redis helpers
│   ├── routes/                # API routers
│   ├── example/               # Demo flow helper endpoint
│   └── utils/                 # JWS placeholder utilities
├── docs/openapi.yaml          # API surface definition
├── public/                    # Static consent UI demo assets
├── prisma/                    # Prisma schema + seed script
├── tests/                     # Jest skeletons for auth & consents
├── docker-compose.yml         # API + Postgres + Redis stack
├── Dockerfile                 # Container build definition
└── README.md                  # You are here
```

## Getting Started

### Prerequisites

- Node.js 20+
- Docker Desktop or Docker Engine
- npm (ships with Node.js)

### Environment Variables

Copy the sample configuration and adjust as needed:

```bash
cp .env.example .env
```

At minimum provide a valid `DATABASE_URL`. JWT verification is configured to use a placeholder JWKS URL and should be replaced when integrating with a real identity provider. During sandboxing you can keep `SKIP_JWT_VALIDATION=true` to bypass remote JWKS lookups.

### Installation & Local Development

```bash
# Clone repo
git clone <repo-url>
cd openbanking-mvp

# Install deps
npm install

# Run in dev mode
npm run dev

# Run dockerized stack
docker-compose up --build

# Run tests
npm run test

# View API docs
http://localhost:3000/docs
```

> ℹ️ The development server expects Postgres and Redis to be reachable using the connection strings from `.env`. Use `docker-compose` for a turnkey local environment.

### Available Scripts

- `npm run dev` — start the TypeScript server via `ts-node-dev` with hot reload.
- `npm run build` — compile TypeScript to JavaScript output in `dist/`.
- `npm run lint` — run ESLint and Prettier consistency checks.
- `npm run test` — execute Jest (skeletons pre-populated for auth & consents).
- `npm run seed` — populate the Prisma database with demo data.
- `npm run prisma:migrate` — run Prisma migrations in development.

## API Highlights

| Endpoint                        | Description                                                                                |
| ------------------------------- | ------------------------------------------------------------------------------------------ |
| `POST /api/ciba/auth/request`   | Initiates mocked CIBA flow, returning `auth_req_id`, `expires_in`, and polling `interval`. |
| `POST /api/mock/nafath/approve` | Simulates Nafath push approval to move request into approved state.                        |
| `POST /api/ciba/auth/token`     | Polls for tokens; issues mock `access_token`/`id_token` once approved.                     |
| `POST /api/consents`            | Creates a consent record (requires JWT with `consents:create`).                            |
| `GET /api/consents`             | Lists consents (requires `consents:read`).                                                 |
| `DELETE /api/consents/{id}`     | Revokes consent (requires `consents:revoke`).                                              |

Interactive documentation is served at [`/docs`](http://localhost:3000/docs) via Swagger UI.

## Compliance & Security Placeholders

- **mTLS**: `mtlsEnforcementPlaceholder` surfaces where mutual TLS checks should be enforced in production.
- **JWS Signing**: `signResponsePlaceholder` and `verifyRequestSignaturePlaceholder` highlight where detached JWS signatures should be generated and validated.
- **PDPL Hooks**: `issueConsentReceipt`, `performDataMinimisationCheck`, and `logAuditEvent` illustrate where PDPL governance, consent receipts, and immutable audit trails plug in.
- **Zero-Trust Controls**: JWT validation ensures scope-aware access, while nonce middleware and rate limiting demonstrate replay protection and abuse throttling.

## Developer Sandbox Experience

- **Static Consent UI**: Navigate to [`/public`](http://localhost:3000/public) for a static walkthrough of the mocked login and consent creation flow.
- **Demo Flow Endpoint**: `GET /demo-flow` returns a programmatic checklist for orchestrating the sandbox journey end-to-end.
- **Connectors**: `src/connectors` contains stubs ready to be extended for real Nafath, Absher, and SIMAH integrations.

## Database & Migrations

Prisma models define `Consent` and `AuditLog` entities with enum-based status tracking. Run migrations with `npm run prisma:migrate` (generates SQL against Postgres). The provided seed script (`npm run seed`) injects a demo consent for quick testing.

## Docker & Local Orchestration

`docker-compose.yml` starts the API alongside Postgres and Redis. The API service waits for Postgres to report healthy before booting. Adjust exposed ports or credentials to match your local environment. Compose is ideal for demonstrating the platform in pitch meetings or internal workshops.

## Extending Toward Production

- Integrate real JWKS / token introspection endpoints.
- Replace PDPL placeholders with connections to audit/event stores and consent receipt distribution.
- Implement genuine mTLS mutual authentication through a service mesh or API gateway.
- Swap mocked connectors with certified integrations for Nafath, Absher, and SIMAH.
- Harden observability (structured logs already JSON-formatted for downstream SIEM ingestion).

---

Built with a developer-first mindset to accelerate compliant Open Banking pilots across Saudi Arabia and the GCC.
