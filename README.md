# The front of the front-end for Runnable’s environment management platform.

## Setup
**`npm install`**

## Gulp Commands
**`gulp`** Build without minifying/optimizing files and watch for changes, then runs a local web server.

**`gulp build`** Build and minify/optimize files.

**`gulp build:dev`** Build without minifying/optimizing files.

**`gulp deploy:gh`** Build and minify/optimize files, then deploys to GitHub Pages.

**`gulp deploy:gh:dev`** Build without minifying/optimizing files, then deploys to GitHub Pages.

**`gulp deploy:s3`** Build and minify/optimize files, then deploys to an Amazon S3 bucket.

## Tagging
1. **`npm version [type]`** Choose the type of tag (‘major’, ‘minor’, or ‘patch’).
2. **`git push origin master [version]`** Push your tag to master.

## Deploying
1. Tag and push.
2. Use Ansible and the `marketing.yml` to deploy your tag to the requisite server. [?](https://github.com/CodeNow/devops-scripts#how-to-deploy-at-runnable)
