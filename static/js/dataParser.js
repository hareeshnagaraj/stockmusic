/*

dataParser is the file used to parse the API response into the appropriate data for D3

*/
function dataParser(initial){ //Takes in the initial data as a parameter
  this.data = initial;
  this.JSONdata = this.data.data;
  this.columnNames = this.data.column_names;
  this.startDate;
  this.endDate;
  this.parse();
}

dataParser.prototype.parse = function(callback){  //Stores the data and column names in variables
  this.columnNames = this.data.column_names;  //Names for all the fields being queried
  this.JSONdata = this.data.data;
};

dataParser.prototype.getValues = function(param){    //Parses the data into the appropriate x y values for use with D3
  var returnCoordinates = [];
  for(var j = 0; j < this.data.length; j++){
    returnCoordinates.push([this.data[j]["time"],this.data[j]["close"]]);
  }
  return returnCoordinates;
};

function getMilli(date){
  var split = date.split('-');
  var year = split[0];
  var month = split[1];
  var day = split[2];
  // console.log(split)
  var d = new Date(year,month,day,0,0,0,0);
  // console.log(d)
  var milli = d.getMilliseconds();
  // console.log(milli + " mill");
}