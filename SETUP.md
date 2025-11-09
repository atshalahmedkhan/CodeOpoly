# CodeOpoly Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Firebase Setup (Optional for MVP)

For the hackathon MVP, the game works with local state management. To enable multiplayer with Firebase:

1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)

2. Enable Firestore Database

3. Copy `.env.example` to `.env.local` and fill in your Firebase credentials

4. The game will automatically use Firebase if credentials are provided

## Game Features

### Core Mechanics
- ✅ Roll dice and move around the board
- ✅ Solve LeetCode problems to buy properties
- ✅ Pay rent or challenge to code duels
- ✅ Upgrade properties by solving harder problems
- ✅ Jail/Debug Hell with buggy code challenges
- ✅ Community Chest and Chance cards

### Problem Types by Property
- **Brown (Easy)**: Arrays - Two Sum, Remove Duplicates
- **Light Blue (Easy)**: Strings - Reverse String, Valid Parentheses
- **Pink (Medium)**: Dynamic Programming - Max Subarray, Climbing Stairs
- **Orange (Medium)**: Arrays - Binary Search, Contains Duplicate
- **Red (Hard)**: Dynamic Programming - Advanced DP problems
- **Yellow (Hard)**: Graphs - Graph algorithms
- **Green (Hard)**: Trees - Tree problems
- **Dark Blue (Hard)**: System Design - Design problems

## Development Notes

- The code execution engine runs client-side for security
- Test cases are validated using deep equality checks
- Game state is managed locally (Firebase integration ready)
- Monaco Editor provides syntax highlighting and autocomplete

## Troubleshooting

**Monaco Editor not loading?**
- Ensure `@monaco-editor/react` is installed
- Check browser console for errors

**Code execution failing?**
- Make sure your function matches the expected signature
- Check that test cases are passing
- Verify your solution handles edge cases

## Next Steps for Production

1. Add Firebase real-time multiplayer
2. Implement spectator mode
3. Add betting system
4. Create more problems (50+)
5. Add user authentication
6. Implement leaderboards
7. Add sound effects and animations

