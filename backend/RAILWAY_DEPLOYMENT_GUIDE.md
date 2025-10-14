# 🚀 Railway Deployment Guide for Create4Me Backend

## Prerequisites
- Railway account (sign up at https://railway.app)
- GitHub repository (optional but recommended)
- MongoDB database (Railway MongoDB or MongoDB Atlas)

## Step 1: Prepare Your Database

### Option A: MongoDB Atlas (Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user with password
4. Whitelist all IPs (0.0.0.0/0) for Railway access
5. Get your connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/create4me?retryWrites=true&w=majority
   ```

### Option B: Railway MongoDB
1. In Railway dashboard, click "New" → "Database" → "Add MongoDB"
2. Copy the connection string from the MongoDB service variables

## Step 2: Deploy to Railway

### Method 1: Deploy from GitHub (Recommended)
1. Push your code to GitHub
2. Go to Railway dashboard
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect the configuration

### Method 2: Deploy using Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Link to your project
railway link

# Deploy
railway up
```

## Step 3: Configure Environment Variables

In Railway dashboard, go to your service → Variables tab and add:

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/create4me?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-random-string-here
FRONTEND_URL=https://your-frontend-url.netlify.app
```

### Generate a secure JWT_SECRET:
```bash
openssl rand -base64 32
```

## Step 4: Configure Build Settings

Railway should auto-detect the settings from `railway.json`, but verify:

**Build Command:**
```bash
npm install && npx prisma generate && npm run build
```

**Start Command:**
```bash
npm start
```

## Step 5: Deploy and Monitor

1. Click "Deploy" in Railway dashboard
2. Monitor the build logs
3. Once deployed, Railway will provide a public URL like:
   ```
   https://your-app-name.up.railway.app
   ```

## Step 6: Test Your Deployment

Test the health endpoint:
```bash
curl https://your-app-name.up.railway.app/health
curl https://your-app-name.up.railway.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

## Step 7: Update Frontend Configuration

Update your frontend's `.env` file with the Railway backend URL:
```env
VITE_API_URL=https://your-app-name.up.railway.app/api
```

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify `DATABASE_URL` is set correctly
- Check build logs for specific errors

### Database Connection Issues
- Verify MongoDB connection string format
- Check if IP whitelist includes 0.0.0.0/0 (for Atlas)
- Ensure database user has correct permissions

### CORS Errors
- Add your frontend URL to `FRONTEND_URL` environment variable
- Verify CORS configuration in `server.ts`

### Prisma Issues
- Ensure `npx prisma generate` runs in build command
- Check that `prisma` is in dependencies (not devDependencies)

## Monitoring and Logs

View logs in Railway:
```bash
railway logs
```

Or in the Railway dashboard → Deployments → View Logs

## Custom Domain (Optional)

1. Go to Settings → Domains in Railway
2. Click "Generate Domain" or "Custom Domain"
3. Follow instructions to configure DNS

## Environment-Specific Notes

### Development
```bash
npm run dev
```

### Production (Local Test)
```bash
npm run build
NODE_ENV=production npm start
```

## Rollback

If deployment fails:
1. Go to Deployments tab
2. Click on a previous successful deployment
3. Click "Redeploy"

## Cost Optimization

Railway offers:
- $5 free credit per month
- Pay-as-you-go pricing
- Sleep mode for inactive services

## Security Checklist

- ✅ Strong JWT_SECRET set
- ✅ DATABASE_URL not exposed in code
- ✅ CORS properly configured
- ✅ Helmet middleware enabled
- ✅ Environment variables set in Railway (not in code)
- ✅ MongoDB IP whitelist configured
- ✅ HTTPS enabled (automatic on Railway)

## Next Steps

1. Set up monitoring (Railway provides basic metrics)
2. Configure custom domain
3. Set up CI/CD pipeline
4. Add logging service (optional)
5. Set up backup strategy for MongoDB

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- MongoDB Atlas Support: https://www.mongodb.com/support

---

**Deployment Status:** Ready for Production ✅
**Last Updated:** 2025-10-14
