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
})({"ZQwg":[function(require,module,exports) {
module.exports = "https://cse412.github.io/project-demo/sunshine.45a98b78.csv";
},{}],"uEQA":[function(require,module,exports) {
"use strict";

var _sunshine = _interopRequireDefault(require("../static/sunshine.csv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import dataset
"use strict"; // the code should be executed in "strict mode".
// With strict mode, you can not, for example, use undeclared variables


var line_svg; // used for svg later

var colorSet; // used for color scheme later

var sunshineArray = []; // used to store data later
// preparation for our svg

var margin = {
  top: 50,
  right: 35,
  bottom: 50,
  left: 50
},
    w = 650 - (margin.left + margin.right),
    h = 520 - (margin.top + margin.bottom);
var legendSpace = 130;
console.log(margin); // preparation for our x/y axis

var y = d3.scaleLinear().range([h, 0]);
var x = d3.scaleTime().range([0, w]);
var yAxis = d3.axisLeft(y);
var xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%b")); // %b: abbreviated Month format (Mon, Jun..)

var citySet = []; // once finish processing data, make a graph!

d3.csv(_sunshine.default).then(function (data) {
  data.forEach(function (d) {
    sunshineArray.push(d);

    if (!citySet.includes(d.city)) {
      citySet.push(d.city);
    }
  });
  drawLineD3();
});

function drawLineD3() {
  colorSet = d3.scaleOrdinal().domain(citySet).range(d3.schemeSet2);
  x.domain(d3.extent(sunshineArray, function (d) {
    return d3.timeParse("%b")(d.month);
  }));
  y.domain(d3.extent(sunshineArray, function (d) {
    return parseFloat(d.sunshine);
  })); // create our svg

  line_svg = d3.select('#d3-demo').append('svg').attr("id", "line-chart").attr("width", w + margin.left + margin.right + legendSpace).attr("height", h + margin.top + margin.bottom).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')'); // append x axis to svg

  line_svg.append("g").attr("transform", "translate(0," + h + ")").attr("class", "myXaxis").call(xAxis); // append y axis to svg

  line_svg.append("g").attr("class", "myYaxis").call(yAxis); // create a group to store lines for our line chart

  var path = line_svg.append('g').attr("id", "paths-group");
  var line = d3.line().x(function (d) {
    return x(d3.timeParse("%b")(d.month));
  }).y(function (d) {
    return y(parseFloat(d.sunshine));
  }); // make a line for each city

  citySet.forEach(function (d) {
    var currentCity = sunshineArray.filter(function (e) {
      return e.city === d;
    });
    path.append("path").datum(currentCity).attr("class", "lines").attr('d', line).style("stroke-width", 2.5).style("fill", "none").attr("stroke", colorSet(d));
  }); // add legend

  var legend = line_svg.append('g').attr("id", "legend-group");
  legend.selectAll("rect").data(citySet).join("rect").attr("class", "legends").attr("x", 600).attr("y", function (d) {
    return 25 + 30 * citySet.indexOf(d);
  }).attr("width", 10).attr("height", 10).style("fill", function (d) {
    return colorSet(d);
  });
  legend.selectAll("text").data(citySet).join("text").attr("class", "legends").attr("x", 620).attr("y", function (d) {
    return 30 + 30 * citySet.indexOf(d);
  }).text(function (d) {
    return d;
  }).style("font-size", "15px").attr("alignment-baseline", "middle");
}
},{"../static/sunshine.csv":"ZQwg"}]},{},["uEQA"], null)
//# sourceMappingURL=https://cse412.github.io/project-demo/d3Demo.c3cad310.js.map