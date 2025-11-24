# 🚀 Deployment Guide: Create4Me MVP

This guide outlines the steps to deploy the secured Node.js/Express backend to **Railway** and the React frontend to **Vercel**.

---

## 🛠️ Step 1: Railway Setup (Backend)

Railway is recommended for the backend as it handles Node.js processes and MongoDB connections seamlessly.

### 1. Connect Repository
1. Log in to [Railway.app](https://railway.app/).
2. Click **"New Project"** -> **"Deploy from GitHub repo"**.
3. Select your `create4me` repository.
4. Choose the **backend** directory as the root directory if it's a monorepo, or ensure the `package.json` is at the root.

### 2. Configure Build & Start
Railway usually auto-detects these, but verify in **Settings**:
- **Build Command:** `npm install && npm run build` (or `tsc` if using TypeScript directly)
- **Start Command:** `npm start` (ensure this runs `node dist/server.js`)

### 3. Environment Variables (Critical)
Go to the **Variables** tab and add the following. **Do not skip any.**

| Variable Name | Value / Description |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `PORT` | `3001` (or let Railway assign one, usually `PORT` is auto-injected) |
| `MONGODB_URI` | Your MongoDB Atlas connection string (e.g., `mongodb+srv://...`) |
| `JWT_SECRET` | A long, random string (e.g., generated via `openssl rand -base64 32`) |
| `CHAPA_SECRET_KEY` | Your Chapa Secret Key (starts with `CHASECK_...`) |
| `CHAPA_PUBLIC_KEY` | Your Chapa Public Key (starts with `CHAPUBK_...`) |
| `CHAPA_BASE_URL` | `https://api.chapa.co/v1` |
| `TELEBIRR_APP_ID` | Your Telebirr App ID |
| `TELEBIRR_APP_KEY` | Your Telebirr App Key |
| `TELEBIRR_API_URL` | `https://openapi.et.telebirr.com` |
| `TELEBIRR_MERCHANT_ID`| Your Telebirr Merchant ID |
| `API_BASE_URL` | The URL Railway assigns to your backend (e.g., `https://backend-production.up.railway.app`) |
| `FRONTEND_URL` | The URL Vercel assigns to your frontend (add this *after* Vercel deployment) |

---

## 🌐 Step 2: Vercel Setup (Frontend)

Vercel is optimized for React/Vite applications.

### 1. Connect Repository
1. Log in to [Vercel.com](https://vercel.com/).
2. Click **"Add New..."** -> **"Project"**.
3. Import your `create4me` repository.
4. **Framework Preset:** Select **Vite**.
5. **Root Directory:** Select `frontend` (if your repo has a `frontend` folder).

### 2. Environment Variables
Expand the **Environment Variables** section before deploying.

| Variable Name | Value / Description |
| :--- | :--- |
| `VITE_API_BASE_URL` | Your Railway Backend URL (e.g., `https://backend-production.up.railway.app/api`) |
| `VITE_APP_NAME` | `Create4Me` |
| `VITE_ENV` | `production` |

### 3. Deploy
Click **Deploy**. Vercel will build your React app and provide a live URL (e.g., `https://create4me.vercel.app`).

**Post-Deploy Action:**
Go back to your **Railway Backend Variables** and update `FRONTEND_URL` with this new Vercel URL to allow CORS requests.

---

## 🔒 Step 3: Security Checklist

Before going live, verify these security non-negotiables:

1.  **✅ Secure Secrets:** Ensure `JWT_SECRET`, `CHAPA_SECRET_KEY`, and `TELEBIRR_APP_KEY` are **never** committed to GitHub. They should only exist in `.env` (local) and Railway Variables (production).
2.  **✅ Strong JWT Secret:** Use a cryptographically strong random string for `JWT_SECRET`. If this is weak, user sessions can be hijacked.
3.  **✅ CORS Configuration:** In `server.ts`, ensure `cors` is configured to **only** allow requests from your Vercel `FRONTEND_URL`.
    ```typescript
    app.use(cors({
      origin: process.env.FRONTEND_URL, // Strict origin
      credentials: true
    }));
    ```
4.  **✅ Database Access:** Ensure your MongoDB Atlas Network Access whitelist includes Railway's IP addresses (or allow `0.0.0.0/0` if using a strong password, though specific IPs are safer).
5.  **✅ HTTPS:** Both Railway and Vercel provide HTTPS by default. Do not disable it.

---

**🎉 Deployment Ready!**
Follow these steps to launch your secure, payment-enabled MVP.
