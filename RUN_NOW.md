# 🚀 HOW TO RUN CODEOPOLY - SIMPLE GUIDE

## ⚡ Quick Start (3 Steps)

### Step 1: Install Dependencies

Open **Terminal/PowerShell** in the project root and run:

```powershell
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Step 2: Start Backend Server

Open **Terminal 1**:

```powershell
cd server
npm run dev
```

✅ You should see: `Server running on port 5000` or `Socket.io ready`

### Step 3: Start Frontend Server

Open **Terminal 2** (new terminal window):

```powershell
cd client
npm run dev
```

✅ You should see: `Local: http://localhost:3000/` or similar

### Step 4: Play!

1. Open your browser
2. Go to: **http://localhost:3000**
3. Enter your name
4. Click "Create New Game" or "Join Game"
5. Start playing! 🎮

---

## 🐛 Troubleshooting

### "npm: command not found"
- Install Node.js from https://nodejs.org/ (v18 or higher)

### "Cannot find module"
- Make sure you ran `npm install` in both `server` and `client` folders

### "Port 5000 already in use"
- Close any other programs using port 5000
- Or kill the process:
  ```powershell
  # Windows PowerShell
  netstat -ano | findstr :5000
  taskkill /PID <PID_NUMBER> /F
  ```

### "Port 3000 already in use"
- Vite will automatically try port 3001, 3002, etc.
- Check the terminal output for the actual port

### "Cannot connect to backend"
- Make sure Terminal 1 (backend) is running
- Check that it says "Server running on port 5000"
- Make sure both terminals are in the correct folders

### Backend won't start
- Check if you have TypeScript installed globally: `npm install -g tsx`
- Or install it locally: `cd server && npm install tsx --save-dev`

---

## 📋 What You Need

- ✅ **Node.js** (v18+) - https://nodejs.org/
- ✅ **npm** (comes with Node.js)
- ❌ **MongoDB** - NOT required (uses in-memory storage)
- ❌ **Firebase** - NOT required (can play as guest)
- ❌ **Judge0 API** - NOT required (has fallback mode)

---

## 🎮 Testing the New UI Features

After running the game, the new UI/UX features are ready to use:

1. **Hover over property tiles** - See 3D flip cards
2. **Roll dice** - Watch code symbol explosions
3. **Buy properties** - See confetti celebrations
4. **Pass GO** - See golden ring effect
5. **Press V key** - Toggle isometric view
6. **Move mouse** - See board parallax tilt

---

## 💡 Pro Tips

- Keep both terminals open while playing
- The backend must be running before starting the frontend
- If you make code changes, both servers auto-reload
- Check browser console (F12) for any errors

---

**That's it! You're ready to play CODEOPOLY! 🎉**

