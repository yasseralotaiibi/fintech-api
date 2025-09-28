# Riyada Open Banking MVP

Saudi Open Banking (SAMA AIS/PIS) compliant scaffold delivering a mocked Consent and CIBA flow for early stage pilots.

This monorepo package bootstraps an Express + TypeScript API, Prisma/Postgres data layer, Redis nonce store, static developer demo, and the OpenAPI specification required to accelerate AIS/PIS certification.

## 🎯 MVP Scope

- Mocked Client Initiated Backchannel Authentication (CIBA) with polling token endpoint.
- Consent-as-a-Service APIs with PDPL hooks for consent receipts, data minimisation, and immutable audit logging.
- Stub connectors for Nafath (authentication), Absher (identity verification), and SIMAH (credit data).
- Security guardrails: JWT validation placeholder, nonce protection, rate limiting, Helmet hardening, mTLS/JWS placeholders.
- Developer experience: Swagger UI, static sandbox walkthrough, Jest skeletons, Prisma seed script.
- Containerisation via Docker Compose (API + Postgres + Redis).

## 🧱 Project Structure

```
├── src
│   ├── auth            # CIBA controllers/services
│   ├── consents        # Consent service + PDPL compliance hooks
│   ├── connectors      # Nafath / Absher / SIMAH stubs
│   ├── config          # Env, logger, Prisma, Redis config
│   ├── middleware      # JWT, nonce, rate limiting, mTLS placeholder
│   ├── routes          # Route wiring
│   └── utils           # Audit + JWS placeholders
├── prisma              # Prisma schema & seed script
├── public              # Static sandbox for mocked flow
├── docs                # OpenAPI spec and documentation
└── tests               # Jest skeletons for auth & consents
```

## 🚀 Quickstart

Clone and bootstrap locally:

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

> ℹ️ Replace `<repo-url>` with your Git remote. The stack runs on port **3000** by default. Update `.env` if you need different ports or secrets.

### Environment Variables

Copy `.env.example` to `.env` and adjust for your environment:

- `DATABASE_URL` – Postgres connection string (Docker uses `openbanking` database).
- `REDIS_URL` – Redis connection string.
- `JWT_ISSUER_SIGNING_KEY` – HS256 key for sandbox JWT validation.
- `CONSENT_RECEIPT_WEBHOOK` – Optional PDPL webhook target (stubbed).

### Database & Prisma

```bash
npx prisma migrate dev --name init
npx prisma db seed -- --schema=prisma/schema.prisma --data-seed "ts-node prisma/seed.ts"
```

> The seed script provisions a demo consent + audit log for the sandbox UI.

## 🔐 Security & Compliance Placeholders

- **JWT Validation**: `jwtValidationMiddleware` validates HS256 sandbox tokens. Swap to asymmetric keys + JWKS for production.
- **Nonce Protection**: Redis-backed replay protection aligns with FAPI Advanced nonce requirements.
- **mTLS Placeholder**: `mtlsEnforcementPlaceholder` highlights where API gateway certificate checks should land.
- **JWS Signing**: `/jws-signature` endpoint exposes a stub for outbound response signing.
- **PDPL Hooks**: Consent creation triggers consent receipt issuance, data minimisation checks, and immutable audit logging stubs.
- **Audit Trail**: Prisma `AuditLog` model persists key lifecycle events for regulatory review.

## 🧪 Testing

Jest test suites (`tests/auth`, `tests/consents`) are scaffolded for future integration tests with SuperTest/Prisma test harness. Extend them as connectors and gateways are implemented.

Run tests with `npm run test`.

## 🌐 Developer Sandbox

- Navigate to `http://localhost:3000/demo` for a static walkthrough of the mocked login and consent flow.
- Generate a sandbox JWT signed with the `JWT_ISSUER_SIGNING_KEY` (default: `insecure-development-secret`) for rapid testing.

## 🐳 Docker Compose Stack

`docker-compose.yml` spins up:

- `api`: Node 20 + ts-node-dev for hot reload.
- `postgres`: Postgres 15 with mounted volume for data persistence.
- `redis`: Redis 7 for nonce/auth state storage.

Run `docker-compose up --build` to boot the full stack locally. The API waits for Redis before serving requests.

## 🧭 Roadmap Hints

- Integrate SAMA-compliant consent receipt formats and webhook delivery.
- Replace mocked Nafath/Absher/SIMAH connectors with certified integrations.
- Harden security with production-grade mTLS enforcement and JWS signing (FAPI Adv + CIBA conformance suite).
- Expand Jest suites with pact tests and contract validation for third-party fintech partners.

## 📄 Licensing

Licensed under MIT. See `LICENSE.md` for details.
