# Deploy to Vercel
Write-Host "Deploying to Vercel..."

# Check if Vercel CLI is installed
$vercelInstalled = npm list -g vercel
if (-not $vercelInstalled) {
    Write-Host "Installing Vercel CLI..."
    npm install -g vercel
}

# Deploy to Vercel
Write-Host "Running Vercel deployment..."
vercel --prod

Write-Host "Deployment complete!"
