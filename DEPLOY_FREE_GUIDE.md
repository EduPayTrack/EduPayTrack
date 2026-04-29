# EduPayTrack Free Deployment Guide

This guide is for deploying EduPayTrack as a school project with a `$0` budget.

Recommended stack:

- Frontend: Cloudflare Pages
- Backend: Render free web service
- Database: Neon free Postgres
- Receipt storage: Cloudinary free

## Why this stack

- Cloudflare Pages is a strong fit for the Vite frontend.
- Render can run the Express backend for free.
- Neon is better than Render free Postgres because Render free databases expire after 30 days.
- Cloudinary prevents uploaded receipt files from disappearing when Render restarts or sleeps.

## Important free-tier tradeoffs

- Render free backend sleeps after idle time and may take about a minute to wake up.
- Render free backend does not provide durable local file storage.
- Neon free is suitable for demos and school projects, but still has usage limits.
- Groq OCR may need a free API key or may be rate-limited depending on your usage.

## Deploy in this order

Follow this order to avoid confusion and reduce errors:

1. Push the code to GitHub
2. Create the Neon database
3. Deploy the backend on Render
4. Run Prisma schema setup
5. Create an admin user
6. Configure Cloudinary
7. Deploy the frontend on Cloudflare Pages
8. Test login, upload, OCR, and review flow

Do not deploy the frontend first. The frontend needs the real backend URL.

## 1. Push code to GitHub

Make sure the latest version of the project is committed and pushed.

## 2. Create a Neon Postgres database

Create a free Neon project and copy the database URL.

It will look similar to:

```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

Keep this safe because the backend needs it before it can start properly.

## 3. Deploy backend on Render

Create a new `Web Service` on Render.

Use these settings:

- Root directory: `backend`
- Build command: `npm ci && npm run build`
- Start command: `npm start`

### Backend environment variables

Set these in Render:

```env
DATABASE_URL=your_neon_database_url
JWT_SECRET=use_a_long_random_secret_here
NODE_ENV=production
PORT=10000
CORS_ORIGINS=https://your-frontend.pages.dev
PASSWORD_RESET_MODE=disabled
GROQ_API_KEY=optional
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Notes:

- `JWT_SECRET` should be long and unpredictable.
- `CORS_ORIGINS` must match your real frontend URL exactly.
- `GROQ_API_KEY` is optional, but useful if you want OCR in the cloud.
- `CLOUDINARY_*` values are needed if you want uploaded receipt files to persist.

## 4. Run Prisma schema setup

After the backend environment variables are ready, run this from your machine:

```bash
cd backend
npx prisma db push
```

This creates the database tables in Neon.

If this step is skipped, the backend may deploy but the app will fail during real use.

## 5. Create an admin user

Run:

```bash
cd backend
node scripts/bootstrap-admin.js --email admin@example.com --password StrongPass123! --firstName Admin --lastName User --role ADMIN
```

You can change the email and password to your preferred values.

## 6. Optional demo data

If you want quick sample data:

```bash
cd backend
node scripts/seed-demo.js
```

This is helpful for testing reconciliation and review flows.

## 7. Configure Cloudinary

Create a free Cloudinary account and copy:

- Cloud name
- API key
- API secret

Set these in Render:

```env
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Why this matters:

- Without Cloudinary, Render free local storage is not reliable for uploaded receipts.
- With Cloudinary configured, saved receipt `proofUrl` values can persist across restarts.

## 8. Deploy frontend on Cloudflare Pages

Create a new Pages project from your GitHub repo.

Use these settings:

- Root directory: `frontend`
- Output directory: `dist`

### Frontend build command

Preferred:

```bash
npm ci && npm run build
```

Fallback if TypeScript errors block deployment:

```bash
npm ci && npx vite build
```

Use the fallback only if the existing frontend typecheck still fails on unrelated files.

### Frontend environment variables

Set these in Cloudflare Pages:

```env
VITE_API_BASE_URL=https://your-render-backend.onrender.com/api
VITE_API_URL=https://your-render-backend.onrender.com
```

Both are needed:

- `VITE_API_BASE_URL` is used for normal API requests
- `VITE_API_URL` is used by the WebSocket client

## 9. Update backend CORS after frontend URL exists

Once Cloudflare Pages gives you the final frontend URL, go back to Render and update:

```env
CORS_ORIGINS=https://your-real-frontend.pages.dev
```

If you later attach a custom domain, update this again.

## 10. Test in this order

Test in this sequence:

1. Open the frontend
2. Log in as admin
3. Log in as student
4. Upload a receipt
5. Confirm OCR status appears
6. Submit payment
7. Open admin payment review
8. Open the saved receipt image or PDF
9. Test statement import
10. Test messaging and WebSockets

This order makes debugging easier.

## Common errors and fixes

### Backend fails immediately on Render

Likely causes:

- wrong `DATABASE_URL`
- missing `JWT_SECRET`
- missing env variables

Check Render logs first.

### Frontend loads but login or API calls fail

Likely causes:

- wrong `VITE_API_BASE_URL`
- backend asleep on Render
- bad `CORS_ORIGINS`

### WebSockets do not work

Likely causes:

- missing `VITE_API_URL`
- backend sleeping on Render
- CORS mismatch

### Uploaded receipts disappear

Likely causes:

- Cloudinary not configured
- app falling back to local `/uploads`

### OCR fails

Likely causes:

- missing `GROQ_API_KEY`
- Groq free tier limits
- image format not supported by the Groq path

### Frontend build fails

Likely causes:

- existing TypeScript issues in unrelated frontend files

If needed for the school demo, temporarily use:

```bash
npm ci && npx vite build
```

## Useful commands

### Create database tables

```bash
cd backend
npx prisma db push
```

### Bootstrap admin

```bash
cd backend
node scripts/bootstrap-admin.js --email admin@example.com --password StrongPass123! --firstName Admin --lastName User --role ADMIN
```

### Seed demo data

```bash
cd backend
node scripts/seed-demo.js
```

### Backend build check

```bash
cd backend
npm run build
```

### Frontend build check

```bash
cd frontend
npm run build
```

## Final recommendation

For the smoothest first deployment:

1. Neon first
2. Render backend second
3. Prisma setup third
4. Admin bootstrap fourth
5. Cloudinary config fifth
6. Cloudflare frontend sixth
7. End-to-end testing last

This is the safest order and helps avoid the classic mistake of deploying everything at once and not knowing which layer actually failed.
