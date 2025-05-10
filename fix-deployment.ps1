Write-Host "Adding files..."
git add .

Write-Host "Committing changes..."
git commit -m "Fix GitHub Pages deployment configuration"

Write-Host "Pushing to GitHub..."
git push -f origin master:main

Write-Host "Deploying to GitHub Pages..."
bash deploy-to-github.sh

Write-Host "Done!"
