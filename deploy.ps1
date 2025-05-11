# Master Deployment Script
Write-Host "Starting deployment process..."

# Step 1: Push to GitHub
Write-Host "Step 1: Pushing to GitHub..."
. ./setup-github.ps1

# Step 2: Deploy to Vercel
Write-Host "Step 2: Deploying to Vercel..."
. ./deploy-to-vercel.ps1

Write-Host "Deployment process complete!"
Write-Host "Your application should now be available on Vercel."
