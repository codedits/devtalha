---
name: nextjs-fullstack-practices
description: "Best practices workflow for modern Next.js apps with UI, backend APIs, database design, migrations, debugging, and consistency audits. Use when building or refactoring full-stack features, fixing logical bugs, validating admin panels, and preventing frontend-backend-data drift."
argument-hint: "Feature, module, or bug to audit and implement"
user-invocable: true
---

# Next.js Full-Stack Practices

## What This Skill Produces
- A production-ready implementation plan and execution path for a Next.js feature.
- Consistent contracts across frontend props, API handlers, and database schema.
- Migration-safe database changes with idempotent SQL patterns.
- A debugging and verification checklist that catches logical regressions early.

## Opinionated Defaults
- Validation: Zod schemas for request parsing, payload sanitization, and response contracts.
- Database access: Supabase query helper pattern in a central data layer, with typed wrappers and cache-tag aware fetchers.
- Testing: Playwright for critical UI flows plus API contract checks for admin and content routes.
- UI: Tailwind CSS with reusable component primitives and section-level config objects.

Default rule:
- Use these defaults unless the repository already has an established equivalent pattern.

## When To Use
- New feature work in app router projects.
- Admin panel plus content-driven frontend systems.
- Backend route design and data validation.
- Database schema evolution and migration hardening.
- Logical bug triage where symptoms appear in one layer but root cause is elsewhere.

## Core Workflow

### 1. Scope and Contract First
1. Define user-facing behavior and edge cases.
2. Define the data contract for each layer:
- UI props shape
- API request and response shape
- DB row shape and constraints
3. Map source of truth for each field to avoid duplicate ownership.

Decision point:
- If a field is editable in admin but not rendered in frontend, either wire it to frontend or remove it from admin config.

### 2. Frontend Implementation Standards
1. Keep components focused: data in container pages, presentation in components.
2. Use explicit fallback behavior only when intentional.
3. Avoid hidden hardcoded content when the system is content-managed.
4. Prefer clear empty states over fake static fallback datasets in production workflows.
5. Keep section-level settings separate from list item content when appropriate.

Quality checks:
- Every admin-editable field has visible user impact or documented reason not to.
- No duplicate hardcoded labels that should come from DB.

### 3. Backend Route Standards
1. Use strict allowlists for section or table names.
2. Parse JSON with Zod and return clear 400 errors for malformed payloads.
3. Sanitize payloads with explicit editable field allowlists.
4. Validate IDs and required fields before DB calls.
5. Return consistent error messages and status codes.

Decision point:
- For singleton sections, always fetch latest row safely and protect against accidental duplicates.

### 4. Database and Migration Standards
1. Write schema changes as idempotent SQL:
- create table if not exists
- alter table add column if not exists
- drop policy if exists before create policy
2. Use singleton enforcement for one-row tables.
3. Make seed logic idempotent with where-not-exists patterns.
4. Add constraints that match application assumptions.

Quality checks:
- Re-running migration does not break.
- Re-running seed does not duplicate singleton or canonical list data.

### 5. Logical Debugging Playbook
1. Reproduce issue and capture exact failing path.
2. Trace flow end-to-end:
- UI form payload
- API validation and sanitizer behavior
- SQL write and read behavior
- frontend render mapping
3. Check for contract mismatches and type coercion errors.
4. Fix at both layers when needed:
- client guard for better UX
- server guard for safety
5. Verify with build plus runtime smoke tests.

Common failure patterns to check:
- Empty string UUID or invalid ID format.
- single-row reads failing due to duplicate rows.
- Reorder logic reporting success on non-2xx network responses.
- Admin field present but frontend never consumes it.

### 6. Verification and Completion Gates
Before marking done, confirm all:
1. Build passes.
2. API routes return correct codes for valid and invalid payloads.
3. Admin create and update flows succeed with realistic data.
4. Singleton tables have one row only.
5. Sort orders are deterministic and unique where expected.
6. Frontend reflects admin changes without hard refresh issues.
7. Playwright smoke tests pass for core admin and public content paths.

## Output Format For Each Task
- Findings by severity with file references.
- Concrete fixes applied.
- Database actions taken.
- Verification results.
- Residual risks and optional next hardening steps.

## Optional Extensions
- Add schema validators per section.
- Add audit logging for admin mutations.
- Add rate limiting and CSRF protections for admin auth flows.
- Add automated contract tests between API responses and component props.
