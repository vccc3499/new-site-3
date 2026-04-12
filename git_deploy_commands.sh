#!/bin/sh
# Make sure you have set 'origin' remote to your GitHub repo URL.
# Example: git remote add origin git@github.com:USERNAME/REPO.git

# 1) Stage and commit changes
git add --all
git commit -m "chore: redesign UI (dark glassmorphism), responsive layout, JS refactor, add GH Pages workflow"

# 2) Push to main branch
git push origin main

# 3) Create or update gh-pages branch with site root (force-push)
# This will overwrite gh-pages branch with the current working tree. Use with caution.
git checkout --orphan gh-pages
git reset --hard
git clean -fd
git add --all
git commit -m "chore: deploy site to gh-pages"
git push -f origin gh-pages
# Return to main
git checkout main
