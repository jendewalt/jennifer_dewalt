function wordClock() {
	getTime();

	function getTime() {
		var hour = new Date().getHours();

		if (hour > 11) {
			var abbrev = "pm";
		} 
		else {
			var abbrev = "am";
		}

		var min = new Date().getMinutes();

		if (min > 10 && min < 20) {
			var min_tens = min;
			var min_ones = null;
		} else if (min > 9) {
			var min_tens = Math.floor(min/10) * 10;
			var min_ones = min % 10;
		} else if (min == 0) {
			var min_tens = null;
			var min_ones = null;
		}
		else {
			var min_tens = "zero";
			var min_ones = min;
		}

		$(".hour_list li").removeClass('now');

		if (hour % 12 == 0) {
			$(".hour_list ." + 12).addClass('now');
		} else {
			$(".hour_list ." + hour % 12).addClass('now');
		} 

		$(".abbrev").removeClass('now');
		$("#" + abbrev).addClass('now');
		

		$(".min_list li").removeClass('now');
		$(".min_list ." + min_ones).addClass('now');
		$(".min_list ." + min_tens).addClass('now');
	
		setTimeout( getTime, 1000 );
	};
};