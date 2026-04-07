# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Build (skip tests)
mvn clean package -DskipTests

# Run tests (uses H2 in-memory DB)
mvn test

# Lint check / auto-format (Palantir Java Format via Spotless)
mvn spotless:check
mvn spotless:apply

# Run locally (Spring profile "local" is set automatically in QrpayApplication.java)
# Default local port: 20101
mvn spring-boot:run

# Container build & run (local/dev/prod profiles)
./run-qrpay-podman.sh <profile>
```

Local dev uses H2 in-memory DB (Oracle mode). Schema/data initialized from `src/main/resources/sql/schema.sql` and `sql/data.sql`.

## Architecture

### Stack
- Spring Boot 3.5.5 / Java 21 / Maven
- Spring Security + JWT (jjwt 0.13.0) — stateless, 15-min access / 7-day refresh tokens
- Spring Data JPA + QueryDSL 5.1.0 — JPA for standard CRUD, QueryDSL for complex queries
- H2 (local/test) / Oracle (prod) — schema `BCDBA`, Hibernate `OracleDialect` used for DDL
- Thymeleaf for server-side UI pages
- SpringDoc OpenAPI for Swagger docs (`/swagger-ui/**`, `/v3/api-docs/**`)
- Google ZXing for QR code generation
- Custom JARs in `/libs`: EMV/MPM payment (`emvmpm`), NiceID auth, NSafer security, BC Card BXI interface

### Layers

```
Controller  →  Service  →  Repository (JPA + QueryDSL)  →  DB
```

Controllers are split by concern:
- `/auth/**` — login, token refresh, signup
- `/qrpay/api/v1/**` — member, merchant, transaction APIs
- `/qrpay/api/open/**` — open/external integrations
- `/external/**`, `/qrpay/external/**` — third-party callbacks (Nice SMS, BXI/BC Card)
- `/pages/**` — Thymeleaf UI pages

### Domain Modules (under `src/main/java/com/bccard/qrpay/`)

| Package | Responsibility |
|---------|----------------|
| `auth` | JWT generation/validation, `CustomUserDetailsService`, refresh tokens |
| `member` | Cardholder/staff user entity (`TBMPMMERCDHDINFO`) and CRUD |
| `merchant` | Merchant entity (`TBMPMMERBASINFO`), tip/VAT/name change flows |
| `transaction` | Payment transaction history; uses `TransactionQueryRepository` (QueryDSL) for analytics |
| `mpmqr` | EMV MPM QR code generation — static (`PublishStaticEmvMpmQrService`) and dynamic variants |
| `qrkit` | QR kit application & delivery lifecycle |
| `device` | Device registration |
| `log` | API request/response audit logging (`QrpayLogService`) |
| `common` | Shared enums (`MemberRole`, `MemberStatus`, `MerchantStatus`), base entities, error codes (`QrpayErrorCode`) |

### Key Patterns
- `@LoginMember` custom argument resolver injects the authenticated member into controllers
- All domain exception handling flows through `QrpayErrorCode` enum
- QueryDSL repositories follow the naming `<Domain>QueryRepository` pattern
- Hexagonal-style ports/services pattern used in the `merchant` module
- Role-based access: `MASTER` role required for merchant management endpoints

### Security Config
CORS is open to all origins with credentials. JWT filter intercepts every request; `/auth/**`, `/h2/**`, `/swagger-ui/**`, and `/v3/api-docs/**` are public.