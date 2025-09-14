# RBAC Application Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the RBAC application in various environments, from development to production.

## Prerequisites

### System Requirements
- **Node.js**: v14 or higher
- **npm**: v6 or higher
- **MongoDB**: v4.4 or higher
- **Git**: For version control

### Production Requirements
- **Server**: Ubuntu 20.04+ or CentOS 8+
- **RAM**: Minimum 2GB, Recommended 4GB+
- **Storage**: Minimum 20GB SSD
- **Network**: Stable internet connection

## Environment Setup

### 1. Development Environment

#### Local Development
```bash
# Clone the repository
git clone https://github.com/riyajuddin/fullstackrolebaseaccessapp.git
cd fullstackrolebaseaccessapp

# Install dependencies
npm run install:all

# Set up environment variables
cp backend/env.example backend/.env
cp frontend/env.example frontend/.env

# Start MongoDB (if using local instance)
mongod

# Seed the database
npm run seed

# Start development servers
npm run dev
```

#### Environment Variables

**Backend (.env):**
```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/rbac-app
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12
```

**Frontend (.env):**
```env
REACT_APP_API_URL=http://localhost:5001/api
```

### 2. Production Environment

#### Server Setup

**Ubuntu/Debian:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

**CentOS/RHEL:**
```bash
# Update system
sudo yum update -y

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install MongoDB
sudo yum install -y mongodb-org

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo yum install nginx -y
```

## Deployment Methods

### Method 1: Traditional Server Deployment

#### 1. Prepare the Application

```bash
# Clone repository on server
git clone https://github.com/riyajuddin/fullstackrolebaseaccessapp.git
cd fullstackrolebaseaccessapp

# Install dependencies
npm run install:all

# Build frontend for production
cd frontend
npm run build
cd ..
```

#### 2. Configure Environment Variables

**Backend Production (.env):**
```env
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb://localhost:27017/rbac-app-prod
JWT_SECRET=your-very-secure-jwt-secret-key-for-production
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12
```

**Frontend Production (.env):**
```env
REACT_APP_API_URL=https://your-domain.com/api
```

#### 3. Database Setup

```bash
# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod

# Seed production database
cd backend
npm run seed
```

#### 4. Configure PM2

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'rbac-backend',
    script: './backend/src/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 5. Configure Nginx

Create `/etc/nginx/sites-available/rbac-app`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/fullstackrolebaseaccessapp/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/rbac-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. SSL Configuration

Install Certbot:
```bash
sudo apt install certbot python3-certbot-nginx -y
```

Obtain SSL certificate:
```bash
sudo certbot --nginx -d your-domain.com
```

### Method 2: Docker Deployment

#### 1. Create Dockerfile for Backend

Create `backend/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5001

CMD ["npm", "start"]
```

#### 2. Create Dockerfile for Frontend

Create `frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### 3. Create Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    container_name: rbac-mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: rbac-app
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"
    networks:
      - rbac-network

  backend:
    build: ./backend
    container_name: rbac-backend
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: 5001
      MONGODB_URI: mongodb://admin:password@mongodb:27017/rbac-app?authSource=admin
      JWT_SECRET: your-super-secure-jwt-secret
      JWT_EXPIRE: 7d
      BCRYPT_ROUNDS: 12
    ports:
      - "5001:5001"
    depends_on:
      - mongodb
    networks:
      - rbac-network

  frontend:
    build: ./frontend
    container_name: rbac-frontend
    restart: unless-stopped
    environment:
      REACT_APP_API_URL: http://localhost:5001/api
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - rbac-network

volumes:
  mongodb_data:

networks:
  rbac-network:
    driver: bridge
```

#### 4. Deploy with Docker

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Method 3: Cloud Platform Deployment

#### Heroku Deployment

**1. Install Heroku CLI:**
```bash
# Ubuntu/Debian
curl https://cli-assets.heroku.com/install.sh | sh

# macOS
brew install heroku/brew/heroku
```

**2. Prepare for Heroku:**
```bash
# Login to Heroku
heroku login

# Create Heroku apps
heroku create rbac-backend
heroku create rbac-frontend

# Add MongoDB addon
heroku addons:create mongolab:sandbox --app rbac-backend
```

**3. Configure Environment Variables:**
```bash
# Backend environment variables
heroku config:set NODE_ENV=production --app rbac-backend
heroku config:set JWT_SECRET=your-secure-jwt-secret --app rbac-backend
heroku config:set JWT_EXPIRE=7d --app rbac-backend
heroku config:set BCRYPT_ROUNDS=12 --app rbac-backend

# Frontend environment variables
heroku config:set REACT_APP_API_URL=https://rbac-backend.herokuapp.com/api --app rbac-frontend
```

