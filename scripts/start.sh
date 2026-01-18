#!/bin/bash

# Artist Commission Dashboard - Start Script

set -e

echo "🚀 Starting Artist Commission Dashboard..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from example..."
    cp .env.example .env
fi

# Build and start containers
echo "🐳 Building and starting containers..."
docker-compose up -d --build

# Wait for MySQL to be ready
echo "⏳ Waiting for MySQL to be ready..."
sleep 20

# Run migrations
echo "📊 Running database migrations..."
docker-compose exec -T backend python manage.py migrate

# Collect static files
echo "📁 Collecting static files..."
docker-compose exec -T backend python manage.py collectstatic --noinput

echo ""
echo "✅ Artist Commission Dashboard is ready!"
echo ""
echo "🌐 Access the application:"
echo "   - Frontend: http://localhost"
echo "   - Backend API: http://localhost:8000/api"
echo "   - Django Admin: http://localhost:8000/admin"
echo "   - Jenkins: http://localhost:8080"
echo ""
echo "📝 Create an admin user:"
echo "   docker-compose exec backend python manage.py createsuperuser"
echo ""
echo "📝 Load sample data:"
echo "   docker-compose exec backend python manage.py shell < scripts/create_sample_data.py"
