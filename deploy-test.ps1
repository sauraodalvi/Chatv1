Write-Host "Adding test file..."
git add test.html

Write-Host "Committing changes..."
git commit -m "Add test page for GitHub Pages"

Write-Host "Pushing to GitHub..."
git push origin master:main

Write-Host "Creating gh-pages branch..."
git checkout -b gh-pages

Write-Host "Adding test file to gh-pages..."
git add test.html

Write-Host "Committing changes to gh-pages..."
git commit -m "Add test page for GitHub Pages"

Write-Host "Pushing to gh-pages branch..."
git push -f origin gh-pages

Write-Host "Switching back to master branch..."
git checkout master

Write-Host "Done!"
