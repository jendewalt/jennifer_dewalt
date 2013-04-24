$(document).ready(function () {
	var sec  = 0;
	var min  = 0;
	var hour = 0;
	var running = false;

	displayTime();

	$('#start').on('click', function () {
		running = true;
		countUp();
		
		$('#start').attr("disabled", true);
	});

	$('#stop').on('click', function () {
		running = false;

		$('#start').attr("disabled", false);
	});

	$('#reset').on('click', function () {
		running = false;
		sec = 0;
		min = 0;
		hour = 0;

		$('#start').attr("disabled", false);
		displayTime();
	});

	function displayTime() {
		makeDigitalOnes(sec, 'sec_ones');			
		makeDigitalOnes(min, 'min_ones');			
		makeDigitalOnes(hour, 'hour_ones');

		makeDigitalTens(sec, 'sec_tens');			
		makeDigitalTens(min, 'min_tens');			
		makeDigitalTens(hour, 'hour_tens');		
	};

	function countUp() {
		setTimeout(function () {
			if (running) {
				sec++;

				if (sec == 60) {
					sec = 0;
					min += 1;
				}
				if (min == 60) {
					min = 0;
					hour += 1
				}

				displayTime();
				countUp();
			}
		}, 1000);
	};

	function makeDigitalOnes(time, unit) {
		var ones = time % 10;
		
		makeNum(ones, unit);
	};

	function makeDigitalTens(time, unit) {
		var tens = Math.floor(time/10);
		
		makeNum(tens, unit);
	};

	function makeNum(num, unit) {
		var unit = '.' + unit;

		if (num == 0) {
			$(unit + '.bar').show();
			$(unit + '.hor.mid').hide();			
		} 
		if (num == 1) {
			$(unit + '.bar').hide();
			$(unit + '.ver.top.right,' + unit + '.ver.bottom.right').show();			
		}
		if (num == 2) {
			$(unit + '.bar').show();
			$(unit + '.ver.top.left,' + unit + '.ver.bottom.right').hide();			
		}
		if (num == 3) {
			$(unit + '.bar').show(),
			$(unit + '.ver.top.left,' + unit + '.ver.bottom.left').hide();			
		}
		if (num == 4) {
			$(unit + '.bar').show();
			$(unit + '.hor.top,' + unit +  '.hor.bottom,' + unit + '.ver.bottom.left').hide();			
		}
		if (num == 5) {
			$(unit + '.bar').show();
			$(unit + '.ver.top.right,' + unit + '.ver.bottom.left').hide();			
		}
		if (num == 6) {
			$(unit + '.bar').show();
			$(unit + '.ver.top.right').hide();			
		}
		if (num == 7) {
			$(unit + '.bar').hide();
			$(unit + '.ver.top.right,' + unit + '.ver.bottom.right,' + unit + '.hor.top').show();			
		}
		if (num == 8) {
			$(unit + '.bar').show();			
		}
		if (num == 9) {
			$(unit + '.bar').show();
			$(unit + '.ver.bottom.left').hide();			
		};
	};
});



















