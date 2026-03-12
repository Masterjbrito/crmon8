# CRM ON8 - Project Instructions

## Git Repository
- **Remote:** https://github.com/Masterjbrito/crmon8
- **Branch:** main
- **Rule:** ALL changes MUST be committed and pushed to this repo. Never leave changes uncommitted.

## Stack
- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- NextAuth v5 + Google OAuth
- Google Sheets API + Gmail API (via `googleapis`)
- Zustand (state), Radix UI (components), Leaflet (map)

## Project Structure
- `src/app/` - Pages and API routes
- `src/components/` - UI components (dashboard/, layout/, leads/)
- `src/lib/` - Auth, company config, Google API wrappers
- `src/types/` - TypeScript interfaces
- `src/hooks/` - React hooks
- `src/store/` - Zustand store

## Environment Variables (.env.local)
```
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
NEXTAUTH_SECRET=<random string>
NEXTAUTH_URL=http://localhost:3000
```

## Multi-Company
Companies defined in `src/lib/companies.config.ts`. Add company = add 1 object to array.
