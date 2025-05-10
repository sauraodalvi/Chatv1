@echo off
echo Initializing git repository...
git init

echo Adding remote repository...
git remote add origin https://github.com/sauraodalvi/Chatv1.git

echo Adding files...
git add .

echo Committing changes...
git commit -m "Initial commit with GitHub Pages setup"

echo Pushing to GitHub...
git push -u origin main

echo Done!
