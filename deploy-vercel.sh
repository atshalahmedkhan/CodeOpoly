#!/bin/bash

echo "🚀 Starting Vercel Deployment for CodeOpoly"
echo ""

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo "📝 Please login to Vercel..."
    vercel login
fi

echo ""
echo "📦 Deploying client to Vercel..."
echo ""

# Deploy from client directory
cd client

# Deploy to preview
echo "Deploying to preview environment..."
vercel

echo ""
echo "✅ Preview deployment complete!"
echo ""
echo "To deploy to production, run:"
echo "  cd client && vercel --prod"
echo ""
echo "Or use the Vercel dashboard to deploy from GitHub."

