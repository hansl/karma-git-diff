# karma-git-diff
A Karma plugin to export the list of git diff to the JavaScript tests.

# How-to

Install the karma-git-diff plugin:

    npm install --save-dev karma-git-diff

Then add it to your `karma.conf.js` and configure it properly:

    modules.exports = function(config) {
      config.set({
        frameworks: ['jasmine', 'git-diff'],
        gitDiffConfig: {
          ref: 'origin/master'
        }
      });
    };

In your Javascript in Karma, there will now be a `window.__gitdiff__` that is an array of files that changed.

    > console.log(window.__gitdiff__);
    [ "karma.conf.js", "package.json", "test/root.js" ]

