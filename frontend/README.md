# ZH International – Frontend (Next.js)

Modern, animated, international-standard corporate website with custom admin panel.

## Setup

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

## Environment

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Pages

- `/` – Homepage (hero, stats, philosophy, featured projects)
- `/about` – About, Vision, Mission, Values
- `/philosophy` – Business Philosophy
- `/projects` – Completed / Ongoing Projects (filterable)
- `/management` – Company Management team
- `/equipment` – Equipment Owned
- `/manpower` – Manpower list
- `/gallery` – Photo Gallery
- `/md-message` – Managing Director Message
- `/contact` – Contact form

## Custom Admin Panel

- `/admin/login` – JWT login
- `/admin/dashboard` – Overview dashboard

Default credentials (from backend): `admin` / `admin123`

## Design System

- Primary: Slate / Dark (#1e293b)
- Accent: Red (#dc2626) – matching logo
- Typography: Geist Sans
- Animations: CSS keyframes + hover effects
- Fully responsive
