# ZH International – Full Stack Project

Modern international-standard corporate website for **ZH International**.

## Structure

```
artifacts/
├── backend/          # Django + DRF API
│   ├── config/       # Project settings
│   ├── core/         # Models (About, Projects, Manpower, Gallery, etc.)
│   ├── api/          # REST API (serializers, views, JWT auth)
│   ├── media/        # Uploaded files
│   ├── requirements.txt
│   └── README.md
└── frontend/         # Next.js 15/16 + Tailwind
    ├── src/app/      # Pages (Home, About, Projects, Admin…)
    ├── src/components/
    ├── src/lib/api.ts
    ├── public/logo.png
    └── README.md
```

## Quick Start

### Backend

```bash
cd backend
# If venv available:
# python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

- API: http://localhost:8000/api/
- Django Admin (emergency): http://localhost:8000/admin/  
  Credentials: **admin / admin123**

> Note: SQLite DB is at `/tmp/zh_international.db` in this environment.  
> Change `DATABASES` in `config/settings.py` for production.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

- Website: http://localhost:3000
- Custom Admin: http://localhost:3000/admin/login  
  Same credentials: **admin / admin123**

## Features

### Dynamic Content (managed via Admin / API)
- Site Settings & Hero
- About (Vision, Mission, Values, Stats)
- Business Philosophy
- Projects (with categories, status, gallery)
- Company Management team
- Managing Director Message
- Equipment Owned
- Manpower list
- Photo Gallery
- Contact form submissions

### Frontend Design
- Eye-catching international corporate design
- Logo-integrated branding (dark slate + red accent)
- Smooth CSS animations & hover effects
- Fully responsive
- Modern typography

### Custom Admin Panel
- JWT-secured login
- Dashboard with stats
- Ready for extension with full CRUD forms for every module
- Django built-in admin kept only as emergency fallback

## API Highlights

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/login/` | JWT login |
| `GET /api/homepage/` | Aggregated homepage data |
| `GET/POST /api/projects/` | Projects CRUD |
| `GET/POST /api/about/` | About content |
| `GET/POST /api/manpower/` | Manpower |
| `GET/POST /api/gallery/` | Gallery images |
| `POST /api/contacts/` | Public contact form |

All write operations require `Authorization: Bearer <token>`.

---

**ZH International — Building A Better Tomorrow**
