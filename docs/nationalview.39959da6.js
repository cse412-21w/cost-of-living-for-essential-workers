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
module.exports = "https://cse412-21w.github.io/cost-of-living-for-essential-workers/income_per_hour_by_county.8f0633d1.csv";
},{}],"hQvi":[function(require,module,exports) {
module.exports = "https://cse412-21w.github.io/cost-of-living-for-essential-workers/income_per_hour_by_county2.d7665522.csv";
},{}],"uC0e":[function(require,module,exports) {
"use strict";

var _income_per_hour_by_county = _interopRequireDefault(require("../static/income_per_hour_by_county.csv"));

var _income_per_hour_by_county2 = _interopRequireDefault(require("../static/income_per_hour_by_county2.csv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

"use strict";

var countydata = [];
var countydata2 = [];
var years = [2016, 2017, 2018, 2019];
var options = {
  config: {},
  init: function init(view) {
    view.tooltip(new vegaTooltip.Handler().call);
  },
  view: {
    renderer: "canvas"
  }
};
vl.register(vega, vegaLite, options);
d3.csv(_income_per_hour_by_county.default).then(function (data2) {
  data2.forEach(function (d) {
    countydata.push(d);
  });
  d3.csv(_income_per_hour_by_county2.default).then(function (data3) {
    data3.forEach(function (e) {
      countydata2.push(e);
    });
    drawAnnualIncomeCounty();
  });
});

function drawAnnualIncomeCounty() {
  var sel = vl.selectSingle(); //const selectyear = vl.selectSingle('Select') 
  //        .fields('Year')          
  //      .init({Year: years[0]}) 
  //    .bind({Year: vl.slider(2016,2019,1)});

  var map = vl.markGeoshape({
    stroke: 'lightgrey',
    strokeWidth: 0.25
  }).data(vl.topojson("https://cdn.jsdelivr.net/npm/vega-datasets@1.31.1/data/us-10m.json").feature('counties')).select(sel).transform(vl.lookup('id').from(vl.data(countydata).key('GeoFips').fields(['2019', 'GeoName']))).encode(vl.color().fieldQ('2019').scale({
    domain: [0, 80],
    scheme: 'tealblues'
  }), vl.opacity().if(sel, vl.value(1)).value(0.5), vl.tooltip(['2019', 'GeoName']));
  var states = vl.markGeoshape({
    fill: null,
    stroke: 'white',
    strokeWidth: 0.5
  }).data(vl.topojson("https://cdn.jsdelivr.net/npm/vega-datasets@1.31.1/data/us-10m.json").mesh('states'));
  var trend = vl.markPoint().data(countydata2) //.select(sel)
  .encode(vl.x().fieldO('Year'), vl.y().average('Income'), vl.color().fieldQ('Income').scale({
    domain: [0, 80],
    scheme: 'tealblues'
  }), vl.opacity().if(sel, vl.value(1)).value(0), vl.tooltip('Income'));
  return vl.hconcat(vl.layer(map, states).project(vl.projection('albersUsa')).width(800).height(400), trend).config({
    view: {
      stroke: null
    }
  }).render().then(function (viewElement) {
    document.getElementById('nv').appendChild(viewElement);
  });
}
},{"../static/income_per_hour_by_county.csv":"nugb","../static/income_per_hour_by_county2.csv":"hQvi"}]},{},["uC0e"], null)
//# sourceMappingURL=https://cse412-21w.github.io/cost-of-living-for-essential-workers/nationalview.39959da6.js.map