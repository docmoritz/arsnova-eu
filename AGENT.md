# AGENT.md

Critical rules for AI coding agents working in arsnova.eu.

## Always-On Rules

- Work schema-first for API changes: update `libs/shared-types` first, then backend, then frontend.
- Use tRPC plus shared Zod schemas as the contract. Do not add ad-hoc REST endpoints or duplicate DTO definitions in app code.
- Never derive permissions from a route, session code, or client state alone. Host-only backend logic must use validated token checks such as `hostProcedure`; standalone feedback and admin access use their own token models.
- Keep participant payloads minimal. Do not expose solution data such as `isCorrect` while a question is active.
- Preserve the effective-vote rule for Peer Instruction scoring, leaderboards, bonus codes, and exports.
- In `apps/frontend`, use Angular standalone components, Signals, and Angular Material 3 tokens. Do not introduce `BehaviorSubject` or RxJS-only state stores for ordinary UI state. Do not add Tailwind there.
- Any user-facing UI text change must keep the locale set in sync: `de`, `en`, `fr`, `es`, `it`.
- Tests are part of done. Add or update the nearest backend and frontend tests for changed behavior.
- Keep docs in sync when setup, environment variables, deployment, security, tests, admin flow, routes, or user-visible behavior change.
- Never commit secrets, `.env` contents, production credentials, or local operational tokens.

## Working Rules

- Check `git status` before editing and do not overwrite unrelated local changes.
- Prefer focused, codebase-local changes over broad rewrites.
- For API work, update shared schemas, backend implementation, frontend usage, and tests in one coherent slice.
- For UI work, verify mobile layout and localized text length deliberately.
- For production or operator-facing changes, verify against `docker-compose.prod.yml`, `.env.production.example`, `scripts/deploy.sh`, `.github/workflows/ci.yml`, and the production docs.
- For documentation-only work, still check claims against code or canonical docs before editing.

## Validation Baseline

- General dev: `npm run dev`
- Full typecheck: `npm run typecheck`
- Full tests: `npm test`
- Lint: `npm run lint`
- Production-style validation: `npm run build:prod`
- Workspace-scoped validation: `npm run test -w @arsnova/backend`, `npm run test -w @arsnova/frontend`, `npm run build -w @arsnova/shared-types`
- If frontend templates, styles, or localized copy changed, finish with `npm run build:localize -w @arsnova/frontend` or root `npm run build:prod`.
- If Markdown only changed, at minimum run `npx prettier --check <touched-docs>` and `git diff --check -- <touched-docs>`.
- If production/deploy behavior changed, also run the relevant checks from `docs/TESTING.md`.
