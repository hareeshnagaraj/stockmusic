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

dataParser.prototype.getValuesFor = function(param){    //Parses the data into the appropriate x y values for use with D3
  var count = -1;
  var returnCoordinates = [];
  for(var i = 0; i < this.columnNames.length; i++){
    if(this.columnNames[i] == param){
      count = i;
    }
  }
  if(count != -1){
    for(var j = 0; j < this.JSONdata.length; j++){
      // var XY = [this.JSONdata[j][0], this.JSONdata[j][count]];
      returnCoordinates.push([this.JSONdata[j][0],this.JSONdata[j][count]]);
    }
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