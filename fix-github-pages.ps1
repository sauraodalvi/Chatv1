# Fix GitHub Pages Deployment Script

Write-Host "Step 1: Installing gh-pages package..."
npm install --save-dev gh-pages

Write-Host "Step 2: Updating package.json..."
$packageJson = Get-Content -Path "package.json" -Raw | ConvertFrom-Json
$packageJson.scripts.predeploy = "npm run build"
$packageJson.scripts.deploy = "gh-pages -d dist"
$packageJson.homepage = "https://sauraodalvi.github.io/Chatv1/"
$packageJson | ConvertTo-Json -Depth 10 | Set-Content -Path "package.json"

Write-Host "Step 3: Updating vite.config.js..."
$viteConfig = @"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Chatv1/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
"@
Set-Content -Path "vite.config.js" -Value $viteConfig

Write-Host "Step 4: Creating .nojekyll file in public directory..."
New-Item -Path "public/.nojekyll" -ItemType File -Force

Write-Host "Step 5: Committing changes..."
git add .
git commit -m "Configure for GitHub Pages deployment"
git push origin master:main

Write-Host "Step 6: Deploying to GitHub Pages..."
npm run deploy

Write-Host "Done! Your site should be available at https://sauraodalvi.github.io/Chatv1/ in a few minutes."
