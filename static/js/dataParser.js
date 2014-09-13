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
  console.log("in parse");
  console.log(this.data);
  this.columnNames = this.data.column_names;  //Names for all the fields being queried
  this.JSONdata = this.data.data;
};

dataParser.prototype.getValuesFor = function(param){    //Parses the data into the appropriate x y values for use with D3
  var count = -1;
  var returnValues = {};
  for(var i = 0; i < this.columnNames.length; i++){
    if(this.columnNames[i] == param){
      count = i;
    }
  }
  if(count != -1){
    for(var j = 0; j < this.JSONdata.length; j++){
      returnValues[this.JSONdata[j][0]] = this.JSONdata[j][count];
    }
    console.log(returnValues);
  }
};