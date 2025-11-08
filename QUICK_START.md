# CodeOpoly - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend  
cd ../client
npm install
```

### Step 2: Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB locally, then:
mongod
```

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Use it in `server/.env`

### Step 3: Configure Environment

**Create `server/.env`:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/codeopoly
CLIENT_URL=http://localhost:3000
RAPIDAPI_KEY=your-key-here
```

**Create `client/.env`:**
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### Step 4: Start Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### Step 5: Play!

1. Open http://localhost:3000
2. Enter your name
3. Click "Create New Game"
4. Share room code with friends
5. Start playing!

## 🎮 How to Play

1. **Create/Join Game**: Enter name and room code
2. **Roll Dice**: Move around the board
3. **Buy Properties**: Solve coding problems
4. **Code Duels**: Challenge opponents when landing on their property
5. **Win**: Highest net worth after 60 minutes

## 🔧 Troubleshooting

**"Cannot connect to server"**
- Make sure backend is running on port 5000
- Check `VITE_API_URL` in client/.env

**"MongoDB connection failed"**
- Verify MongoDB is running
- Check `MONGODB_URI` in server/.env

**"Socket.io connection failed"**
- Check CORS settings
- Verify `CLIENT_URL` matches frontend URL

## 📚 Next Steps

- Add problems to MongoDB (see README_FULLSTACK.md)
- Get RapidAPI key for Judge0 (optional - has fallback)
- Deploy to Vercel (frontend) + Railway (backend)

