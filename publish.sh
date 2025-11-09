#!/bin/bash

echo "Publishing to github pages..."

git branch -D gh-pages
git checkout -b gh-pages
git push --force -u origin gh-pages

git checkout main

echo "Done!"