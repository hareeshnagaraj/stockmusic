

function Converter(data) {
	this.data = data
	this.start_note = this.starting_note()
	this.cur_note = this.start_note
	this.data = $.map(data, function(item, index) {
		if(index == 0) 
			return this.starting_note

		var change = calculate_change(item, data[index-1])
		var next_note = this.cur_note + change
		this.cur_note = Math.round(next_note)
		return this.cur_note
	})
}

Converter.prototype.starting_note = function() {
	return 60
}

function calculate_change(cur_item, prev_item) {
	var d_price = cur_item[1] - prev_item[1]
	var d_time = cur_item[0] - prev_item[0]
	return d_price / d_time
}