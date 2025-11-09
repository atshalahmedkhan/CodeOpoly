# ⚡ Quick Backend Deployment - Railway (5 Minutes)

## 🚀 Step-by-Step Guide

### Step 1: Sign Up
1. Go to **https://railway.app**
2. Click **"Start a New Project"**
3. Sign in with **GitHub**

### Step 2: Deploy from GitHub
1. Click **"Deploy from GitHub repo"**
2. Select repository: **`atshalahmedkhan/CodeOpoly`**
3. Railway will detect the project

### Step 3: Configure Service
1. Click on the service that was created
2. Go to **Settings** tab
3. Scroll to **Root Directory**
4. Click **Edit** and set to: **`server`**
5. Scroll to **Build Command**
6. Set to: **`npm install && npm run build`**
7. Scroll to **Start Command**  
8. Set to: **`npm start`**

### Step 4: Add Environment Variables
1. Go to **Variables** tab
2. Click **"New Variable"**
3. Add these variables:

```
PORT=5001
NODE_ENV=production
CLIENT_URL=https://client-dw595nw2i-yashs-projects-140ade03.vercel.app
CLIENT_URLS=https://client-dw595nw2i-yashs-projects-140ade03.vercel.app
```

(Replace the CLIENT_URL with your actual Vercel URL)

### Step 5: Deploy
1. Railway will automatically start deploying
2. Wait 2-3 minutes for build to complete
3. Check the **Deployments** tab for status

### Step 6: Get Your Backend URL
1. Once deployed, go to **Settings** → **Networking**
2. Click **"Generate Domain"** (or use the auto-generated one)
3. Copy the URL (e.g., `https://codeopoly-production.up.railway.app`)

### Step 7: Update Frontend
1. Go to **Vercel Dashboard** → Your project → **Settings** → **Environment Variables**
2. Add/Update:
   - `VITE_API_URL` = `https://your-railway-url.railway.app/api`
   - `VITE_SOCKET_URL` = `https://your-railway-url.railway.app`
3. Go to **Deployments** tab
4. Click **"Redeploy"** on the latest deployment

## ✅ Done!

Your backend is now live! Test it by:
- Opening your Vercel frontend
- Creating a new game
- The frontend should connect to your Railway backend

## 🐛 Troubleshooting

**Build fails?**
- Check the build logs in Railway
- Make sure Root Directory is set to `server`

**CORS errors?**
- Verify CLIENT_URL matches your Vercel URL exactly
- No trailing slashes
- Use HTTPS (not HTTP)

**Socket.io not working?**
- Check that WebSocket is enabled (Railway supports it by default)
- Verify CORS includes your frontend URL

