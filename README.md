# Artist Commission Dashboard

A full-stack web application for managing artist commissions with separate admin and user dashboards.

## 🚀 Features

### User Dashboard
- Browse and search artists
- Submit commission requests
- Track commission status
- View revision history
- Manage profile settings

### Admin Dashboard
- Manage users, artists, and commissions
- Approve/suspend artist accounts
- View payment transactions
- Analytics and reports
- Platform statistics

## 🛠 Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** with Morning UI design
- **React Router** for navigation
- **Zustand** for state management
- **Axios** for API calls
- **Chart.js** for analytics

### Backend
- **Django 4.2** with Django REST Framework
- **MySQL 8.0** database
- **JWT Authentication** (SimpleJWT)
- **10 Normalized Database Tables**

### DevOps
- **Docker** & Docker Compose
- **Jenkins** CI/CD pipeline
- **Nginx** for frontend serving

## 📊 Database Schema (10 Tables)

1. `users` - Custom user model with roles
2. `user_profiles` - Extended user information
3. `artists` - Artist profiles and settings
4. `artist_portfolios` - Portfolio items
5. `commission_categories` - Commission types
6. `commissions` - Commission requests
7. `commission_revisions` - Revision history
8. `payment_methods` - User payment methods
9. `payments` - Transaction records
10. `notifications` - User notifications

## 🐳 Quick Start with Docker

### Prerequisites
- Docker & Docker Compose
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd artist-commission-dashboard
```

2. **Create environment file**
```bash
cp .env.example .env
# Edit .env with your settings
```

3. **Start all services**
```bash
docker-compose up -d
```

4. **Run migrations**
```bash
docker-compose exec backend python manage.py migrate
```

5. **Create superuser**
```bash
docker-compose exec backend python manage.py createsuperuser
```

6. **Access the application**
- Frontend: http://localhost
- Backend API: http://localhost:8000/api
- Django Admin: http://localhost:8000/admin
- Jenkins: http://localhost:8080

## 🔧 Development Setup

### Backend Development
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Development with Docker
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

## 📁 Project Structure

```
├── backend/
│   ├── apps/
│   │   ├── users/          # User management
│   │   ├── artists/        # Artist profiles
│   │   ├── commissions/    # Commission handling
│   │   ├── payments/       # Payment processing
│   │   └── notifications/  # Notifications
│   ├── config/             # Django settings
│   ├── tests/              # Test files
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── layouts/        # Page layouts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── store/          # State management
│   ├── Dockerfile
│   └── package.json
├── mysql/
│   └── init/               # Database initialization
├── docker-compose.yml
├── docker-compose.dev.yml
├── Jenkinsfile
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/token/` - Obtain JWT token
- `POST /api/token/refresh/` - Refresh token
- `POST /api/users/register/` - User registration

### Users
- `GET /api/users/profile/` - Get current user profile
- `PATCH /api/users/profile/` - Update profile
- `GET /api/users/` - List users (admin)

### Artists
- `GET /api/artists/` - List approved artists
- `GET /api/artists/{id}/` - Artist details
- `POST /api/artists/create/` - Create artist profile

### Commissions
- `GET /api/commissions/` - List user commissions
- `POST /api/commissions/create/` - Create commission
- `GET /api/commissions/{id}/` - Commission details
- `POST /api/commissions/{id}/status/` - Update status

### Payments
- `GET /api/payments/` - List payments
- `POST /api/payments/create/` - Create payment
- `POST /api/payments/{id}/process/` - Process payment

## 🔄 Jenkins CI/CD Pipeline

The Jenkins pipeline includes:

1. **Code Quality Check** - Linting and testing
2. **Backup Previous Build** - Save current state
3. **Build Images** - Docker image creation
4. **Deploy Containers** - Start new containers
5. **Health Check** - Verify services

## 🎨 UI Design

The frontend uses a **Morning UI** design system featuring:
- Clean white backgrounds
- Soft shadows
- Modern rounded corners
- Primary blue accent colors
- Responsive layouts

## 📝 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
