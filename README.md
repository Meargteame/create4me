# 🚀 Create4Me - Ethiopian Creator-Brand Marketplace

[![Status](https://img.shields.io/badge/status-production--ready-brightgreen)]()
[![Version](https://img.shields.io/badge/version-1.0.0-blue)]()
[![License](https://img.shields.io/badge/license-UNLICENSED-red)]()

> **Connecting Ethiopian content creators with brands for authentic collaborations**

Create4Me is a full-stack marketplace platform that bridges the gap between content creators and brands in Ethiopia, enabling seamless campaign collaborations, applications, and payments.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)

---

## ✨ Features

### For Creators
- ✅ **Professional Profiles** - Showcase your work with portfolios, stats, and social links
- ✅ **Campaign Discovery** - Browse and filter brand campaigns by category, budget, platform
- ✅ **Easy Applications** - Apply to campaigns with cover letters and proposed pricing
- ✅ **Real-time Messaging** - Communicate directly with brands
- ✅ **Analytics Dashboard** - Track your applications, earnings, and performance
- ✅ **Profile Image Upload** - Upload and manage your avatar

### For Brands
- ✅ **Campaign Management** - Create, manage, and track campaigns
- ✅ **Creator Discovery** - Find creators by category, rating, and platform
- ✅ **Application Review** - Review and manage creator applications
- ✅ **Analytics** - Track campaign performance and ROI
- ✅ **Direct Messaging** - Connect with creators

### Platform Features
- ✅ **Secure Authentication** - JWT-based auth with role-based access control
- ✅ **Responsive Design** - Beautiful glassmorphism UI that works on all devices
- ✅ **Real-time Updates** - Live notifications and messaging
- ✅ **File Uploads** - Profile pictures, portfolios, and campaign assets
- ✅ **Search & Filters** - Advanced search with text indexing

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS 3
- **Animations:** Framer Motion
- **Routing:** React Router v6
- **Icons:** Lucide React + React Icons
- **Charts:** Recharts

### Backend
- **Runtime:** Node.js with Express
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Security:** Helmet, CORS, bcryptjs
- **Development:** Nodemon + ts-node

### Deployment
- **Frontend:** Vercel
- **Backend:** Railway / Heroku
- **Database:** MongoDB Atlas
- **File Storage:** Base64 (migrating to Cloudinary/S3)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm/pnpm
- **MongoDB** (local or Atlas)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/create4me.git
   cd create4me
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Or install individually
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Set up environment variables**

   **Backend** (`backend/.env`):
   ```env
   PORT=3001
   NODE_ENV=development
   DATABASE_URL=mongodb://localhost:27017/create4me
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   FRONTEND_URL=http://localhost:5173
   ```

   **Frontend** (`frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

4. **Start MongoDB** (if using local instance)
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod  # Auto-start on boot
   ```

5. **Run database migrations**
   ```bash
   cd backend
   node scripts/createCreatorProfiles.js  # Create profiles for existing users
   node src/scripts/addIndexes.js         # Add database indexes
   ```

6. **Start development servers**

   **Option 1: Start both (from root)**
   ```bash
   npm run dev
   ```

   **Option 2: Start individually**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Health check: http://localhost:3001/health

---

## 📁 Project Structure

```
create4me/
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page components (12+ pages)
│   │   ├── context/            # React context (AuthContext)
│   │   ├── lib/                # API client and utilities
│   │   ├── App.tsx             # Main app component with routing
│   │   └── index.css           # Tailwind styles
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                     # Express backend
│   ├── src/
│   │   ├── models/             # Mongoose schemas (5 models)
│   │   ├── routes/             # API routes (7 route files)
│   │   ├── middleware/         # Auth and validation middleware
│   │   ├── services/           # Business logic services
│   │   ├── config/             # Database and app configuration
│   │   ├── scripts/            # Migration and utility scripts
│   │   └── server.ts           # Express server setup
│   └── package.json
│
├── package.json                 # Root package (workspaces)
├── start-dev.sh                 # Development startup script
└── README.md                    # This file
```

---

## 💻 Development

### Available Scripts

**Root level:**
```bash
npm run dev              # Run both frontend & backend
npm run dev:backend      # Backend only
npm run dev:frontend     # Frontend only
npm run build            # Build both for production
```

**Backend:**
```bash
npm run dev              # Development with hot reload
npm run build            # Compile TypeScript
npm run start            # Production mode
```

**Frontend:**
```bash
npm run dev              # Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build
```

### Database Scripts

```bash
# Create creator profiles for existing users
node backend/scripts/createCreatorProfiles.js

# Add database indexes for performance
node backend/src/scripts/addIndexes.js
```

### Code Style

- **TypeScript:** Full type safety across frontend and backend
- **ESModules:** Modern ES6+ syntax
- **Async/Await:** No callbacks, promise-based
- **Component Structure:** Functional components with hooks

---

## 🚢 Deployment

### Deploy to Vercel (Frontend)

1. **Connect your repository**
   ```bash
   vercel
   ```

2. **Configure build settings**
   - Build Command: `npm run build:frontend`
   - Output Directory: `frontend/dist`
   - Install Command: `npm install`

3. **Set environment variables**
   - `VITE_API_URL`: Your backend API URL

### Deploy to Railway (Backend)

1. **Create new project** on [Railway](https://railway.app)

2. **Connect repository** and set root directory to `backend`

3. **Add environment variables:**
   - `PORT`, `NODE_ENV`, `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`

4. **Set build command:**
   - Build: `npm run build`
   - Start: `npm start`

### MongoDB Atlas Setup

1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist IP addresses (or use 0.0.0.0/0 for all)
4. Get connection string
5. Update `DATABASE_URL` in environment variables

---

## 📖 API Documentation

### Base URL
- Development: `http://localhost:3001/api`
- Production: `https://your-api-url.com/api`

### Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Key Endpoints

**Authentication**
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

**Campaigns**
- `GET /campaigns/all` - Get all campaigns
- `POST /campaigns` - Create campaign (brands only)
- `GET /campaigns/:id` - Get campaign details
- `GET /campaigns` - Get my campaigns

**Creators**
- `GET /creators` - List all creators
- `GET /creators/:id` - Get creator profile
- `GET /creators/profile/me` - Get my profile
- `PUT /creators/profile` - Update my profile

**Applications**
- `POST /applications` - Apply to campaign
- `GET /applications/my` - My applications
- `GET /applications/campaign/:id` - Campaign applicants
- `PATCH /applications/:id` - Update application status

**File Upload**
- `POST /upload/avatar` - Upload profile picture
- `POST /upload/portfolio` - Upload portfolio images
- `POST /upload/campaign` - Upload campaign images

**Analytics**
- `GET /analytics/dashboard` - Dashboard stats
- `GET /analytics/campaign/:id` - Campaign analytics
- `GET /analytics/creator/:id` - Creator analytics

**Messages**
- `GET /messages/conversations` - Get conversations
- `GET /messages/conversation/:userId` - Get messages with user
- `POST /messages/send` - Send message
- `PATCH /messages/:id/read` - Mark message as read

For full API documentation, see [API.md](./API.md) (TODO)

---

## 🧪 Testing

```bash
# Run tests (coming soon)
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Write TypeScript with proper types
- Follow existing code style
- Add tests for new features
- Update documentation
- Keep commits atomic and well-described

---

## 📝 License

This project is UNLICENSED - all rights reserved.

---

## 👥 Team

- **Developer:** Meareg Teame
- **Contact:** mearegteame99995555@gmail.com

---

## 🙏 Acknowledgments

- Ethiopian creator community
- Open source contributors
- All beta testers

---

## 📞 Support

- **Email:** support@create4me.com
- **Issues:** [GitHub Issues](https://github.com/yourusername/create4me/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/create4me/discussions)

---

## 🗺️ Roadmap

See [improvement_plan.md](./improvement_plan.md) for the complete roadmap.

**Coming Soon:**
- [ ] Payment integration (Telebirr/Chapa)
- [ ] Real-time notifications
- [ ] Advanced search with Elasticsearch
- [ ] Rating & review system
- [ ] Admin panel
- [ ] Mobile PWA
- [ ] Amharic translation

---

**Built with ❤️ for the Ethiopian creator economy**
