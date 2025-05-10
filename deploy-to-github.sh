#!/bin/bash

# Build the project
npm run build

# Create a temporary directory for the gh-pages branch
mkdir -p temp-gh-pages

# Copy the built files to the temporary directory
cp -r dist/* temp-gh-pages/

# Create a .nojekyll file to prevent GitHub from ignoring files that begin with an underscore
touch temp-gh-pages/.nojekyll

# Switch to the gh-pages branch
git checkout -B gh-pages

# Remove existing files
git rm -rf .

# Copy the built files from the temporary directory
cp -r temp-gh-pages/* .
cp temp-gh-pages/.nojekyll .

# Remove the temporary directory
rm -rf temp-gh-pages

# Add all files
git add .

# Commit the changes
git commit -m "Deploy to GitHub Pages"

# Push to the gh-pages branch
git push -f origin gh-pages

# Switch back to the main branch
git checkout main

echo "Deployed to GitHub Pages!"
