# PowerShell script to commit and push changes, then publish gh-pages branch
# Set your remote first if not set: git remote add origin https://github.com/USERNAME/REPO.git

git add --all
git commit -m "chore: redesign UI (dark glassmorphism), responsive layout, JS refactor, add GH Pages workflow"

git push origin main

# Create orphan gh-pages branch and force push
git checkout --orphan gh-pages
git reset --hard
git clean -fd
git add --all
git commit -m "chore: deploy site to gh-pages"

git push -f origin gh-pages

git checkout main
