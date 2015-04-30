var fs = require('fs');
var path = require('path');
var childProcess = require('child_process');
var execSync = childProcess.execSync || require('exec-sync');


var GIT_DIFF_PATH = '/__git_diff_adapter.js';
var TEMP_DIR = process.env.TMPDIR || process.env.TMP || process.env.TEMP || '/tmp';


function uid() {
    return Math.round(Math.random() * 100000);
}


var contentPath = path.normalize(TEMP_DIR + GIT_DIFF_PATH + '_' + uid() + '.js');
var adapterFile = {
    path: __dirname + GIT_DIFF_PATH,
    contentPath: contentPath,
    isUrl: true,
    content: '',
    mtime: new Date()
};



function initGitDiff(config, emitter) {
    var cmdline = 'git diff --name-only origin/master';
    // config.files.unshift({pattern: __dirname + GIT_DIFF_PATH, included: true, watched: false});
    // config.preprocessors['/__git_diff/__git_diff.js'] = ['git-diff'];

    emitter.on('file_list_modified', function(filesPromise) {
        filesPromise.then(function(files) {
            var stdout = execSync(cmdline);
            var content = 'window.__gitdiff__ = [';
            if (stdout) {
                content += '"' + stdout.split(/[\n\r]+/).join('", "') + '"';
            }
            content += ']';

            files.included.unshift(adapterFile);
            files.served.push(adapterFile);

            fs.writeFileSync(adapterFile.contentPath, content);
            adapterFile.mtime = new Date();
        });
    });
}


module.exports = {
  'framework:git-diff': ['factory', initGitDiff],
};
