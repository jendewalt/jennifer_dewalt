$(document).ready(function () {
	
	function time() {
		var now = new Date();
		var hour =  now.getHours();
		var min =  now.getMinutes();
		var sec =  now.getSeconds();
		var color = timeColor(hour, min, sec);
		
		if (hour > 12) {
			hour = hour - 12;
		};

		hour = formatTime(hour);
		min = formatTime(min);
		sec = formatTime(sec);

		$('#cur_hour').text(hour);
		$('#cur_min').text(min);
		$('#cur_sec').text(sec);
		$('body').css('background-color', '#' + color);
		$('#cur_color').text(color);

		t=setTimeout(function(){time()}, 500);
	}

	function formatTime(i) {
		if (i < 10) {
			i = '0' + i;
		}
		return i;
	}
	function formatColor(i) {
		if (i.length < 2) {
			i = '0' + i;
		}
		return i;
	}

	function timeColor(hour, min, sec) {

		red = Math.round(255 * (hour / 23)).toString(16);
		green = Math.round(255 * (min / 59)).toString(16);
		blue = Math.round(255 * (sec / 59)).toString(16);

		red = formatColor(red);
		green = formatColor(green);
		blue = formatColor(blue);

		return (red + green + blue).toUpperCase();
	}

	time();	
});
