# 🚀 HOW TO RUN CODOPOLY

## Quick Start (2 Steps!)

### Step 1: Start the Backend Server

Open **Terminal 1** (PowerShell or Command Prompt):

```powershell
cd server
npm run dev
```

You should see:
```
✅ Server running on port 5000
✅ Socket.io ready
```

### Step 2: Start the Frontend Server

Open **Terminal 2** (PowerShell or Command Prompt):

```powershell
cd client
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

### Step 3: Play!

1. Open your browser and go to: **http://localhost:3000**
2. Enter your name
3. Click "Create New Game" or "Join Game"
4. Start playing! 🎮

---

## ⚠️ If You Get Errors

### "Cannot find module" or "npm: command not found"
- Make sure you've installed dependencies:
  ```powershell
  cd server
  npm install
  
  cd ../client
  npm install
  ```

### "Port 5000 already in use"
- Close any other programs using port 5000
- Or change the port in `server/.env`:
  ```
  PORT=5001
  ```

### "Port 3000 already in use"
- Close any other programs using port 3000
- Vite will automatically try the next port (3001, 3002, etc.)

### "Cannot connect to backend"
- Make sure the backend server is running in Terminal 1
- Check that it says "Server running on port 5000"

---

## 🎮 What You'll See

1. **Lobby Page**: Create or join a game
2. **Game Room**: The Monopoly board with your player
3. **Roll Dice**: Click to move
4. **Solve Problems**: When you land on a property, solve a coding challenge
5. **Code Duels**: Challenge opponents when you land on their property!

---

## 💡 Tips

- **No MongoDB needed**: The game works without it (uses in-memory storage)
- **No Firebase needed**: You can play as a guest
- **No Judge0 API needed**: Code execution has a fallback mode

Enjoy playing CodeOpoly! 🎉

