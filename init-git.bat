@echo off
echo Initializing git repository...
git init

echo Adding remote repository...
git remote add origin https://github.com/sauraodalvi/Chatv1.git

echo Adding files...
git add .

echo Committing changes...
git commit -m "Fix GitHub Pages deployment configuration"

echo Pushing to GitHub...
git push -f origin main

echo Done!
