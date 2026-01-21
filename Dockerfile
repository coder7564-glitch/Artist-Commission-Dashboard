# ===========================================
# ArtistHub - Combined Docker Image
# Contains both Frontend and Backend
# ===========================================

# ---------- Stage 1: Build Frontend ----------
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend

# Copy package files and install dependencies
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# Copy source and build
COPY frontend/ .
RUN npm run build

# ---------- Stage 2: Build Backend + Serve ----------
FROM python:3.11-slim
WORKDIR /app

# Environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies (for MySQL client)
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config \
    nginx \
    supervisor \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Create directories
RUN mkdir -p /app/staticfiles /app/media /var/log/supervisor

# Copy frontend build to nginx html directory
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

# Copy nginx configuration
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Remove default nginx site
RUN rm -f /etc/nginx/sites-enabled/default

# Create supervisor configuration
RUN echo '[supervisord]\n\
nodaemon=true\n\
logfile=/var/log/supervisor/supervisord.log\n\
pidfile=/var/run/supervisord.pid\n\
\n\
[program:nginx]\n\
command=nginx -g "daemon off;"\n\
autostart=true\n\
autorestart=true\n\
stderr_logfile=/var/log/supervisor/nginx.err.log\n\
stdout_logfile=/var/log/supervisor/nginx.out.log\n\
\n\
[program:gunicorn]\n\
command=gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 2\n\
directory=/app\n\
autostart=true\n\
autorestart=true\n\
stderr_logfile=/var/log/supervisor/gunicorn.err.log\n\
stdout_logfile=/var/log/supervisor/gunicorn.out.log\n\
' > /etc/supervisor/conf.d/supervisord.conf

# Create startup script
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
echo "Running migrations..."\n\
python manage.py migrate --noinput\n\
\n\
echo "Creating admin user..."\n\
python manage.py create_admin || true\n\
\n\
echo "Fixing artist profiles..."\n\
python manage.py fix_artist_profiles || true\n\
\n\
echo "Collecting static files..."\n\
python manage.py collectstatic --noinput\n\
\n\
echo "Starting services..."\n\
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf\n\
' > /app/start.sh && chmod +x /app/start.sh

# Expose ports
EXPOSE 80 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost/ && curl -f http://localhost:8000/api/users/ || exit 1

# Start supervisor (runs both nginx and gunicorn)
CMD ["/app/start.sh"]
