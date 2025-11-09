# 🚀 Quick Deploy to Vercel - Step by Step

## Method 1: Vercel Dashboard (Easiest - Recommended)

### Step 1: Go to Vercel
1. Open your browser and go to: **https://vercel.com**
2. Click **"Sign Up"** or **"Log In"** (use GitHub to sign in)

### Step 2: Import Project
1. Once logged in, click **"Add New Project"**
2. Click **"Import Git Repository"**
3. Find and select: **`atshalahmedkhan/CodeOpoly`**
4. Click **"Import"**

### Step 3: Configure Project Settings
**IMPORTANT:** Set these exact settings:

- **Framework Preset:** `Other` or `Vite`
- **Root Directory:** Click "Edit" → Change to: **`client`**
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Step 4: Add Environment Variables
Click **"Environment Variables"** and add:

```
VITE_API_URL = http://localhost:5001/api
VITE_SOCKET_URL = http://localhost:5001
```

(You'll update these later with your backend URL)

### Step 5: Deploy!
1. Click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. Your app will be live at: `https://your-project.vercel.app`

---

## Method 2: Vercel CLI (Alternative)

If you prefer CLI, run these commands:

```bash
cd client
vercel login
# Follow the prompts to authenticate
vercel
# Answer the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? codeopoly (or your choice)
# - Directory? ./
# - Override settings? No
```

Then for production:
```bash
vercel --prod
```

---

## ✅ After Deployment

1. **Get your Vercel URL** (e.g., `https://codeopoly.vercel.app`)
2. **Deploy backend** to Railway/Render (see VERCEL_DEPLOYMENT.md)
3. **Update environment variables** in Vercel with your backend URL
4. **Redeploy** to apply changes

---

## 🎉 Done!

Your frontend will be live on Vercel! 🚀

