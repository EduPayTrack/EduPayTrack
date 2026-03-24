# EduPayTrack Backend

## Setup

1. Create `.env` from [.env.example](C:\Users\Victor\OneDrive\Desktop\EduPayTrack\backend\.env.example)
2. Install dependencies with `npm install`
3. Generate Prisma client with `npm run prisma:generate`
4. Push schema with `npm run prisma:push`
5. Start dev server with `npm run dev`

## Demo Data

- Bootstrap one admin: `npm run admin:bootstrap -- --email admin@example.com --password Admin12345!`
- Seed a full demo environment: `npm run seed:demo`

Seeded demo users:

- `admin@edupaytrack.local` / `Admin12345!`
- `accounts@edupaytrack.local` / `Accounts12345!`
- `student@edupaytrack.local` / `Student12345!`

## Production Notes

- Set `NODE_ENV=production`
- Set a strong `JWT_SECRET`
- Restrict `CORS_ORIGINS` to your deployed frontend origins
- Run `npm run build` and `npm start`
