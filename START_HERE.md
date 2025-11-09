# 🚀 HOW TO RUN CODEOPOLY

## Quick Start (2 Simple Steps)

### Step 1: Start Backend Server

Open a **Terminal/PowerShell** window and run:

```bash
cd server
npm run dev
```

**Wait for this message:**
```
🚀 Server running on port 5000
📡 Socket.io ready for connections
```

### Step 2: Start Frontend Server

Open a **NEW Terminal/PowerShell** window and run:

```bash
cd client
npm run dev
```

**Wait for this message:**
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:3000/
```

### Step 3: Play!

1. Open your browser
2. Go to: **http://localhost:3000**
3. Click **"Play as Guest"** (no sign-in needed!)
4. Enter your name
5. Click **"Create New Game"**
6. Start playing! 🎮

---

## 📋 What You Need

- ✅ Node.js installed (you have it!)
- ✅ Both terminals running
- ✅ Browser open to http://localhost:3000

## ⚠️ Troubleshooting

**"Port 5000 already in use"**
- Close other apps using port 5000
- Or change `PORT` in `server/.env`

**"Port 3000 already in use"**
- Vite will auto-use 3001, 3002, etc.
- Check terminal for actual URL

**"Failed to create game"**
- Make sure backend is running (Step 1)
- Check backend terminal for errors

**"Cannot connect to server"**
- Verify backend shows "Server running on port 5000"
- Check `VITE_API_URL` in `client/.env` (should be `http://localhost:5000`)

---

## 🎮 Game Features

- ✅ Classic Monopoly board (square layout)
- ✅ 3D dice animation
- ✅ Glowing properties when you land
- ✅ Code challenges to buy properties
- ✅ Real-time multiplayer
- ✅ Works without MongoDB (uses in-memory storage)

---

## 💡 Pro Tips

- Keep both terminal windows open
- Backend must start before frontend
- Refresh browser if you see errors
- Check terminal windows for error messages

**Ready? Start with Step 1!** 🚀

