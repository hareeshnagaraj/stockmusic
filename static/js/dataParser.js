/*

dataParser is the file used to parse the API response into the appropriate data for D3

*/
function dataParser(initial){ //Takes in the initial data as a parameter
  this.data = initial;
  this.JSONdata;
  this.columnNames;
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
      returnCoordinates.push([this.JSONdata[j][count]]);
    }
  }
  console.log(returnCoordinates)
  var first = this.JSONdata[0][0];
  var last = this.JSONdata[this.JSONdata.length - 1][0];
  console.log("last " + last);
  // getMilli(first)

  var names = ['Price'];
  var step = (first - last)/(this.JSONdata.length);
  
  var returnMap = {}; //Building the final return object
  returnMap.start = first;
  returnMap.end = last;
  returnMap.step = 1;
  returnMap.names = names;
  returnMap.values = returnCoordinates;
  returnMap.scale = "linear";
  returnMap.displayNames = ['Price ', ' Date purchased'];
  // returnMap.axis = ['left','right'];
  console.log(returnMap);
  return returnMap;
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