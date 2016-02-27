# The front of the front-end for Runnable’s sandbox management platform.

## Setup
`npm install`

## Gulp Commands
**`gulp build`** Build and minify/optimize files.

**`gulp deploy:gh`** Build and minify/optimize files, then deploys to GitHub Pages.

**`gulp deploy:s3`** Build and minify/optimize files, then deploys to an amazon s3 bucket.

**`gulp`** Build and watch files for changes and builds when there are changes.

## Tagging
1. `npm version [type]`
2. `git push origin [version]`

## Deploying
1. Tag and push
2. Use ansible and the `marketing.yml` to deploy your tag to the requisite server 
