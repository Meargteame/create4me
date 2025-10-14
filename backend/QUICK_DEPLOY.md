# 🚀 Quick Deploy Guide - TL;DR

## Prerequisites
- MongoDB connection string (Atlas or Railway)
- Railway account

## 3-Step Deployment

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
railway login
```

### Step 2: Deploy
```bash
cd backend
railway init
railway up
```

### Step 3: Set Environment Variables
In Railway dashboard → Variables:
```env
NODE_ENV=production
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/create4me
JWT_SECRET=<run: openssl rand -base64 32>
FRONTEND_URL=https://your-frontend-url.com
```

## Test Deployment
```bash
curl https://your-app.railway.app/health
```

## Update Frontend
```env
VITE_API_URL=https://your-app.railway.app/api
```

---

## MongoDB Atlas Quick Setup
1. Go to https://mongodb.com/cloud/atlas
2. Create free cluster
3. Database Access → Add User
4. Network Access → Add IP: `0.0.0.0/0`
5. Copy connection string

---

## All API Routes (with /api prefix)
- `/api/health` - Health check
- `/api/auth/*` - Authentication
- `/api/campaigns/*` - Campaigns
- `/api/creators/*` - Creators
- `/api/applications/*` - Applications
- `/api/connections/*` - Connections
- `/api/tasks/*` - Tasks
- `/api/pages/*` - Pages
- `/api/upload` - File upload

---

**Need detailed instructions?** See `RAILWAY_DEPLOYMENT_GUIDE.md`
