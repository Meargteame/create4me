# Create4Me Backend - Production Deployment

## 🎯 Quick Start

### Local Development
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your local MongoDB connection

# Generate Prisma client
npx prisma generate

# Run in development mode
npm run dev
```

### Production Build (Local Test)
```bash
# Build the application
npm run build

# Start production server
NODE_ENV=production npm start
```

## 📋 API Endpoints

### Health Checks
- `GET /` - Root health check
- `GET /health` - Health check endpoint
- `GET /api/health` - API health check (for frontend)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Campaigns
- `GET /api/campaigns` - Get all campaigns
- `POST /api/campaigns` - Create campaign (requires auth)
- `GET /api/campaigns/:id` - Get campaign by ID
- `PUT /api/campaigns/:id` - Update campaign (requires auth)
- `DELETE /api/campaigns/:id` - Delete campaign (requires auth)

### Pages
- `GET /api/pages` - Get all pages
- `POST /api/pages` - Create page (requires auth)
- `GET /api/projects/:id/pages` - Get pages for project

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task (requires auth)
- `GET /api/projects/:projectId/tasks` - Get tasks for project

### Applications
- `GET /api/applications` - Get all applications
- `POST /api/applications` - Submit application (requires auth)

### Creators
- `GET /api/creators` - Get all creator profiles
- `GET /api/creators/:id` - Get creator profile by ID

### Connections
- `GET /api/connections` - Get user connections (requires auth)
- `POST /api/connections` - Create connection request (requires auth)

### Upload
- `POST /api/upload` - Upload file (requires auth)

## 🔧 Configuration Files

### railway.json
Railway-specific deployment configuration with build and start commands.

### nixpacks.toml
Nixpacks configuration for Railway's build system.

### Procfile
Process file for Heroku-style deployments.

### tsconfig.json
TypeScript compiler configuration.

## 🌍 Environment Variables

Required environment variables for production:

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/create4me
JWT_SECRET=your-secure-random-string
FRONTEND_URL=https://your-frontend.netlify.app
```

## 🚀 Deployment Platforms

### Railway (Recommended)
See [RAILWAY_DEPLOYMENT_GUIDE.md](./RAILWAY_DEPLOYMENT_GUIDE.md) for detailed instructions.

Quick deploy:
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Heroku
```bash
heroku create your-app-name
heroku addons:create mongolab
git push heroku main
```

### Render
1. Connect your GitHub repository
2. Set build command: `npm install && npx prisma generate && npm run build`
3. Set start command: `npm start`
4. Add environment variables

### DigitalOcean App Platform
1. Create new app from GitHub
2. Configure build settings
3. Add MongoDB database
4. Deploy

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)
1. Create free cluster at https://mongodb.com/cloud/atlas
2. Create database user
3. Whitelist IPs: 0.0.0.0/0
4. Get connection string
5. Add to DATABASE_URL environment variable

### Railway MongoDB
1. Add MongoDB service in Railway
2. Copy connection string from service variables
3. Link to your backend service

## 🔒 Security Checklist

- ✅ JWT_SECRET is strong and unique
- ✅ DATABASE_URL not committed to git
- ✅ CORS configured for production frontend
- ✅ Helmet middleware enabled
- ✅ Rate limiting (consider adding)
- ✅ Input validation on all endpoints
- ✅ HTTPS enforced (automatic on Railway)

## 📊 Monitoring

### Check Server Status
```bash
curl https://your-app.railway.app/health
```

### View Logs (Railway)
```bash
railway logs
```

### Database Connection Test
The health endpoint automatically checks database connectivity.

## 🐛 Troubleshooting

### Build Fails
- Verify all dependencies in package.json
- Check Node.js version compatibility (20.x recommended)
- Ensure Prisma generates successfully

### Database Connection Issues
- Verify connection string format
- Check IP whitelist (0.0.0.0/0 for cloud platforms)
- Ensure database user has read/write permissions

### CORS Errors
- Add frontend URL to FRONTEND_URL env variable
- Check CORS configuration in server.ts

### 404 Errors
- All API routes now use `/api` prefix
- Update frontend API calls to use `/api/` prefix

## 📦 Dependencies

### Production
- express - Web framework
- @prisma/client - Database ORM
- cors - CORS middleware
- helmet - Security headers
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- dotenv - Environment variables

### Development
- typescript - Type safety
- ts-node - TypeScript execution
- nodemon - Auto-restart on changes
- @types/* - TypeScript definitions

## 🔄 CI/CD

### GitHub Actions (Example)
```yaml
name: Deploy to Railway
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install -g @railway/cli
      - run: railway up
```

## 📈 Performance Tips

1. Enable MongoDB indexes for frequently queried fields
2. Use connection pooling
3. Implement caching (Redis) for frequently accessed data
4. Enable gzip compression
5. Use CDN for static assets

## 🔐 JWT Token Management

Tokens are issued on login and expire based on configuration. Include in requests:
```
Authorization: Bearer <token>
```

## 📝 API Response Format

Success:
```json
{
  "success": true,
  "data": { ... }
}
```

Error:
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Test production build locally
npm run build && NODE_ENV=production npm start
```

## 📞 Support

For issues or questions:
1. Check logs: `railway logs`
2. Review error messages
3. Check environment variables
4. Verify database connectivity

---

**Status:** Production Ready ✅  
**Version:** 1.0.0  
**Last Updated:** 2025-10-14
