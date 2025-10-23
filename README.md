# Create4Me - Ethiopian Creator Marketplace

> Connecting Ethiopian content creators with brands for authentic collaborations

[![Production](https://img.shields.io/badge/status-live-success)](https://create4mee.vercel.app)
[![Backend](https://img.shields.io/badge/backend-railway-blueviolet)](https://create4me-production.up.railway.app)
[![Frontend](https://img.shields.io/badge/frontend-vercel-black)](https://create4mee.vercel.app)

## 🌟 Overview

Create4Me is a two-sided marketplace SaaS platform that connects Ethiopian content creators with brands for marketing collaborations. Think of it as "Upwork meets Instagram" for the Ethiopian creator economy.

**Live Platform:** https://create4mee.vercel.app

## 🚀 Features

### For Creators
- 📱 Browse available brand campaigns
- 💼 Apply to opportunities with proposals
- 📊 Track application status
- 🎨 Build professional portfolio
- ⭐ Get discovered by brands

### For Brands
- 🔍 Discover Ethiopian creators
- 📢 Post campaign opportunities
- 👥 Review and manage applicants
- 📈 Track campaign performance
- 💡 Find authentic brand voices

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Framer Motion (animations)
- React Router v6 (routing)

**Backend:**
- Node.js + Express.js
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Helmet.js (security)

**Infrastructure:**
- Frontend: Vercel
- Backend: Railway
- Database: MongoDB on Railway

## 📦 Project Structure

```
create4me/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth, error handling
│   │   ├── services/       # Business logic
│   │   └── server.ts       # Express app
│   └── react-frontend/
│       ├── src/
│       │   ├── components/ # React components
│       │   ├── pages/      # Route pages
│       │   ├── contexts/   # Global state
│       │   ├── lib/        # API client
│       │   └── App.tsx     # Main app
│       └── dist/           # Production build
├── LAUNCH_GUIDE.md         # Launch instructions
├── LAUNCH_CHECKLIST.md     # Pre-launch checklist
└── verify-production.sh    # Production tests
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- npm or yarn

### Local Development

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd create4me
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB connection and JWT secret
npm run dev
```

3. **Setup Frontend**
```bash
cd backend/react-frontend
npm install
cp .env.example .env
# Edit .env with backend API URL
npm run dev
```

4. **Access the app**
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## 🧪 Testing Production

Run the verification script to test all production endpoints:

```bash
./verify-production.sh
```

Expected output: All 12 tests passing ✓

## 📚 Documentation

- **[Launch Guide](LAUNCH_GUIDE.md)** - Complete launch instructions
- **[Launch Checklist](LAUNCH_CHECKLIST.md)** - Pre-launch verification
- **[Backend README](backend/README.md)** - Backend API documentation
- **[Final MVP Summary](FINAL_MVP_SUMMARY.md)** - Complete feature list

## 🔐 Environment Variables

### Backend (Railway)
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=mongodb://...
JWT_SECRET=your-secret-key
FRONTEND_URL=https://create4mee.vercel.app
```

### Frontend (Vercel)
```env
VITE_API_URL=https://create4me-production.up.railway.app/api
VITE_APP_NAME=Create4Me
VITE_APP_ENV=production
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Creators
- `GET /api/creators` - Browse creators (public)
- `GET /api/creators/:id` - Get creator profile
- `PUT /api/creators/profile` - Update profile

### Campaigns
- `GET /api/campaigns/all` - Browse campaigns
- `POST /api/campaigns` - Create campaign (brand only)
- `GET /api/campaigns/:id` - Get campaign details

### Applications
- `POST /api/applications` - Apply to campaign
- `GET /api/applications/my` - Get my applications
- `PUT /api/applications/:id/status` - Update status

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd backend/react-frontend
vercel --prod
```

### Backend (Railway)
```bash
git push origin main
# Railway auto-deploys from GitHub
```

## 📊 Current Status

**Version:** 1.0.0  
**Status:** ✅ Production Ready  
**Launch Date:** October 2025

**Metrics:**
- All tests passing: 12/12 ✓
- CORS configured ✓
- Database connected ✓
- Production deployed ✓

## 🐛 Known Issues

- Email verification not yet implemented
- Password reset flow pending
- Payment integration planned for v2.0

## 🗺️ Roadmap

### v1.1 (Week 1-2)
- Email notifications
- Password reset
- Enhanced analytics

### v1.2 (Month 1)
- Email verification
- Direct messaging
- Advanced search

### v2.0 (Month 2-3)
- Payment integration
- Mobile app
- AI matching algorithm
- Amharic language support

## 🤝 Contributing

This is a private project. For questions or feedback, contact the maintainer.

## 📞 Support

- **Email:** hello@create4me.et
- **Website:** https://create4mee.vercel.app
- **Social:** @create4me

## 📄 License

Proprietary - All rights reserved

## 👨‍💻 Author

**Meareg Teame**
- Platform: Create4Me
- Focus: Ethiopian Creator Economy

---

**Made with ❤️ for Ethiopian Creators and Brands**

*Empowering the Ethiopian creator economy, one collaboration at a time.*
