# 🚀 Create4Me - Quick Reference Card

## 📍 Production URLs

| Service | URL |
|---------|-----|
| **Frontend** | https://create4mee.vercel.app |
| **Backend** | https://create4me-production.up.railway.app |
| **API Base** | https://create4me-production.up.railway.app/api |
| **Health Check** | https://create4me-production.up.railway.app/api/health |

## 🔑 Quick Commands

### Test Production
```bash
./verify-production.sh
```

### Check Backend Health
```bash
curl https://create4me-production.up.railway.app/api/health
```

### Test API Endpoint
```bash
curl https://create4me-production.up.railway.app/api/creators
```

### Deploy Frontend
```bash
cd backend/react-frontend
vercel --prod
```

### Deploy Backend
```bash
git push origin main
# Railway auto-deploys
```

## 🗄️ Database Info

**Type:** MongoDB on Railway  
**Collections:**
- users
- creator_profiles
- campaigns
- campaign_applications
- creator_likes
- creator_bookmarks
- connections

**Current Data:**
- 2 test creators
- Users can register and create more

## 🔐 Environment Variables

### Railway (Backend)
```
NODE_ENV=production
PORT=3001
DATABASE_URL=mongodb://...
JWT_SECRET=your-secret
FRONTEND_URL=https://create4mee.vercel.app
```

### Vercel (Frontend)
```
VITE_API_URL=https://create4me-production.up.railway.app/api
VITE_APP_NAME=Create4Me
VITE_APP_ENV=production
```

## 🧪 Test User Accounts

Create these for testing:

**Brand:**
- Email: demo-brand@create4me.et
- Password: DemoBrand2025!
- Role: Brand

**Creator:**
- Email: demo-creator@create4me.et
- Password: DemoCreator2025!
- Role: Creator

## 📊 Key Metrics to Monitor

**User Metrics:**
- Total registrations
- Creators vs Brands ratio
- Campaigns created
- Applications submitted

**Technical Metrics:**
- Uptime (target: 99%+)
- Response time (target: <500ms)
- Error rate (target: <1%)

**Engagement:**
- Session duration
- Pages per session
- Return user rate

## 🐛 Quick Troubleshooting

### Users can't register
```bash
# Check backend
curl https://create4me-production.up.railway.app/api/health

# Check logs in Railway Dashboard
```

### CORS errors
- Verify `FRONTEND_URL` in Railway
- Should be: `https://create4mee.vercel.app`

### API calls failing
- Verify `VITE_API_URL` in Vercel
- Should be: `https://create4me-production.up.railway.app/api`

### Database issues
- Check Railway logs
- Verify MongoDB connection string
- Check database is running

## 📞 Dashboard Links

**Railway:**
- Dashboard: https://railway.app/dashboard
- Logs: Project → Deployments → View Logs
- Variables: Project → Variables

**Vercel:**
- Dashboard: https://vercel.com/dashboard
- Deployments: Project → Deployments
- Settings: Project → Settings → Environment Variables

**MongoDB:**
- If using Atlas: https://cloud.mongodb.com
- Railway: Integrated in Railway dashboard

## 🚨 Emergency Actions

### Rollback Frontend
```bash
vercel rollback
```

### Rollback Backend
- Railway Dashboard → Deployments → Previous → Redeploy

### Check Logs
```bash
# Railway: Use dashboard
# Vercel: Use dashboard
# Browser: F12 → Console
```

## 📝 Important Files

| File | Purpose |
|------|---------|
| `LAUNCH_GUIDE.md` | Complete launch instructions |
| `LAUNCH_CHECKLIST.md` | Pre-launch verification |
| `verify-production.sh` | Test all endpoints |
| `README.md` | Project overview |
| `backend/src/server.ts` | Backend entry point |
| `backend/react-frontend/src/App.tsx` | Frontend entry point |

## 🎯 Launch Checklist

- [x] Production deployed
- [x] All tests passing
- [x] CORS configured
- [x] Database connected
- [ ] Demo accounts created
- [ ] Core flows tested
- [ ] Social posts ready
- [ ] Monitoring active

## 📱 Social Media

**Handles:** @create4me
- Instagram: instagram.com/create4me
- Twitter: twitter.com/create4me
- LinkedIn: linkedin.com/company/create4me
- Facebook: facebook.com/create4me
- YouTube: youtube.com/@create4me
- Telegram: t.me/create4me

## 🎉 Launch Announcement Template

```
🚀 Excited to launch Create4Me - connecting Ethiopian 
creators with brands for authentic collaborations!

✨ For Creators: Find paid opportunities
💼 For Brands: Discover authentic voices

Join the beta: https://create4mee.vercel.app

#EthiopianCreators #CreatorEconomy #Ethiopia
```

## 📊 Success Metrics (Week 1)

**Target:**
- 50+ user registrations
- 10+ campaigns created
- 20+ applications submitted
- 99%+ uptime
- <1% error rate

## 🔄 Next Steps

1. **Today:** Run verification, create demo accounts
2. **Tomorrow:** Announce soft launch
3. **Week 1:** Monitor, fix bugs, collect feedback
4. **Week 2-4:** Iterate based on feedback
5. **Month 2:** Plan v2.0 features

## 💡 Pro Tips

- Start with soft launch (20-50 beta users)
- Monitor logs closely first 24 hours
- Respond to feedback quickly
- Document all issues
- Celebrate small wins
- Iterate based on user needs

## 📞 Support

**Email:** hello@create4me.et  
**Response Time:** <24 hours  
**Critical Issues:** Immediate

---

**Status:** ✅ READY TO LAUNCH  
**Version:** 1.0.0  
**Date:** October 23, 2025

**You're all set! 🎉**
