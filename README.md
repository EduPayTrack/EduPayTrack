# EduPayTrack

EduPayTrack is a school fee payment and verification platform built for students, accounts staff, and administrators. It combines receipt upload, OCR-assisted extraction, approval workflows, reconciliation support, reporting, messaging, and document generation.

## Current Status

The system is in an advanced pre-production stage. Core backend and frontend TypeScript builds pass, and the platform is suitable for controlled deployment, pilot evaluation, and defense presentation. A few production-hardening items still remain, especially around deployment strategy, long-term auth storage, and broader automated test coverage.

## Core Capabilities

- Student registration, login, payment upload, history, statements, and clearance letters
- Admin and accounts workflows for verification, review, reconciliation, and reporting
- OCR-assisted receipt scanning with Groq vision and Python EasyOCR fallback
- Role-based access control with JWT plus database-backed active session validation
- Audit logging, notifications, messaging, and registry/branding configuration

## Security Notes

- JWTs are validated against live session state in the database on protected routes
- Session expiry is aligned to 12 hours
- Self-service password reset is disabled by default
- `PASSWORD_RESET_MODE=insecure-demo` should only be used in controlled demo environments
- Admin-assisted password resets remain available

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL
- npm

### Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment

Create `backend/.env` from `backend/.env.example`.

Important variables:

- `DATABASE_URL`
- `JWT_SECRET`
- `PORT`
- `NODE_ENV`
- `GROQ_API_KEY`
- `PASSWORD_RESET_MODE`

Recommended defaults:

- `PASSWORD_RESET_MODE=disabled`
- Set `GROQ_API_KEY` if you want the primary OCR path enabled



## Verified Locally

- Backend build: `npm.cmd run build`
- Frontend TypeScript build: `npx.cmd tsc -b`
