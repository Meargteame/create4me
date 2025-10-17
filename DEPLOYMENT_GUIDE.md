# 🚀 Create4Me Deployment Guide

## Production Deployment - Step by Step

**Version:** 1.0.0  
**Last Updated:** October 17, 2025  
**Target Environment:** Production

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Configuration](#database-configuration)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Domain & DNS Setup](#domain--dns-setup)
7. [SSL Configuration](#ssl-configuration)
8. [Monitoring Setup](#monitoring-setup)
9. [Post-Deployment](#post-deployment)
10. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

### Required Accounts & Services

- [ ] MongoDB Atlas account (free tier available)
- [ ] Hosting provider (Vercel, Netlify, or Railway)
- [ ] Domain name (create4me.et)
- [ ] GitHub repository
- [ ] Email service (Gmail, SendGrid, or Mailgun)
- [ ] Error tracking (Sentry - optional but recommended)
- [ ] Analytics (Google Analytics - optional)

### Required Software

```bash
Node.js >= 18.x
npm >= 9.x or pnpm >= 8.x
Git >= 2.x
```

### Check Your Environment

```bash
node --version
npm --version
git --version
```

---

## ⚙️ Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/create4me.git
cd create4me
```

### 2. Install Dependencies

#### Backend
```bash
cd backend
npm install
# or
pnpm install
```

#### Frontend
```bash
cd backend/react-frontend
npm install
# or
pnpm install
```

---

## 🗄️ Database Configuration

### MongoDB Atlas Setup

#### Step 1: Create Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create new project: "Create4Me"
3. Create new cluster (M0 Free tier)
4. Choose region: closest to Ethiopia (e.g., Frankfurt, Mumbai)
5. Wait for cluster deployment (5-7 minutes)

#### Step 2: Create Database User

1. Go to Database Access
2. Add new database user:
   - Username: `create4me_admin`
   - Password: Generate strong password (save securely)
   - User Privileges: Atlas admin or Read/Write to any database

#### Step 3: Whitelist IP Addresses

1. Go to Network Access
2. Add IP Address:
   - For development: Add your IP
   - For production: Add `0.0.0.0/0` (allow from anywhere)
   - Better: Add specific IPs of your hosting provider

#### Step 4: Get Connection String

1. Go to your cluster
2. Click "Connect"
3. Choose "Connect your application"
4. Copy connection string:

```
mongodb+srv://create4me_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

Replace `<password>` with actual password.

#### Step 5: Create Database and Collections

Connect to MongoDB and run:

```javascript
use create4me

// Collections will be auto-created by Mongoose, but you can verify:
db.createCollection("users")
db.createCollection("creator_profiles")
db.createCollection("campaigns")
db.createCollection("campaign_applications")
```

#### Step 6: Create Indexes (Important for Performance)

```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })
db.users.createIndex({ createdAt: -1 })

// Creator Profiles
db.creator_profiles.createIndex({ userId: 1 }, { unique: true })
db.creator_profiles.createIndex({ username: 1 }, { unique: true })
db.creator_profiles.createIndex({ category: 1, rating: -1 })
db.creator_profiles.createIndex({ isAvailable: 1, rating: -1 })
db.creator_profiles.createIndex({ followers: -1 })

// Campaigns
db.campaigns.createIndex({ userId: 1, createdAt: -1 })
db.campaigns.createIndex({ createdAt: -1 })
db.campaigns.createIndex({ status: 1 })

// Campaign Applications
db.campaign_applications.createIndex({ campaignId: 1, creatorId: 1 })
db.campaign_applications.createIndex({ creatorId: 1, status: 1 })
db.campaign_applications.createIndex({ status: 1, createdAt: -1 })
```

---

## 🔙 Backend Deployment

### Option 1: Railway (Recommended)

#### Step 1: Sign Up

1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub

#### Step 2: Create New Project

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
cd backend
railway init
```

#### Step 3: Configure Environment Variables

In Railway dashboard, add these variables:

```env
NODE_ENV=production
PORT=3001

# MongoDB
MONGODB_URI=mongodb+srv://create4me_admin:PASSWORD@cluster0.xxxxx.mongodb.net/create4me?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-256-bit-key-change-this
JWT_EXPIRES_IN=7d

# CORS
ALLOWED_ORIGINS=https://create4me.et,https://www.create4me.et

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@create4me.et
SMTP_PASS=your-app-specific-password
```

#### Step 4: Deploy

```bash
railway up
```

Your backend will be deployed at: `https://your-project.up.railway.app`

#### Step 5: Set Custom Domain (Optional)

1. Go to Settings
2. Add domain: `api.create4me.et`
3. Update DNS records as instructed

### Option 2: Heroku

```bash
# Install Heroku CLI
npm i -g heroku

# Login
heroku login

# Create app
cd backend
heroku create create4me-api

# Add environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-connection-string
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main
```

### Option 3: DigitalOcean/AWS/VPS

#### Step 1: SSH into Server

```bash
ssh root@your-server-ip
```

#### Step 2: Install Node.js

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verify
node --version
npm --version
```

#### Step 3: Install MongoDB (or use Atlas)

```bash
# Using MongoDB Atlas is recommended
# But if you want local MongoDB:
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt update
apt install -y mongodb-org
systemctl start mongod
systemctl enable mongod
```

#### Step 4: Clone and Setup

```bash
# Create directory
mkdir -p /var/www/create4me
cd /var/www/create4me

# Clone repo
git clone https://github.com/yourusername/create4me.git .

# Install dependencies
cd backend
npm install --production

# Create .env file
nano .env
# Paste your environment variables
```

#### Step 5: Install PM2

```bash
npm install -g pm2

# Start app
pm2 start npm --name "create4me-api" -- start

# Save PM2 config
pm2 save

# Setup startup script
pm2 startup
```

#### Step 6: Setup Nginx

```bash
apt install -y nginx

# Create config
nano /etc/nginx/sites-available/create4me-api

# Paste this config:
```

```nginx
server {
    listen 80;
    server_name api.create4me.et;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/create4me-api /etc/nginx/sites-enabled/

# Test config
nginx -t

# Restart Nginx
systemctl restart nginx
```

---

## 🎨 Frontend Deployment

### Option 1: Vercel (Recommended)

#### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

#### Step 2: Build Locally (Test)

```bash
cd backend/react-frontend
npm run build

# Test production build
npm run preview
```

#### Step 3: Deploy to Vercel

```bash
# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Scope: Your account
# - Link to existing project? No
# - Project name: create4me
# - Directory: ./backend/react-frontend
```

#### Step 4: Configure Environment Variables

In Vercel dashboard:

1. Go to Settings → Environment Variables
2. Add variables:

```env
VITE_API_URL=https://api.create4me.et/api
VITE_APP_NAME=Create4Me
VITE_APP_VERSION=1.0.0
```

#### Step 5: Set Custom Domain

1. Go to Settings → Domains
2. Add domain: `create4me.et` and `www.create4me.et`
3. Update DNS records as instructed

#### Step 6: Deploy Production

```bash
vercel --prod
```

### Option 2: Netlify

#### Step 1: Build Configuration

Create `netlify.toml` in frontend directory:

```toml
[build]
  base = "backend/react-frontend"
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

#### Step 2: Deploy

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
cd backend/react-frontend
netlify deploy --prod
```

### Option 3: Static Hosting (Nginx)

```bash
# On your server
cd /var/www/create4me/backend/react-frontend

# Build
npm run build

# Copy to web root
cp -r dist/* /var/www/html/

# Nginx config
nano /etc/nginx/sites-available/create4me
```

```nginx
server {
    listen 80;
    server_name create4me.et www.create4me.et;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 🌐 Domain & DNS Setup

### DNS Records Configuration

Add these records to your DNS provider:

```
Type    Name              Value                           TTL
A       @                 your-server-ip                  3600
A       www               your-server-ip                  3600
CNAME   api               your-backend-url.railway.app    3600
TXT     @                 "v=spf1 include:_spf.mx.cloudflare.net ~all"
```

For Vercel/Netlify, they'll provide specific DNS records.

### Verification

```bash
# Check DNS propagation
dig create4me.et
dig www.create4me.et
dig api.create4me.et

# Or use online tool: https://dnschecker.org
```

---

## 🔒 SSL Configuration

### Option 1: Automatic SSL (Vercel/Netlify/Railway)

These platforms provide automatic SSL certificates. No action needed!

### Option 2: Let's Encrypt (VPS/DigitalOcean)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get certificate for frontend
certbot --nginx -d create4me.et -d www.create4me.et

# Get certificate for backend
certbot --nginx -d api.create4me.et

# Verify auto-renewal
certbot renew --dry-run

# Setup auto-renewal cron
crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 📊 Monitoring Setup

### 1. Error Tracking - Sentry

#### Frontend Setup

```bash
cd backend/react-frontend
npm install @sentry/react
```

Create `src/lib/sentry.ts`:

```typescript
import * as Sentry from "@sentry/react";

export const initSentry = () => {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      integrations: [new Sentry.BrowserTracing()],
      tracesSampleRate: 0.1,
    });
  }
};
```

Update `src/main.tsx`:

```typescript
import { initSentry } from './lib/sentry';
initSentry();
```

#### Backend Setup

```bash
cd backend
npm install @sentry/node
```

Add to `src/server.ts`:

```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});

// Error handler
app.use(Sentry.Handlers.errorHandler());
```

### 2. Uptime Monitoring - UptimeRobot

1. Go to [UptimeRobot.com](https://uptimerobot.com)
2. Add monitors:
   - Frontend: `https://create4me.et`
   - Backend: `https://api.create4me.et/api/health`
   - Check interval: 5 minutes

### 3. Analytics - Google Analytics

```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## ✅ Post-Deployment

### Verification Checklist

```bash
# 1. Check frontend is accessible
curl -I https://create4me.et

# 2. Check backend health
curl https://api.create4me.et/api/health

# 3. Test authentication
curl -X POST https://api.create4me.et/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 4. Check MongoDB connection
# Should see in backend logs: "✅ MongoDB Connected"

# 5. Test creating a campaign
# Login as brand and create a test campaign

# 6. Test applying to campaign
# Login as creator and apply to campaign
```

### Performance Testing

```bash
# Install Lighthouse CI
npm install -g @lhci/cli

# Run audit
lhci autorun --collect.url=https://create4me.et
```

Target Scores:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

### Load Testing

```bash
# Install Apache Bench
apt install apache2-utils

# Test backend
ab -n 1000 -c 10 https://api.create4me.et/api/health

# Test frontend
ab -n 1000 -c 10 https://create4me.et/
```

### Security Scan

```bash
# Check SSL
ssllabs.com/ssltest/analyze.html?d=create4me.et

# Security headers
securityheaders.com/?q=create4me.et

# Check for vulnerabilities
npm audit
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Backend Not Starting

```bash
# Check logs
pm2 logs create4me-api

# Or Railway/Heroku:
railway logs
heroku logs --tail

# Common fixes:
- Verify MONGODB_URI is correct
- Check JWT_SECRET is set
- Verify PORT is correct
- Check Node.js version
```

#### 2. Frontend Build Fails

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check for errors
npm run build

# Common fixes:
- Update dependencies: npm update
- Check TypeScript errors: npm run type-check
- Verify VITE_API_URL is set
```

#### 3. CORS Errors

Update backend `src/server.ts`:

```typescript
const corsOptions = {
  origin: [
    'https://create4me.et',
    'https://www.create4me.et',
    'http://localhost:5173' // for development
  ],
  credentials: true
};
```

#### 4. Database Connection Issues

```javascript
// Check connection string format
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

// Common issues:
- Password contains special characters (URL encode them)
- IP not whitelisted
- Wrong database name
- Network connectivity
```

#### 5. SSL Certificate Issues

```bash
# Renew certificate
certbot renew

# Check certificate
openssl s_client -connect create4me.et:443

# If expired, force renewal
certbot renew --force-renewal
```

---

## 🔄 Continuous Deployment

### GitHub Actions Setup

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway link ${{ secrets.RAILWAY_PROJECT_ID }}
          railway up

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --token ${{ secrets.VERCEL_TOKEN }} --prod
```

---

## 📱 Mobile App (Future)

### React Native Setup

```bash
# Install Expo CLI
npm install -g expo-cli

# Create new project
expo init create4me-mobile

# Link to same backend API
# Update API_URL to: https://api.create4me.et/api
```

---

## 🎉 Success!

Your Create4Me platform is now live! 🚀

### Next Steps:

1. ✅ Monitor error logs for first 24 hours
2. ✅ Test all critical user flows
3. ✅ Invite beta testers
4. ✅ Collect feedback
5. ✅ Plan next features
6. ✅ Marketing and outreach

### Support

- Documentation: https://docs.create4me.et
- Email: hello@create4me.et
- GitHub: https://github.com/yourusername/create4me

---

**Made with ❤️ for Ethiopian Creators and Brands**

*Last Updated: October 17, 2025*