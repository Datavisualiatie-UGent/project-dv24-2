#!/bin/bash

set -e
# create the dist from the code
echo "Building project..."
sleep 1
npm run build
echo "Build completed!"

# add the dist folder and commit it
# we need -f since dist is gitignored
git add dist -f
git commit -m "Add dist"

# push to gh-pages
echo "Pushing to github pages..."
git subtree push --prefix dist origin gh-pages
echo "Push completed!"
echo "The side should be up and running within minutes."