**4. Deploy:**
```bash
# Deploy backend
cd backend
git init
heroku git:remote -a rbac-backend
git add .
git commit -m "Deploy backend"
git push heroku main

# Deploy frontend
cd ../frontend
git init
heroku git:remote -a rbac-frontend
git add .
git commit -m "Deploy frontend"
git push heroku main
```

#### Vercel Deployment (Frontend)

**1. Install Vercel CLI:**
```bash
npm install -g vercel
```

**2. Deploy Frontend:**
```bash
cd frontend
vercel

# Set environment variables
vercel env add REACT_APP_API_URL
```

#### Railway Deployment

**1. Install Railway CLI:**
```bash
npm install -g @railway/cli
```

**2. Deploy:**
```bash
# Login to Railway
railway login

# Deploy backend
cd backend
railway deploy

# Deploy frontend
cd ../frontend
railway deploy
```

## Database Management

### MongoDB Atlas (Cloud Database)

**1. Create MongoDB Atlas Account:**
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a new cluster
- Configure network access
- Create database user

**2. Update Connection String:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rbac-app?retryWrites=true&w=majority
```

### Local MongoDB Management

**1. Backup Database:**
```bash
mongodump --db rbac-app --out /backup/path
```

**2. Restore Database:**
```bash
mongorestore --db rbac-app /backup/path/rbac-app
```

**3. Monitor Database:**
```bash
# Connect to MongoDB shell
mongo

# Show databases
show dbs

# Use database
use rbac-app

# Show collections
show collections

# Query users
db.users.find()
```

## Security Configuration

### 1. Environment Security

**Secure Environment Variables:**
```bash
# Generate secure JWT secret
openssl rand -base64 64

# Set secure file permissions
chmod 600 .env
```

### 2. Server Security

**Firewall Configuration:**
```bash
# Ubuntu/Debian
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw deny 5001  # Block direct backend access
```

**Fail2Ban Configuration:**
```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
```

### 3. Application Security

**Security Headers (Nginx):**
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

## Monitoring and Logging

### 1. Application Monitoring

**PM2 Monitoring:**
```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs

# Restart application
pm2 restart rbac-backend
```

### 2. System Monitoring

**Install monitoring tools:**
```bash
# Install htop for system monitoring
sudo apt install htop -y

# Install iotop for I/O monitoring
sudo apt install iotop -y
```

### 3. Log Management

**Log Rotation:**
```bash
# Configure logrotate
sudo nano /etc/logrotate.d/rbac-app
```

Add configuration:
```
/path/to/rbac-app/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 root root
}
```

## Performance Optimization

### 1. Frontend Optimization

**Build Optimization:**
```bash
# Analyze bundle size
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

**CDN Configuration:**
```nginx
# Serve static files with cache headers
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 2. Backend Optimization

**PM2 Cluster Mode:**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'rbac-backend',
    script: './backend/src/index.js',
    instances: 'max',
    exec_mode: 'cluster'
  }]
};
```

**Database Optimization:**
```javascript
// Add database indexes
db.users.createIndex({ "email": 1 })
db.users.createIndex({ "role": 1 })
db.roles.createIndex({ "name": 1 })
```

## Backup and Recovery

### 1. Database Backup

**Automated Backup Script:**
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/mongodb"
DB_NAME="rbac-app"

mkdir -p $BACKUP_DIR

mongodump --db $DB_NAME --out $BACKUP_DIR/$DATE

# Keep only last 7 days of backups
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \;
```

**Schedule with Cron:**
```bash
# Add to crontab
0 2 * * * /path/to/backup.sh
```

### 2. Application Backup

**Code Backup:**
```bash
# Create application backup
tar -czf rbac-app-backup-$(date +%Y%m%d).tar.gz /path/to/rbac-app
```

## Troubleshooting

### Common Issues

**1. Port Already in Use:**
```bash
# Find process using port
sudo lsof -i :5001

# Kill process
sudo kill -9 PID
```

**2. MongoDB Connection Issues:**
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

**3. Permission Issues:**
```bash
# Fix file permissions
sudo chown -R $USER:$USER /path/to/rbac-app
chmod -R 755 /path/to/rbac-app
```

**4. Memory Issues:**
```bash
# Check memory usage
free -h

# Check swap usage
swapon -s
```

### Log Analysis

**Application Logs:**
```bash
# PM2 logs
pm2 logs rbac-backend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

**System Logs:**
```bash
# System logs
sudo journalctl -u nginx
sudo journalctl -u mongod
```

## Maintenance

### Regular Maintenance Tasks

**1. Weekly Tasks:**
- Check application logs
- Monitor disk space
- Review security updates
- Backup database

**2. Monthly Tasks:**
- Update dependencies
- Review performance metrics
- Security audit
- Clean old logs

**3. Quarterly Tasks:**
- Update system packages
- Review and update SSL certificates
- Performance optimization review
- Disaster recovery testing

This comprehensive deployment guide provides all the necessary information to deploy the RBAC application in various environments with proper security, monitoring, and maintenance procedures.
