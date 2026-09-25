# VartaLang

**VartaLang** is a language-education platform for learning Indian languages — Hindi, English, Tamil, Telugu, Bengali, Marathi, and more — through structured courses, AI-powered practice labs, and exam-prep tracks. This repository is the **frontend web app**, built with Next.js.

> This app is UI-only — it talks to a separate REST API backend (see [Environment Variables](#environment-variables)) for auth, courses, enrollments, and admin data. That backend is not included in this repo.

## Features

- **Landing & marketing pages** — hero, feature highlights, language catalog, learning paths, and exam-prep sections (`app/page.tsx`)
- **Course browsing** — browse by language and view individual course pages (`app/learn/[language]/[courseId]`)
- **Role-based dashboards** — separate dashboard views for students, instructors, and admins, with route-level role gating (`app/dashboard`, `app/dashboard/instructor`, `app/dashboard/admin`)
- **Authentication** — email/password login, registration, and password recovery, with JWT access/refresh token handling and auto-refresh on expiry (`app/context/AuthContext.tsx`, `app/lib/api.ts`)
- **Practice labs** — pronunciation, listening, video immersion, and conversation practice sections (`app/practice`)
- **Static/info pages** — About, Careers, Blog, Help, Privacy, Terms

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| UI library | React 19 |
| Styling | Tailwind CSS 4 |
| Icons | [lucide-react](https://lucide.dev) |
| Language | TypeScript |
| Linting | ESLint (`eslint-config-next`) |

## Getting Started

### Prerequisites

- Node.js 18.18+ (or a compatible runtime)
- A running instance of the VartaLang backend API (see [Environment Variables](#environment-variables))

### Installation

```bash
git clone https://github.com/DhawalShankar/vl-education.git
cd vl-education
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

The app calls the backend at `${NEXT_PUBLIC_API_URL}/api/v1/...` for auth, courses, and admin endpoints, so this must point to a running instance of the API.

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Other scripts

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # run ESLint
```

## Project Structure

```
app/
├── page.tsx                          # Landing page
├── layout.tsx                        # Root layout, wraps app in AuthProvider
├── globals.css                       # Global styles / Tailwind entry
├── context/
│   └── AuthContext.tsx               # Auth state, login/register/logout, token refresh
├── lib/
│   └── api.ts                        # authFetch helper + courseAPI / adminAPI clients
├── auth/login/                       # Login page
├── forgot-password/                  # Password recovery
├── dashboard/                        # Student dashboard
│   ├── instructor/                   # Instructor dashboard
│   └── admin/                        # Admin dashboard
├── learn/                            # Course catalog
│   └── [language]/
│       ├── page.tsx                  # Courses for a given language
│       └── [courseId]/page.tsx       # Single course page
├── practice/                         # Practice labs (+ upcoming/roadmap page)
├── about/, careers/, blog/, help/,
├── privacy/, terms/                  # Static/info pages
└── not-found.tsx                     # 404 page

components/
├── Navbar.tsx
└── Footer.tsx

public/                               # Static assets (logos, icons)
```

## Authentication & Roles

Auth is handled client-side via `AuthContext`, which stores `accessToken` / `refreshToken` in `localStorage` and exposes:

- `user`, `isAuthenticated`, `isGuest`
- `isStudent`, `isInstructor`, `isAdmin`
- `login()`, `register()`, `logout()`

`app/lib/api.ts` wraps `fetch` with automatic Bearer-token injection and silently refreshes the access token on a `401`, redirecting to `/auth/login` if the refresh token is also invalid.

## Deployment

The app can be deployed on any Next.js-compatible host (e.g. [Vercel](https://vercel.com/new)). Make sure `NEXT_PUBLIC_API_URL` is set to your production backend URL in the hosting platform's environment settings.

## License

No license file is currently included in this repository. Add one (e.g. MIT) if you intend for this project to be reused by others.