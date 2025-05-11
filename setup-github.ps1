# Setup GitHub Repository
Write-Host "Setting up GitHub repository..."

# Initialize git repository if not already initialized
if (-not (Test-Path -Path ".git")) {
    Write-Host "Initializing git repository..."
    git init
}

# Check if remote origin exists
$remoteExists = git remote -v | Select-String -Pattern "origin"
if (-not $remoteExists) {
    Write-Host "Adding remote repository..."
    git remote add origin https://github.com/sauraodalvi/Chatv1.git
}

# Add all files
Write-Host "Adding files..."
git add .

# Commit changes
Write-Host "Committing changes..."
git commit -m "Clean codebase for Vercel deployment"

# Push to GitHub
Write-Host "Pushing to GitHub..."
$currentBranch = git branch --show-current
if ($currentBranch -eq "master") {
    git push -f origin master:main
} else {
    git push -f origin $currentBranch:main
}

Write-Host "GitHub repository setup complete!"
