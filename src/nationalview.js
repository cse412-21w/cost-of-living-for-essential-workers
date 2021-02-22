import personalincome from '../static/income_per_hour_by_county.csv'
import personalincomebystate from '../static/income_per_hour_by_state.csv'
"use strict"; 
var countydata = [];
var statedata = [];
//var yearrange = ['2016','2017','2018','2019'];
const options = {
    config: {
    },
    init: (view) => {
      view.tooltip(new vegaTooltip.Handler().call);
    },
    view: {
      renderer: "canvas",
    },
};

//const selectYear = vl.selectSingle('Select') // name the selection 'Select'
//.fields('Year')          // limit selection to the Major_Genre field
//.init('2016') // use first genre entry as initial value
//.bind(vl.menu(yearrange));
vl.register(vega, vegaLite, options);


d3.csv(personalincome).then(function(data2) {
  data2.forEach(function(d){
    countydata.push(d);
  })
  d3.csv(personalincomebystate).then(function(data3){
    data3.forEach(function(e){
      statedata.push(e);
    })

    drawAnnualIncomeCounty('2019');
  })
});



function drawAnnualIncomeCounty(year) {
  vl.markGeoshape({stroke: '#aaa', strokeWidth: 0.25})
        .data(vl.topojson("https://cdn.jsdelivr.net/npm/vega-datasets@1.31.1/data/us-10m.json").feature('counties'))
        .transform(
          vl.lookup('id').from(vl.data(countydata).key('GeoFips').fields(['GeoName',year])),
        )
        .encode(
          vl.color().fieldQ(year).scale({domain: [0, 100],scheme: 'lighttealblue'}),
          vl.tooltip(['GeoName',year])
        )
        .project(vl.projection('albersUsa'))
        .width(890).height(500)
        .config({view: {stroke: null}})
        .render()
    .then(viewElement => {
      document.getElementById('nv').appendChild(viewElement);
  });
}