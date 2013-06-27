function countdownClock() {
	var secs = 0,
		mins = 0,
		hours = 0,
		days = 0,
		end_date,
		event_name,
		interval;

	init();

	$('form').on('submit', function (e) {
		e.preventDefault();
		init();


		var year = Number($('.year').val()),
			month = Number($('.month').val()),
			day = Number($('.day').val()),
			name = $('.name').val();

		if (_.isNaN(year)){
			alert('Not a valid year.');
		} else if (_.isNaN(month)) {
			alert('Please enter the month as a number, e.g. enter 3 for March.');
		} else if (_.isNaN(day)) {
			alert('You haven\'t learned your days yet?');
		} else {
			end_date = new Date(year, month - 1, day);
			dateDiff();
			$('.modal').fadeOut('600');
			$('#event_name').text(name);
			$('#container').fadeIn('600');
		}

	});

	function resetOnError() {
		$('#container').hide();
		$('.modal').show();
	};


	function dateDiff() {
		var now = new Date(),
			diff = end_date - now;

		days = Math.floor(diff/(3600 * 24 * 1000));
		var remainder =  diff % (3600 * 24 * 1000);

		hours = Math.floor(remainder / (3600 * 1000));
		remainder = diff % (3600 * 1000);

		mins = Math.floor(remainder / (60 * 1000));
		remainder = diff % (60 * 1000);

		secs = Math.floor(remainder / (1000));

		if (days > 9999) {
			init();
			alert('Date too far in the future.');
		} else {
			displayTime();
			setTimeout(dateDiff, 500);
		}
	};

	function displayTime() {
		makeDigitalOnes(secs, 'sec_ones');			
		makeDigitalOnes(mins, 'min_ones');			
		makeDigitalOnes(hours, 'hour_ones');
		makeDigitalOnes(days, 'day_ones');

		makeDigitalTens(secs, 'sec_tens');			
		makeDigitalTens(mins, 'min_tens');			
		makeDigitalTens(hours, 'hour_tens');		
		makeDigitalTens(days, 'day_tens');	

		makeDigitalHundreds(days, 'day_hundreds');		
		makeDigitalThousands(days, 'day_thousands');	
	};

	function makeDigitalOnes(time, unit) {
		var ones = time % 10;
		
		makeNum(ones, unit);
	};

	function makeDigitalTens(time, unit) {
		var tens = Math.floor(time/10);
		
		makeNum(tens, unit);
	};

	function makeDigitalHundreds(time, unit) {
		var hundreds = Math.floor(time/100);

		$('.hundreds').show();

		if (hundreds === 0) {
			$('.hundreds').hide();
		}
		
		makeNum(hundreds, unit);
	};

	function makeDigitalThousands(time, unit) {
		var thousands = Math.floor(time/1000);
		
		$('.thousands').show();

		if (thousands === 0) {
			$('.thousands').hide();
		}
		makeNum(thousands, unit);
	};

	function init() {
		makeDigitalOnes(0, 'sec_ones');			
		makeDigitalOnes(0, 'min_ones');			
		makeDigitalOnes(0, 'hour_ones');
		makeDigitalOnes(0, 'day_ones');

		makeDigitalTens(0, 'sec_tens');			
		makeDigitalTens(0, 'min_tens');			
		makeDigitalTens(0, 'hour_tens');		
		makeDigitalTens(0, 'day_tens');	

		makeDigitalHundreds(0, 'day_hundreds');		
		makeDigitalThousands(0, 'day_thousands');	
	}

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
}