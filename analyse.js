var fs = require('fs');

(function init() {

  loadFiles();
})();

function loadFiles() {

  var files = [];
  var normalizedPath = require('path').join(__dirname, 'data');

  fs.readdirSync(normalizedPath).forEach(function (file) {

    var ref = require('./data/' + file);
    files.push(ref);
  });

  analyse(files);
}

function analyse(files) {


}
