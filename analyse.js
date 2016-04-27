var fs = require('fs');
var path = require('path');

var parse = require('csv-parse/lib/sync');
var stringify = require('csv-stringify');

(function init() {

  analyse();
})();

function analyse() {

  // Load and parse the datasets
  var districts = parseCSV(loadFile('./clean/shopCount-perAdmDistrict-2005-2015.csv'));
  var towns = parseCSV(loadFile('./clean/shopCount-perTown-2014.csv'));
  var supermarkets = parseCSV(loadFile('./clean/allSupermarkets-2015.csv'));
  var ruralStores = parseCSV(loadFile('./clean/allRuralStores-2015.csv'));

  // Analysis results go here
  var result = [];

  for (var district in districts) {

    var currentDistrict = districts[district];

    // Calculate population change from 2005 to 2014 (absolute)
    currentDistrict.popDeltaAbs = currentDistrict.pop2014 - currentDistrict.pop2005;

    // Calculate population change from 2005 to 2014 (percentage)
    currentDistrict.popDeltaPrc = currentDistrict.popDeltaAbs / currentDistrict.pop2005 * 100;

    // Calculate shop count change from 2005 to 2015 (absolute)
    currentDistrict.shopCountDeltaAbs = currentDistrict.shopCount2015 - currentDistrict.shopCount2005;

    // Calculate shop count change from 2005 to 2015 (percentage)
    currentDistrict.shopCountDeltaPrc = currentDistrict.shopCountDeltaAbs / currentDistrict.shopCount2005 * 100;

    // Calculate shop sales area change from 2005 to 2015 (absolute)
    currentDistrict.salesAreaDeltaAbs = currentDistrict.salesArea2015 - currentDistrict.salesArea2005;

    // Calculate shop sales area change from 2005 to 2015 (percentage)
    currentDistrict.salesAreaDeltaPrc = currentDistrict.salesAreaDeltaAbs / currentDistrict.salesArea2005 * 100;

    // Calculate shop sales area change from 2007 to 2015 (absolute)
    currentDistrict.employeesDeltaAbs = currentDistrict.employees2015 - currentDistrict.employees2007;

    // Calculate shop sales area change from 2007 to 2015 (percentage)
    currentDistrict.employeesDeltaPrc = currentDistrict.employeesDeltaAbs / currentDistrict.employees2007 * 100;


    // Calculate shops count for 2014
    currentDistrict.shopCount2014 = towns.filter(function (currentTown) {

      return currentDistrict.admDistrict === currentTown.admDistrict &&
      currentDistrict.districtType === currentTown.districtType;
    }).reduce(function (a, b) {

      return a + b.supermarket;
    }, 0);

    // Calculate shop count change from 2014 to 2015 (absolute)
    currentDistrict.lastShopCountDeltaAbs = currentDistrict.shopCount2015 - currentDistrict.shopCount2014;

    // Calculate shop count change  from 2014 to 2015 (percentage)
    currentDistrict.lastShopCountDeltaPrc = currentDistrict.lastShopCountDeltaAbs / currentDistrict.shopCount2014 * 100;


    // Get all towns per district
    var townsPerDistrict = towns.filter(function (currentTown) {

      return currentDistrict.admDistrict === currentTown.admDistrict &&
      currentDistrict.districtType === currentTown.districtType
    });

    // Calculate number of towns without supermarkets per district
    currentDistrict.noSupermarketCount = townsPerDistrict.filter(function (currentTown) {

      return currentTown.supermarket === 0;
    }).length;

    // Calculate number of towns without supermarkets per district
    currentDistrict.noStoreCount = townsPerDistrict.filter(function (currentTown) {

      return currentTown.supermarket === 0;
    }).length;


    // Get all rural stores per town and district
    currentDistrict.ruralStoresNames = ruralStores.filter(function (currentStore) {

      return currentDistrict.admDistrict === currentStore.admDistrict &&
      currentDistrict.districtType === currentStore.districtType;
    });

    // Calculate number of rural stores per district
    currentDistrict.ruralStoresCount = currentDistrict.ruralStoresNames.length;

    // Save the towns with rural stores as string
    currentDistrict.ruralStoresNames = currentDistrict.ruralStoresNames.map(function (currentStore) {

      return currentStore.town;
    }).join(', ');


    // Get all supermarkets per district
    var supermarketsPerDistrict = supermarkets.filter(function (currentSupermarket) {

      return currentDistrict.admDistrict === currentSupermarket.admDistrict &&
      currentDistrict.districtType === currentSupermarket.districtType;
    });

    // Aggregate supermarkets by chain affiliation
    var supermarketsPerChain = aggregate(supermarketsPerDistrict, function (supermarket) {

      return supermarket.chain;
    });

    // Get the two biggest supermarket chains
    currentDistrict.biggestChain = getBiggestChains(supermarketsPerChain);

    // Get the store number of the biggest supermarket chain
    currentDistrict.biggestChainCount = currentDistrict.biggestChain[0].value;

    // Calculate the difference (absolute) in stores between the first biggest and the second biggest supermarket chain
    currentDistrict.biggestChainDeltaAbs = currentDistrict.biggestChain[0].value - currentDistrict.biggestChain[1].value;

    // Calculate the difference (percentage) in stores between the first biggest and the second biggest supermarket chain
    currentDistrict.biggestChainDeltaPrc = currentDistrict.biggestChain[0].value / currentDistrict.biggestChainDeltaAbs * 100;

    // Calculate the difference (factor) in stores between the first biggest and the second biggest supermarket chain
    currentDistrict.biggestChainDeltaFctr = currentDistrict.biggestChain[0].value / currentDistrict.biggestChain[1].value;

    // Get the name of the biggest or the two biggest super market chains
    currentDistrict.biggestChain = (function () {

      if (currentDistrict.biggestChain[0].value > currentDistrict.biggestChain[1].value) {

        return currentDistrict.biggestChain[0].name;
      } else {

        return currentDistrict.biggestChain[0].name + ' und ' + currentDistrict.biggestChain[1].name;
      }
    })();

    result.push(currentDistrict);
  }

  // Convert JavaScript object to CSV string
  stringifyCSV(result, function (csv) {

    // Save the CSV string to file
    saveFile('./data.csv', csv);
  });
}

