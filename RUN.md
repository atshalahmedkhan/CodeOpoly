# 🚀 How to Run CodeOpoly

## Quick Start (2 Steps)

### Step 1: Start Backend Server

Open a terminal and run:
```bash
cd server
npm run dev
```

You should see:
```
🚀 Server running on port 5000
📡 Socket.io ready for connections
```

### Step 2: Start Frontend Server

Open a **NEW** terminal window and run:
```bash
cd client
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

## 🎮 Play the Game

1. Open your browser
2. Go to: **http://localhost:3000**
3. You should see the CodeOpoly lobby!

## 📋 What You'll See

- **Lobby Screen**: Sign in (or skip) and create/join a game
- **Game Board**: 10x10 grid with Monopoly tiles
- **Dice Roller**: Animated dice with visual effects
- **Property Modal**: Pop-up when landing on properties

## ⚠️ Troubleshooting

**Port 5000 already in use?**
- Close other applications using port 5000
- Or change `PORT` in `server/.env`

**Port 3000 already in use?**
- Vite will automatically try 3001, 3002, etc.
- Check the terminal for the actual URL

**Backend not connecting?**
- Make sure backend is running on port 5000
- Check `server/.env` has correct settings
- Backend works without MongoDB (uses in-memory storage)

**Firebase Auth not working?**
- That's okay! You can skip auth for now
- Game works without Firebase authentication

## 🎯 Quick Commands

**Start both servers (Windows PowerShell):**
```powershell
# Terminal 1
cd server; npm run dev

# Terminal 2 (new window)
cd client; npm run dev
```

**Check if servers are running:**
- Backend: http://localhost:5000/api/games/create (should return error, but means server is up)
- Frontend: http://localhost:3000 (should show the app)

## ✅ Success Indicators

✅ Backend terminal shows: "Server running on port 5000"  
✅ Frontend terminal shows: "Local: http://localhost:3000"  
✅ Browser shows: CodeOpoly lobby with gradient background  
✅ You can create a game and see a room code  

## 🎉 You're Ready!

Once both servers are running, just open http://localhost:3000 in your browser and start playing!

