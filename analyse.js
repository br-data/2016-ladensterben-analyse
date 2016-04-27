var fs = require('fs');
var path = require('path');

var parse = require('csv-parse/lib/sync');

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
  var results = [];

  for (var district in districts) {

    var currentDistrict = districts[district];

    // Calculate population change (absolute)
    currentDistrict.popDeltaAbs = currentDistrict.pop2014 - currentDistrict.pop2005;
    // Calculate population change (percentage)
    currentDistrict.popDeltaPrc = currentDistrict.popDeltaAbs / currentDistrict.pop2005;

    // Calculate shop count change (absolute)
    currentDistrict.shopCountDeltaAbs = currentDistrict.shopCount2015 - currentDistrict.shopCount2005;
    // Calculate shop count change (percentage)
    currentDistrict.shopCountDeltaPrc = currentDistrict.shopDeltaAbs / currentDistrict.shopCount2005;

    // Calculate shop sales area change (absolute)
    currentDistrict.salesAreaDeltaAbs = currentDistrict.salesArea2015 - currentDistrict.salesArea2005;
    // Calculate shop sales area change (percentage)
    currentDistrict.salesAreaDeltaPrc = currentDistrict.salesAreaDeltaAbs / currentDistrict.salesArea2005;

    // Calculate shop sales area change (absolute)
    currentDistrict.employeesDeltaAbs = currentDistrict.employees2015 - currentDistrict.employees2007;
    // Calculate shop sales area change (percentage)
    currentDistrict.employeesDeltaPrc = currentDistrict.employeesDeltaAbs / currentDistrict.employees2007;


    // Calculate number of towns without supermarkets per district
    currentDistrict.noSupermarketCount = towns.filter(function (currentTown) {

      return currentDistrict.admDistrict === currentTown.admDistrict &&
      currentDistrict.districtType === currentTown.districtType &&
      currentTown.supermarket === 0;
    }).length;

    // Calculate number of towns without supermarkets per district
    currentDistrict.noStoreCount = towns.filter(function (currentTown) {

      return currentDistrict.admDistrict === currentTown.admDistrict &&
      currentDistrict.districtType === currentTown.districtType &&
      currentTown.supermarket === 0;
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


    // Get biggest supermarket chain per district
    currentDistrict.supermarkets = supermarkets.filter(function (currentSupermarket) {

      return currentDistrict.admDistrict === currentSupermarket.admDistrict &&
      currentDistrict.districtType === currentSupermarket.districtType;
    });

    currentDistrict.supermarketsPerChain = aggregate(currentDistrict.supermarkets, function (supermarket) {

      return supermarket.chain;
    });

    currentDistrict.biggestChain = getBiggestChains(currentDistrict.supermarketsPerChain);

    currentDistrict.biggestChainCount = currentDistrict.biggestChain[0].value;

    currentDistrict.biggestChainDeltaAbs = currentDistrict.biggestChain[0].value - currentDistrict.biggestChain[1].value;
    currentDistrict.biggestChainDeltaPrc = currentDistrict.biggestChain[0].value / currentDistrict.biggestChainDeltaAbs * 100;
    currentDistrict.biggestChainDeltaFctr = currentDistrict.biggestChain[0].value / currentDistrict.biggestChain[1].value;

    currentDistrict.biggestChain = (function () {

      if (currentDistrict.biggestChain[0].value > currentDistrict.biggestChain[1].value) {

        return currentDistrict.biggestChain[0].name;
      } else {

        return currentDistrict.biggestChain[0].name + ' und ' + currentDistrict.biggestChain[1].name;
      }
    })();
  }
}

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

function getMaximumValue(obj) {

  return Object.keys(obj).reduce(function (m, k) {

    return obj[k] > m ? obj[k] : m;
  }, -Infinity);
}

function getKeyByValue(obj, val) {

  for (var prop in obj) {

    if (obj.hasOwnProperty(prop)) {

      if (obj[prop] === val) {

        return prop;
      }
    }
  }
}

function aggregate(arr, classifier) {

  return arr.reduce(function (counter, item) {

    var p = (classifier || String)(item);
    counter[p] = counter.hasOwnProperty(p) ? counter[p] + 1 : 1;

    return counter;
  }, {});
}

function parseCSV(data) {

  var parseOption = {

    columns: true,
    auto_parse: true
  };

  return parse(data, parseOption, function (error, parsedData) {

    if (!error) {

      return parsedData;
    } else {

      console.log(error);
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
