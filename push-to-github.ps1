Write-Host "Initializing git repository..."
git init

Write-Host "Adding remote repository..."
git remote add origin https://github.com/sauraodalvi/Chatv1.git

Write-Host "Adding files..."
git add .

Write-Host "Committing changes..."
git commit -m "Initial commit with GitHub Pages setup"

Write-Host "Pushing to GitHub..."
git push -u origin main

Write-Host "Done!"
