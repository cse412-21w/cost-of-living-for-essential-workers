import sunshineData from '../static/sunshine.csv'    // import dataset
"use strict";     // the code should be executed in "strict mode".
                  // With strict mode, you can not, for example, use undeclared variables

var line_svg;    // used for svg later
var colorSet;    // used for color scheme later
var sunshineArray = [];   // used to store data later

// preparation for our svg
var margin = { top: 50, right: 35, bottom: 50, left: 50 },
w = 650 - (margin.left + margin.right),
h = 520 - (margin.top + margin.bottom);
var legendSpace = 130;
console.log(margin);

// preparation for our x/y axis
var y = d3.scaleLinear()
          .range([h, 0]);
var x = d3.scaleTime()
          .range([0, w]);
var yAxis = d3.axisLeft(y);
var xAxis = d3.axisBottom(x)
  .tickFormat(d3.timeFormat("%b"));   // %b: abbreviated Month format (Mon, Jun..)

var citySet = [];

// once finish processing data, make a graph!
d3.csv(sunshineData).then(function(data) {
  data.forEach(function(d){
    sunshineArray.push(d);
    if (!citySet.includes(d.city)) {
      citySet.push(d.city);
    }
  })
  drawLineD3();
});

function drawLineD3() {
  colorSet = d3.scaleOrdinal()
               .domain(citySet)
               .range(d3.schemeSet2);
  x.domain(d3.extent(sunshineArray, d => d3.timeParse("%b")(d.month)));
  y.domain(d3.extent(sunshineArray, d => parseFloat(d.sunshine)));

  // create our svg
  line_svg = d3.select('#d3-demo')
              .append('svg')
                .attr("id", "line-chart")
                .attr("width", w + margin.left + margin.right + legendSpace)
                .attr("height", h + margin.top + margin.bottom)
              .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // append x axis to svg
  line_svg.append("g")
            .attr("transform", "translate(0," + h + ")")
            .attr("class","myXaxis")
            .call(xAxis);

  // append y axis to svg
  line_svg.append("g")
            .attr("class","myYaxis")
            .call(yAxis);

  // create a group to store lines for our line chart
  var path = line_svg.append('g')
                        .attr("id","paths-group");

  var line = d3.line()
              .x(d => x(d3.timeParse("%b")(d.month)))
              .y(d => y(parseFloat(d.sunshine)));  

  // make a line for each city
  citySet.forEach(function(d) {
      var currentCity = sunshineArray.filter(e => e.city === d);
      path.append("path")
            .datum(currentCity)
            .attr("class", "lines")
            .attr('d', line)
            .style("stroke-width", 2.5)
            .style("fill", "none")
            .attr("stroke", colorSet(d))
  });

  // add legend
  var legend = line_svg.append('g')
                        .attr("id","legend-group");

  legend.selectAll("rect").data(citySet)
      .join("rect")
        .attr("class","legends")
        .attr("x",600)
        .attr("y", d => 25+30*(citySet.indexOf(d)))
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", d => colorSet(d));

  legend.selectAll("text").data(citySet)
      .join("text")
        .attr("class","legends")
        .attr("x", 620)
        .attr("y", d => 30+30*(citySet.indexOf(d)))
        .text(d => d)
        .style("font-size", "15px")
        .attr("alignment-baseline","middle");
}


