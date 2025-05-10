Write-Host "Initializing git repository..."
git init

Write-Host "Adding remote repository..."
git remote add origin https://github.com/sauraodalvi/Chatv1.git

Write-Host "Adding files..."
git add .

Write-Host "Committing changes..."
git commit -m "Fix GitHub Pages deployment configuration"

Write-Host "Pushing to GitHub..."
git push -f origin main

Write-Host "Done!"
