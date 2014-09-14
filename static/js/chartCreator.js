/*

  This class is designed to load the chart displayed by nvd3js in the main page. The slope of this chart is then used to determine musical composition

*/
function chartCreator(initial,nv){

  this.data = initial;
  var chart;
  nv.addGraph(function() {
  chart = nv.models.lineChart()
  .options({
    margin: {left: 100, bottom: 100},
    x: function(d,i) { return i},
    showXAxis: true,
    showYAxis: true,
    transitionDuration: 250
  });

  // chart sub-models (ie. xAxis, yAxis, etc) when accessed directly, return themselves, not the parent chart, so need to chain separately
  chart.xAxis
    .axisLabel("Date")
    .tickFormat(d3.format(',.2f'));

  chart.yAxis
    .axisLabel('Price')
    .tickFormat(d3.format(',.2f'));

  d3.select('#chart1 svg')
    .datum(getChartValues(initial))
    .call(chart);

  //TODO: Figure out a good way to do this automatically
  nv.utils.windowResize(chart.update);
  //nv.utils.windowResize(function() { d3.select('#chart1 svg').call(chart) });
  chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });

  return chart;
  });
};


function getChartValues(data) {
var p1 = [];
// console.log(datumta)
for (var i = 0; i < data.length; i++) {
  p1.push({x: data[i]['time'], y: data[i]['close'] }); //the nulls are to show how defined works
}


return [
  {
    values: p1,
    key: currentStock + " Stock High",
    color: "#ff7f0e"
  }
];
}