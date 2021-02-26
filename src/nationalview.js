import personalincome from '../static/income_per_hour_by_county.csv'
import personalincome2 from '../static/income_per_hour_by_county2.csv'

"use strict"; 
var countydata = [];
var countydata2 = [];
var years = [2016,2017,2018,2019];
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

vl.register(vega, vegaLite, options);


d3.csv(personalincome).then(function(data2) {
  data2.forEach(function(d){
    countydata.push(d);
  })
  d3.csv(personalincome2).then(function(data3){
    data3.forEach(function(e){
      countydata2.push(e);
    })

    drawAnnualIncomeCounty();
  })
});



function drawAnnualIncomeCounty() {  
  const sel = vl.selectSingle();
  //const selectyear = vl.selectSingle('Select') 
    //        .fields('Year')          
      //      .init({Year: years[0]}) 
        //    .bind({Year: vl.slider(2016,2019,1)});
  const map = vl.markGeoshape({stroke: 'lightgrey', strokeWidth: 0.25})
        .data(vl.topojson("https://cdn.jsdelivr.net/npm/vega-datasets@1.31.1/data/us-10m.json").feature('counties'))
        .select(sel)
        .transform(
          vl.lookup('id').from(vl.data(countydata).key('GeoFips').fields(['2019','GeoName']))
        )
        .encode(
          vl.color().fieldQ('2019').scale({domain: [0, 80],scheme: 'tealblues'}),
          vl.opacity().if(sel,vl.value(1)).value(0.5),
          vl.tooltip(['2019','GeoName'])
        );
  
  const states = vl.markGeoshape({fill: null, stroke: 'white', strokeWidth: 0.5})
        .data(vl.topojson("https://cdn.jsdelivr.net/npm/vega-datasets@1.31.1/data/us-10m.json").mesh('states'));
  const trend = vl.markPoint()
                  .data(countydata2)
                  .select(sel)
                  .encode(
                    vl.x().fieldO('Year'),
                    vl.y().average('Income'),
                    vl.color().fieldQ('Income').scale({domain: [0, 80],scheme: 'tealblues'}),
                    vl.opacity().if(sel,vl.value(1)).value(0),
                    vl.tooltip('Income')
                  )
  return vl.hconcat(vl.layer(map,states).project(vl.projection('albersUsa')).width(800).height(400),trend)
        .config({view: {stroke: null}})
        .render()
        .then(viewElement => {
            document.getElementById('nv').appendChild(viewElement);
        });
}