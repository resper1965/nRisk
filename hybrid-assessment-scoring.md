# Hybrid Assessment & Scoring Engine Implementation

> Implementing the logic to cross-check automated scan findings against manual assessment answers, providing a composite risk score.

## Overview

The goal is to implement the "Assessments Híbridos" module. This involves:

1. **Database**: Tables for questions, answers, and assessments with RLS.
2. **Backend**: A scoring engine in Go that detects inconsistencies between scans and manual answers.
3. **Frontend**: A premium CISO dashboard with Score Indicators and Spider Charts.
4. **Security**: Rigorous multi-tenancy isolation.

## Project Type: WEB (Next.js + Go)

## Tech Stack

- **Frontend**: Next.js 16.1, React 19, Tailwind CSS 4, Framer Motion, Recharts.
- **Backend**: Go 1.22, Gin Framework.
- **Database**: Cloud Firestore / Cloud SQL (PostgreSQL).
- **Security**: Firebase Auth + JWT middleware.

## Success Criteria

- [ ] Backend logic successfully marks "Inconsistent" answers.
- [ ] Score indicators in the dashboard reflect real-time data.
- [ ] Multi-tenancy is enforced at the database and API levels.
- [ ] All verification scripts (`security_scan.py`, `ux_audit.py`) return success.

## File Structure Changes

### Backend

- `backend/internal/assessment/crosscheck.go` [NEW]
- `backend/internal/assessment/scoring.go` [MODIFY]
- `backend/internal/domain/assessment.go` [MODIFY]
- `backend/migrations/002_assessment_schema.sql` [NEW]

### Frontend

- `frontend/src/app/(dashboard)/ciso/page.tsx` [MODIFY]
- `frontend/src/components/dashboard/RoboCISOInsight.tsx` [MODIFY]
- `frontend/src/components/dashboard/ScoreIndicator.tsx` [MODIFY]

## Task Breakdown

### Phase 1: Foundation (Database & Domain)

| Task ID | Name                           | Agent              | Skills          | Priority | Dependencies |
| ------- | ------------------------------ | ------------------ | --------------- | -------- | ------------ |
| T1      | Create Assessment Schema & RLS | database-architect | database-design | P0       | None         |
| T2      | Update Domain Models (Go)      | backend-specialist | api-patterns    | P0       | T1           |

**INPUT**: `nrisk-assessments-hibridos-implementacao.md`
**OUTPUT**: `backend/migrations/002_assessment_schema.sql`, `backend/internal/domain/assessment.go`
**VERIFY**: `go build ./backend/...`

### Phase 2: Backend Logic (Scoring & Cross-check)

| Task ID | Name                                | Agent              | Skills       | Priority | Dependencies |
| ------- | ----------------------------------- | ------------------ | ------------ | -------- | ------------ |
| T3      | Implement `MarkInconsistentAnswers` | backend-specialist | clean-code   | P1       | T2           |
| T4      | Refine Scoring Algorithm            | backend-specialist | api-patterns | P1       | T3           |

**INPUT**: `mapping_logic.json`, `findings` dataset
**OUTPUT**: `backend/internal/assessment/crosscheck.go`
**VERIFY**: Unit tests in `backend/internal/assessment/crosscheck_test.go`

### Phase 3: Frontend Implementation (Dashboard)

| Task ID | Name                            | Agent               | Skills               | Priority | Dependencies |
| ------- | ------------------------------- | ------------------- | -------------------- | -------- | ------------ |
| T5      | Update ScoreIndicator Component | frontend-specialist | frontend-design      | P2       | None         |
| T6      | Integrate Robo-CISO Insights    | frontend-specialist | react-best-practices | P2       | T4           |

**INPUT**: Figma-like descriptions, design tokens
**OUTPUT**: UI updates in `(dashboard)/ciso/page.tsx`
**VERIFY**: Visual review via `npm run dev`

### Phase 4: Security & Verification

| Task ID | Name                         | Agent            | Skills                | Priority | Dependencies |
| ------- | ---------------------------- | ---------------- | --------------------- | -------- | ------------ |
| T7      | Multi-tenancy Security Audit | security-auditor | vulnerability-scanner | P0       | T4, T6       |
| T8      | Full Verification Suite      | test-engineer    | testing-patterns      | P3       | All          |

**INPUT**: Entire codebase
**OUTPUT**: Verification reports
**VERIFY**: `python .agent/scripts/verify_all.py .`

## Phase X: Verification

- [ ] Lint: `npm run lint`
- [ ] Security: `python .agent/skills/vulnerability-scanner/scripts/security_scan.py .`
- [ ] Build: `go build ./backend/... && npm run build --prefix frontend`
