function Converter(data,callback) {
	var raw_data = data
	console.log(raw_data[0]);
	this.notes = [];

	var max = find_max(raw_data)
	var min = find_min(raw_data)
	for( var i = 0; i < raw_data.length; i++){
		var next_note = (raw_data[i]['close']-min) * 128 / (max-min);

		console.log(next_note)
		this.notes.push(Math.round(next_note));
		if( i == raw_data.length - 1 ){
			callback(["finished",this.notes]);
		}
	}

}



function calculate_change(cur_item, prev_item) {
	console.log(cur_item)
	var d_price = cur_item['close'] - prev_item['close'];
	var d_time = (Date.parse(cur_item['time']) - Date.parse(prev_item['time']))/86400000;
	return d_price / d_time;
}

function find_min(data) {
	if(data.length <= 0)
		return undefined

	var min = data[0]['close']
	for(var i = 1; i < data.length; i++) {
		if(data[i]['close'] < min) {
			min = data[i]['close']
		}
	}

	return min
}


function find_max(data) {
	if (data.length <= 0)
		return undefined

	var max = data[0]['close']
	for(var i = 1; i < data.lenght; i++) {
		if(data[i]['close'] > max) {
			max = data[i]['close']
		}
	}

	return max
}