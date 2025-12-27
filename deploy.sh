#!/bin/bash
export PATH="$HOME/.gemini/tools/node-v20.11.0-darwin-arm64/bin:$PATH"

echo "🔨 Building and Deploying to GitHub Pages..."
# This will run 'vite build' then 'gh-pages -d dist'
npm run deploy

echo "✅ Deployment Process Finished!"
echo "If asked for username/password, use the same Token you used before."
