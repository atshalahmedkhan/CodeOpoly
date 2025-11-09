# CodeOpoly - Full Stack Implementation

**Competitive Coding Meets Monopoly - Real-time Multiplayer Edition**

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + Socket.io
- **Database**: MongoDB (Mongoose)
- **Code Execution**: Judge0 API (via RapidAPI)
- **Real-time**: Socket.io WebSockets

## 📁 Project Structure

```
codeopoly/
├── client/                 # Vite React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   ├── package.json
│   └── vite.config.ts
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # Express routes
│   │   ├── socket/        # Socket.io handlers
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utility functions
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- RapidAPI account (for Judge0)

### 1. Install Dependencies

```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

### 2. Set Up Environment Variables

**Backend** (`server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/codeopoly
CLIENT_URL=http://localhost:3000
RAPIDAPI_KEY=your-rapidapi-key-here
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
```

**Frontend** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Start MongoDB

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
```

### 4. Run the Application

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

### 5. Open Browser

Navigate to `http://localhost:3000`

## 🎮 Game Features

### Core Mechanics
- ✅ Real-time multiplayer (2-4 players)
- ✅ Turn-based gameplay
- ✅ 40-space Monopoly board
- ✅ Solve LeetCode problems to buy properties
- ✅ Code duels (1v1 battles)
- ✅ Property upgrades (houses/hotels)

### Socket.io Events

**Client → Server:**
- `join-game` - Join a game room
- `roll-dice` - Roll dice and move
- `buy-property` - Buy property with code solution
- `challenge-duel` - Challenge opponent to code duel
- `submit-duel-code` - Submit code in active duel
- `end-turn` - End current turn
- `get-game-state` - Request current game state

**Server → Client:**
- `joined-game` - Confirmation of joining
- `player-joined` - Another player joined
- `dice-rolled` - Dice roll result
- `landed-on-space` - Player landed on a space
- `property-bought` - Property was purchased
- `duel-started` - Code duel began
- `duel-progress` - Duel progress update
- `duel-ended` - Duel finished
- `turn-ended` - Turn changed
- `game-state` - Full game state update

## 📊 Database Models

### Game
- Room code (4-letter unique ID)
- Players array
- Board state (40 properties)
- Current turn
- Active duel (if any)

### Problem
- Title, description
- Difficulty (easy/medium/hard)
- Category (arrays/strings/dp/etc.)
- Function signatures (Python, JS, C++, Java)
- Test cases
- Time limit

## 🔧 Development

### Adding Problems

Add problems to MongoDB:
```javascript
const problem = new Problem({
  title: "Two Sum",
  description: "Find two numbers that add up to target...",
  difficulty: "easy",
  category: "arrays",
  functionName: "twoSum",
  functionSignatures: {
    python: "def twoSum(nums: List[int], target: int) -> List[int]:",
    javascript: "function twoSum(nums, target) {",
    // ...
  },
  testCases: [
    { input: [[2,7,11,15], 9], expectedOutput: [0,1] },
    // ...
  ],
});
await problem.save();
```

### Testing Socket Events

Use Socket.io client or test with multiple browser tabs.

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd client
vercel deploy
```

### Backend (Railway)
1. Connect GitHub repo
2. Set environment variables
3. Deploy

### MongoDB
- Use MongoDB Atlas (cloud)
- Update `MONGODB_URI` in production `.env`

## 📝 TODO

- [ ] Implement full Judge0 API integration
- [ ] Add spectator mode
- [ ] Implement betting system
- [ ] Add more problems (50+)
- [ ] Add animations and sound effects
- [ ] Implement user authentication
- [ ] Add leaderboards
- [ ] Mobile responsive design

## 🐛 Troubleshooting

**Socket.io connection fails:**
- Check CORS settings in server
- Verify `CLIENT_URL` matches frontend URL

**MongoDB connection fails:**
- Check MongoDB is running
- Verify `MONGODB_URI` is correct

**Code execution fails:**
- Check RapidAPI key is set
- Verify Judge0 API is accessible
- Check code syntax matches language

## 📄 License

MIT

