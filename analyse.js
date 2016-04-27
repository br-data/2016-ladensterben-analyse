var fs = require('fs');
var path = require('path');

var csv = require('csv');

(function init() {

  var data = parseCSV(loadFile('./clean/shopCount-perAdmDistrict-2005-2015.csv'));
  console.log(data);


})();

function analyse(files) {


}

function parseCSV(data) {

  var parseOption = {

    columns: true
  };

  return csv.parse(data, parseOption, function (error, output) {

    if (!error) {

      console.log(output);
    } else {

    }
  });
}

function loadFile(relativePath, callback) {

  relativePath = path.normalize(relativePath);

  try {

    return fs.readFileSync(relativePath, 'utf8').toString();
  } catch (error) {

    console.log(error);
  }
}
