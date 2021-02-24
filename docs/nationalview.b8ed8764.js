// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"nugb":[function(require,module,exports) {
module.exports = "https://cse412-21w.github.io/cost-of-living-for-essential-workers/income_per_hour_by_county.43b4dfaf.csv";
},{}],"rkNJ":[function(require,module,exports) {
module.exports = "https://cse412-21w.github.io/cost-of-living-for-essential-workers/income_per_hour_by_state.16229637.csv";
},{}],"uC0e":[function(require,module,exports) {
"use strict";

var _income_per_hour_by_county = _interopRequireDefault(require("../static/income_per_hour_by_county.csv"));

var _income_per_hour_by_state = _interopRequireDefault(require("../static/income_per_hour_by_state.csv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

"use strict";

var countydata = [];
var statedata = []; //var yearrange = ['2016','2017','2018','2019'];

var options = {
  config: {},
  init: function init(view) {
    view.tooltip(new vegaTooltip.Handler().call);
  },
  view: {
    renderer: "canvas"
  }
}; //const selectYear = vl.selectSingle('Select') // name the selection 'Select'
//.fields('Year')          // limit selection to the Major_Genre field
//.init('2016') // use first genre entry as initial value
//.bind(vl.menu(yearrange));

vl.register(vega, vegaLite, options);
d3.csv(_income_per_hour_by_county.default).then(function (data2) {
  data2.forEach(function (d) {
    countydata.push(d);
  });
  d3.csv(_income_per_hour_by_state.default).then(function (data3) {
    data3.forEach(function (e) {
      statedata.push(e);
    });
    drawAnnualIncomeCounty('2019');
  });
});

function drawAnnualIncomeCounty(year) {
  vl.markGeoshape({
    stroke: '#aaa',
    strokeWidth: 0.25
  }).data(vl.topojson("https://cdn.jsdelivr.net/npm/vega-datasets@1.31.1/data/us-10m.json").feature('counties')).transform(vl.lookup('id').from(vl.data(countydata).key('GeoFips').fields(['GeoName', year]))).encode(vl.color().fieldQ(year).scale({
    domain: [0, 100],
    scheme: 'lighttealblue'
  }), vl.tooltip(['GeoName', year])).project(vl.projection('albersUsa')).width(890).height(500).config({
    view: {
      stroke: null
    }
  }).render().then(function (viewElement) {
    document.getElementById('nv').appendChild(viewElement);
  });
}
},{"../static/income_per_hour_by_county.csv":"nugb","../static/income_per_hour_by_state.csv":"rkNJ"}]},{},["uC0e"], null)
//# sourceMappingURL=https://cse412-21w.github.io/cost-of-living-for-essential-workers/nationalview.b8ed8764.js.map