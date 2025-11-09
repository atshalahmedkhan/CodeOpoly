# 🚀 Backend Deployment Guide for CodeOpoly

This guide will help you deploy the CodeOpoly backend server to various platforms.

## 📋 Prerequisites

- GitHub repository with your code (already done ✅)
- Account on one of the deployment platforms

## 🎯 Deployment Options

### Option 1: Railway (Recommended - Easiest) ⭐

Railway is the easiest option with automatic deployments from GitHub.

#### Step 1: Sign Up
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

#### Step 2: Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository: `atshalahmedkhan/CodeOpoly`

#### Step 3: Configure Service
1. Railway will auto-detect the project
2. Click on the service
3. Go to **Settings** → **Root Directory**
4. Set to: **`server`**
5. Go to **Settings** → **Build Command**
6. Set to: **`npm install && npm run build`**
7. Go to **Settings** → **Start Command**
8. Set to: **`npm start`**

#### Step 4: Set Environment Variables
Go to **Variables** tab and add:

```
PORT=5001
NODE_ENV=production
CLIENT_URL=https://client-dw595nw2i-yashs-projects-140ade03.vercel.app
CLIENT_URLS=https://client-dw595nw2i-yashs-projects-140ade03.vercel.app
MONGODB_URI=your-mongodb-uri (optional)
```

#### Step 5: Deploy
1. Railway will automatically deploy
2. Wait for deployment to complete
3. Get your backend URL (e.g., `https://codeopoly-backend.railway.app`)

#### Step 6: Update Frontend
1. Go to Vercel dashboard
2. Add environment variables:
   - `VITE_API_URL` = `https://your-railway-url.railway.app/api`
   - `VITE_SOCKET_URL` = `https://your-railway-url.railway.app`
3. Redeploy frontend

---

### Option 2: Render

#### Step 1: Sign Up
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

#### Step 2: Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select: `atshalahmedkhan/CodeOpoly`

#### Step 3: Configure
- **Name**: `codeopoly-backend`
- **Root Directory**: `server`
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

#### Step 4: Environment Variables
Add in the **Environment** section:

```
NODE_ENV=production
PORT=10000
CLIENT_URL=https://client-dw595nw2i-yashs-projects-140ade03.vercel.app
CLIENT_URLS=https://client-dw595nw2i-yashs-projects-140ade03.vercel.app
MONGODB_URI=your-mongodb-uri (optional)
```

#### Step 5: Deploy
1. Click **"Create Web Service"**
2. Wait for deployment
3. Get your URL (e.g., `https://codeopoly-backend.onrender.com`)

---

### Option 3: Fly.io

#### Step 1: Install Fly CLI
```bash
curl -L https://fly.io/install.sh | sh
```

#### Step 2: Login
```bash
fly auth login
```

#### Step 3: Initialize
```bash
cd server
fly launch
```

#### Step 4: Configure
Follow prompts, then edit `fly.toml`:
```toml
[env]
  PORT = "8080"
  NODE_ENV = "production"
  CLIENT_URL = "https://your-vercel-app.vercel.app"
```

#### Step 5: Deploy
```bash
fly deploy
```

---

## 🔧 Important Configuration

### Environment Variables Required

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port (auto-set by platform) | `5001` |
| `NODE_ENV` | Environment | `production` |
| `CLIENT_URL` | Frontend URL for CORS | `https://your-app.vercel.app` |
| `CLIENT_URLS` | Multiple frontend URLs | `url1,url2` |
| `MONGODB_URI` | MongoDB connection (optional) | `mongodb://...` |

### CORS Configuration

The backend is already configured to accept requests from:
- Your Vercel frontend URL
- Localhost (for development)

Make sure to set `CLIENT_URL` to your Vercel deployment URL.

---

## ✅ Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Environment variables set correctly
- [ ] CORS configured with frontend URL
- [ ] Frontend environment variables updated
- [ ] Frontend redeployed with new backend URL
- [ ] Test API connection from frontend
- [ ] Test Socket.io connection

---

## 🐛 Troubleshooting

### Port Issues
- Railway/Render auto-assign ports
- Use `process.env.PORT` (already configured ✅)

### CORS Errors
- Verify `CLIENT_URL` matches your Vercel URL exactly
- Check for trailing slashes
- Ensure HTTPS URLs (not HTTP)

### Socket.io Not Connecting
- Verify WebSocket support on platform
- Check CORS configuration includes Socket.io origins
- Some platforms need special WebSocket configuration

### Build Failures
- Ensure `npm run build` completes successfully
- Check TypeScript compilation
- Verify all dependencies are in `package.json`

---

## 🎉 Success!

Once deployed, your backend will be live and ready to handle:
- REST API requests (`/api/*`)
- Socket.io WebSocket connections
- Game state management
- Real-time multiplayer features

**Next Step**: Update your Vercel frontend with the backend URL!

