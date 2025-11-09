# 🚀 Vercel Deployment Guide for CodeOpoly

This guide will help you deploy CodeOpoly to Vercel step by step.

## 📋 Prerequisites

1. **GitHub Account** - Your code should be on GitHub (already done ✅)
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Node.js** - Installed on your local machine

## 🎯 Deployment Strategy

Your project has two parts:
- **Frontend (Vite/React)** - Deploy to Vercel ✅
- **Backend (Express/Socket.io)** - Deploy separately (Railway/Render recommended)

## 📝 Step-by-Step Deployment

### Step 1: Install Vercel CLI (Optional but Recommended)

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

This will open your browser to authenticate.

### Step 3: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository: `atshalahmedkhan/CodeOpoly`
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 4: Set Environment Variables

In Vercel dashboard, go to **Settings → Environment Variables** and add:

```
VITE_API_URL=https://your-backend-url.com/api
VITE_SOCKET_URL=https://your-backend-url.com
VITE_FIREBASE_API_KEY=your-firebase-key
VITE_FIREBASE_AUTH_DOMAIN=your-firebase-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Step 5: Deploy Backend Server

The backend server needs to be deployed separately. Recommended options:

#### Option A: Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Create new project
3. Deploy from GitHub repo
4. Set root directory to `server`
5. Add environment variables:
   - `PORT=5001`
   - `MONGODB_URI=your-mongodb-uri` (optional)
   - `CLIENT_URL=https://your-vercel-app.vercel.app`

#### Option B: Render
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repo
4. Set root directory to `server`
5. Build command: `npm install && npm run build`
6. Start command: `npm start`

### Step 6: Update Frontend Environment Variables

After backend is deployed, update `VITE_API_URL` and `VITE_SOCKET_URL` in Vercel with your backend URL.

### Step 7: Redeploy

After setting environment variables, Vercel will automatically redeploy. Or trigger manually:
- Via Dashboard: Click "Redeploy"
- Via CLI: `vercel --prod`

## 🔧 Alternative: Deploy via CLI

If you prefer CLI:

```bash
cd client
vercel
```

Follow the prompts, then:
```bash
vercel --prod
```

## 📝 Important Notes

1. **CORS Configuration**: Make sure your backend allows requests from your Vercel domain
2. **Socket.io**: WebSocket connections may need special configuration on some platforms
3. **Environment Variables**: All `VITE_*` variables must be set in Vercel dashboard
4. **Build Output**: Vite builds to `dist/` folder, which Vercel will serve

## 🐛 Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure TypeScript compiles without errors
- Check Vercel build logs for specific errors

### API Calls Fail
- Verify `VITE_API_URL` is set correctly
- Check CORS settings on backend
- Ensure backend is deployed and accessible

### Socket.io Not Connecting
- Verify `VITE_SOCKET_URL` is correct
- Check backend Socket.io CORS configuration
- Some platforms may need WebSocket upgrade configuration

## ✅ Success Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway/Render
- [ ] Environment variables configured
- [ ] CORS configured on backend
- [ ] Frontend can connect to backend API
- [ ] Socket.io connections working
- [ ] Domain configured (optional)

## 🎉 You're Done!

Once deployed, your app will be live at: `https://your-project.vercel.app`

