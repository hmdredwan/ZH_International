# ZH International – Backend (Django + DRF)

## Setup

```bash
# Prefer virtualenv (if available)
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 0.0.0.0:8000
```

**Note:** Database is currently configured at `/tmp/zh_international.db` due to environment constraints. Change in `config/settings.py` for production.

## Default Admin Credentials
- Username: `admin`
- Password: `admin123`

## API Endpoints
- `POST /api/auth/login/` – JWT login
- `GET  /api/homepage/` – Aggregated homepage data
- `GET/POST /api/projects/` – Projects
- `GET/POST /api/about/` – About content
- `GET/POST /api/philosophies/` – Business Philosophy
- `GET/POST /api/management/` – Company Management
- `GET/POST /api/md-message/` – MD Message
- `GET/POST /api/equipment/` – Equipment Owned
- `GET/POST /api/manpower/` – Manpower
- `GET/POST /api/gallery/` – Gallery
- `GET/POST /api/settings/` – Site Settings
- `POST /api/contacts/` – Contact form (public)

All write operations require JWT auth (`Authorization: Bearer <token>`).

## Custom Admin Panel
The primary admin experience is the Next.js frontend at `/admin`.  
Django built-in admin is available at `/admin/` for emergency use only.