// Returns the two biggest supermarkets from an object
function getBiggestChains(obj) {

    var biggestValue, biggestKey, result = [];

    biggestValue = getMaximumValue(obj);
    biggestKey = getKeyByValue(obj, biggestValue);

    result.push({
      name: biggestKey,
      value: biggestValue
    });

    delete obj[biggestKey];

    biggestValue = getMaximumValue(obj);
    biggestKey = getKeyByValue(obj, biggestValue);

    result.push({
      name: biggestKey,
      value: biggestValue
    });

    return result;
}

// Return the highest value from an object
function getMaximumValue(obj) {

  return Object.keys(obj).reduce(function (m, k) {

    return obj[k] > m ? obj[k] : m;
  }, -Infinity);
}

// Return the key for certain value in an object
function getKeyByValue(obj, val) {

  for (var prop in obj) {

    if (obj.hasOwnProperty(prop)) {

      if (obj[prop] === val) {

        return prop;
      }
    }
  }
}

// Aggregate an object array by a given classifier
function aggregate(arr, classifier) {

  return arr.reduce(function (counter, item) {

    var p = (classifier || String)(item);
    counter[p] = counter.hasOwnProperty(p) ? counter[p] + 1 : 1;

    return counter;
  }, {});
}

function parseCSV(data, callback) {

  var options = {

    columns: true,
    auto_parse: true
  };

  return parse(data, options, function (error, parsedData) {

    if (!error) {

      return parsedData;
    } else {

      console.log(error);
    }
  });
}

function loadFile(relativePath) {

  relativePath = path.normalize(relativePath);

  try {

    return fs.readFileSync(relativePath, 'utf8').toString();
  } catch (error) {

    console.log(error);
  }
}

function stringifyCSV(data, callback) {

  var options = {

    header: true
  };

  stringify(data, options, function (error, stringData) {

    if (!error) {

      console.log(stringData);
      callback(stringData);
    } else {

      console.log(error);
    }
  });
}

function saveFile(relativePath, string) {

  relativePath = path.normalize(relativePath);

  try {

    return fs.writeFileSync(relativePath, string, 'utf8');
  } catch (error) {

    console.log(error);
  }
}
