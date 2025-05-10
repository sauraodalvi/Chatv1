#!/bin/bash

# Install Vercel CLI if not already installed
if ! command -v vercel &> /dev/null
then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy to Vercel
vercel --prod

echo "Deployed to Vercel!"
