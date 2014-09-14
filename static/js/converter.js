

function Converter(data,callback) {
	this.raw_data = data
	this.start_note = this.starting_note()
	this.cur_note = this.start_note

	var parser = new dataParser(testdata);	//make sure the parameter for dataParser is the RAW data
	var values = parser.getValuesFor('High');
	this.data = []
	this.data[0] = this.start_note 
	for(var i = 1; i < values.length; i++){
		var change = (Math.round(calculate_change(values[i], values[i-1]) * 1000)/1000);

		// console.log(change)
		var next_note = this.cur_note * (change + 1)
		this.cur_note = next_note
		this.data[i] = this.cur_note
		if(i == values.length - 1){
			callback(["finished",this.data]);
		}
	}
}

Converter.prototype.starting_note = function() {
	return 60
}

function calculate_change(cur_item, prev_item) {
	// console.log(cur_item)
	// console.log(prev_item)
	var d_price = cur_item[1] - prev_item[1];
	var d_time = (Date.parse(cur_item[0]) - Date.parse(prev_item[0]))/86400000;
	return d_price / d_time;
}