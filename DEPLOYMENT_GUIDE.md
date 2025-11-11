# Hospital Management System - Deployment Guide

## Quick Start Guide

### Prerequisites
- Python 3.6+
- Node.js 16+
- npm or yarn
- Modern web browser

### Local Development Setup

#### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Make start script executable (Linux/Mac)
chmod +x start.sh

# Start the backend server
./start.sh

# Alternative: Start manually
python3 server.py
```

Backend will run on: `http://localhost:8000`

#### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:3000`

#### 3. Access the Application
1. Open browser and navigate to `http://localhost:3000`
2. Login with default credentials:
   - Username: `admin`
   - Password: `admin123`

---

## Production Deployment

### Option 1: Traditional Server Deployment

#### Backend Deployment

**1. Prepare the Server:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python 3
sudo apt install python3 python3-pip -y

# Create application directory
sudo mkdir -p /var/www/hospital-backend
cd /var/www/hospital-backend
```

**2. Deploy Backend Files:**
```bash
# Copy backend files
sudo cp -r /path/to/backend/* /var/www/hospital-backend/

# Set permissions
sudo chown -R www-data:www-data /var/www/hospital-backend
sudo chmod +x /var/www/hospital-backend/start.sh
```

**3. Create Systemd Service:**
```bash
sudo nano /etc/systemd/system/hospital-backend.service
```

Add the following content:
```ini
[Unit]
Description=Hospital Management System Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/hospital-backend
ExecStart=/usr/bin/python3 /var/www/hospital-backend/server.py
Restart=always

[Install]
WantedBy=multi-user.target
```

**4. Start the Service:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable hospital-backend
sudo systemctl start hospital-backend
sudo systemctl status hospital-backend
```

#### Frontend Deployment

**1. Build the Frontend:**
```bash
cd frontend

# Install dependencies
npm install

# Build for production
npm run build
```

**2. Deploy with PM2 (Recommended):**
```bash
# Install PM2
npm install -g pm2

# Start the application
pm2 start npm --name "hospital-frontend" -- start

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
```

**3. Alternative: Deploy with Systemd:**
```bash
sudo nano /etc/systemd/system/hospital-frontend.service
```

Add:
```ini
[Unit]
Description=Hospital Management System Frontend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/hospital-frontend
ExecStart=/usr/bin/npm start
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

#### Nginx Configuration

**1. Install Nginx:**
```bash
sudo apt install nginx -y
```

**2. Configure Nginx:**
```bash
sudo nano /etc/nginx/sites-available/hospital
```

Add configuration:
```nginx
# Backend API
server {
    listen 80;
    server_name api.yourhospital.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# Frontend
server {
    listen 80;
    server_name yourhospital.com www.yourhospital.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**3. Enable the Site:**
```bash
sudo ln -s /etc/nginx/sites-available/hospital /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### SSL/HTTPS Setup with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d yourhospital.com -d www.yourhospital.com -d api.yourhospital.com

# Test auto-renewal
sudo certbot renew --dry-run
```

---

### Option 2: Docker Deployment

#### Backend Dockerfile
Create `/workspace/backend/Dockerfile`:
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY . .

EXPOSE 8000

CMD ["python3", "server.py"]
```

#### Frontend Dockerfile
Create `/workspace/frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
```

#### Docker Compose
Create `/workspace/docker-compose.yml`:
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - backend-data:/app/database
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - API_URL=http://backend:8000
    depends_on:
      - backend
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

volumes:
  backend-data:
```

#### Deploy with Docker:
```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

### Option 3: Cloud Platform Deployment

#### AWS Deployment

**1. Backend on EC2:**
- Launch Ubuntu EC2 instance
- Follow traditional server deployment steps
- Configure security groups (port 8000)
- Use Elastic IP for static IP

**2. Frontend on EC2 or Amplify:**
- Deploy on same EC2 or separate instance
- Alternative: Use AWS Amplify for frontend
- Configure environment variables

**3. Use RDS (Optional):**
- Migrate from JSON to PostgreSQL
- Configure RDS instance
- Update backend to use RDS

**4. CloudFront (Optional):**
- Set up CloudFront for CDN
- Improve global performance

#### DigitalOcean Deployment

**1. Create Droplet:**
- Ubuntu 20.04 or later
- Minimum 1GB RAM
- Follow traditional deployment

**2. Use App Platform:**
- Connect GitHub repository
- Configure build settings
- Deploy automatically

#### Heroku Deployment

**Backend:**
Create `Procfile` in backend:
```
web: python3 server.py
```

Deploy:
```bash
cd backend
heroku create hospital-backend
git push heroku main
```

**Frontend:**
```bash
cd frontend
heroku create hospital-frontend
git push heroku main
```

#### Vercel Deployment (Frontend Only)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel

# Production deployment
vercel --prod
```

---

## Environment Configuration

### Backend Environment Variables
Create `/workspace/backend/.env`:
```bash
PORT=8000
SECRET_KEY=your_secure_secret_key_here
WHATSAPP_API_KEY=your_whatsapp_api_key
```

### Frontend Environment Variables
Create `/workspace/frontend/.env.production`:
```bash
API_URL=https://api.yourhospital.com
NEXT_PUBLIC_API_URL=https://api.yourhospital.com
```

---

## Database Management

### Backup Strategy

**1. Automatic Backups:**
Create backup script `/workspace/backend/backup.sh`:
```bash
#!/bin/bash

BACKUP_DIR="/backups/hospital"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
cp -r /var/www/hospital-backend/database $BACKUP_DIR/database_$DATE

# Keep only last 30 days
find $BACKUP_DIR -type d -mtime +30 -exec rm -rf {} +

echo "Backup completed: database_$DATE"
```

**2. Set up Cron Job:**
```bash
crontab -e

# Add daily backup at 2 AM
0 2 * * * /var/www/hospital-backend/backup.sh
```

### Restore from Backup
```bash
# Stop the service
sudo systemctl stop hospital-backend

# Restore database
cp -r /backups/hospital/database_YYYYMMDD_HHMMSS /var/www/hospital-backend/database

# Start the service
sudo systemctl start hospital-backend
```

---

## Security Hardening

### 1. Firewall Configuration
```bash
# Install UFW
sudo apt install ufw

# Allow SSH
sudo ufw allow 22

# Allow HTTP/HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Enable firewall
sudo ufw enable
```

### 2. Fail2Ban Setup
```bash
# Install Fail2Ban
sudo apt install fail2ban -y

# Configure
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Start service
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 3. Change Default Credentials
```bash
# Login as admin
# Navigate to Users
# Create new admin user
# Delete or disable default admin
```

### 4. SSL/TLS Configuration
- Always use HTTPS in production
- Configure strong ciphers
- Enable HSTS
- Use TLS 1.2 or higher

---

## Monitoring & Logging

### Application Logs

**Backend Logs:**
```bash
# View systemd logs
sudo journalctl -u hospital-backend -f

# Or manual logging
python3 server.py >> /var/log/hospital-backend.log 2>&1
```

**Frontend Logs:**
```bash
# PM2 logs
pm2 logs hospital-frontend

# Or systemd logs
sudo journalctl -u hospital-frontend -f
```

### System Monitoring

**Install monitoring tools:**
```bash
# htop for system resources
sudo apt install htop

# netstat for connections
sudo apt install net-tools
```

### Set up Monitoring (Optional)

**1. Prometheus + Grafana:**
- Monitor system metrics
- Create dashboards
- Set up alerts

**2. Uptime Monitoring:**
- UptimeRobot
- Pingdom
- StatusCake

---

## Performance Optimization

### 1. Frontend Optimization
```bash
# Build with optimization
npm run build

# Enable compression in Nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

### 2. Backend Optimization
- Implement caching
- Use connection pooling (if migrating to PostgreSQL)
- Optimize JSON file operations

### 3. Database Optimization
- Regular backups and cleanup
- Index optimization (if migrating to SQL)
- Query optimization

---

## Scaling Strategy

### Vertical Scaling
- Increase server resources (CPU, RAM)
- Suitable for small to medium deployments

### Horizontal Scaling
1. **Load Balancer:**
   - Use Nginx or HAProxy
   - Distribute traffic across multiple servers

2. **Multiple Backend Instances:**
   - Run multiple backend servers
   - Share database via network storage

3. **CDN:**
   - Use CloudFlare or AWS CloudFront
   - Cache static assets

---

## Troubleshooting

### Backend Not Starting
```bash
# Check logs
sudo journalctl -u hospital-backend -n 50

# Check if port is in use
sudo lsof -i :8000

# Check permissions
ls -la /var/www/hospital-backend
```

### Frontend Not Loading
```bash
# Check if backend is running
curl http://localhost:8000/api/health

# Check frontend logs
pm2 logs hospital-frontend

# Rebuild
cd /var/www/hospital-frontend
npm run build
pm2 restart hospital-frontend
```

### Database Issues
```bash
# Check database directory permissions
ls -la /var/www/hospital-backend/database

# Reset database (WARNING: deletes all data)
rm -rf /var/www/hospital-backend/database
sudo systemctl restart hospital-backend
```

---

## Maintenance Tasks

### Daily
- Check system logs
- Monitor disk space
- Verify backups

### Weekly
- Review security logs
- Update system packages
- Check application performance

### Monthly
- Security audit
- Database cleanup
- Performance review
- Update dependencies

---

## Rollback Procedure

### If Deployment Fails:

**1. Restore Previous Version:**
```bash
# Backend
cd /var/www/hospital-backend
git checkout previous_working_commit
sudo systemctl restart hospital-backend

# Frontend
cd /var/www/hospital-frontend
git checkout previous_working_commit
npm install
npm run build
pm2 restart hospital-frontend
```

**2. Restore Database:**
```bash
cp -r /backups/hospital/database_LATEST /var/www/hospital-backend/database
sudo systemctl restart hospital-backend
```

---

## Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Frontend is running and accessible
- [ ] Default credentials changed
- [ ] SSL/HTTPS configured
- [ ] Firewall configured
- [ ] Backups configured
- [ ] Monitoring set up
- [ ] Logs accessible
- [ ] WhatsApp API configured (if needed)
- [ ] All features tested
- [ ] User documentation provided
- [ ] Staff training completed

---

## Support & Maintenance

### Getting Help
- Check logs for error messages
- Review documentation
- Check GitHub issues
- Contact system administrator

### Updating the System
```bash
# Backend updates
cd /var/www/hospital-backend
git pull origin main
sudo systemctl restart hospital-backend

# Frontend updates
cd /var/www/hospital-frontend
git pull origin main
npm install
npm run build
pm2 restart hospital-frontend
```

---

**Document Version:** 1.0  
**Last Updated:** 2025-11-11  
**For:** Hospital Management System v1.0.0
