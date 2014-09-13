

function Converter(data) {
	var this.data = data
	var this.start_note = this.starting_note()
	var this.cur_note = this.start_note
	this.data = $.map(data, function(item, index) {
		if(index == 0) 
			return this.starting_note

		change = this.calculate_change(item, index)
		var next_note = this.cur_note + change
		this.cur_note = Math.round(next_note)
		return this.cur_note
	})
}

Converter.prototype.calculate_change = function(cur_item, cur_index) {
	var prev_item = this.data[cur_index-1]
	var d_price = cur_item[1] - prev_item[1]
	var d_time = cur_item[0] - prev_item[0]
	return d_price / d_time
}

Converter.prototype.starting_note = function() {
	return 60
}