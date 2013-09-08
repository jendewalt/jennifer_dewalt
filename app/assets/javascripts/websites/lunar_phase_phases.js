function lunarPhase() {
	var age = $('#age').data('age');
	var percent = $('#percent').data('percent');
	var direction;
	var quarter;
	var image

	if (age <= 29.53/2) {
		direction = "Waxing";
		quarter = "First";
	} else {
		direction = "Waning";
		quarter = "Last";
	}

	if (percent < 1) {
		$('#stage').text('New Moon');
		image = '/assets/new_moon.png';
	} else if (percent <= 49) {
		$('#stage').text(direction + ' Crescent');
	} else if (percent < 51) {
		$('#stage').text(quarter + ' Quarter');
		if (quarter == 'First') {
			image = '/assets/first_quarter.png';
		} else {
			image = '/assets/last_quarter.png';			
		}
	} else if (percent < 99) {
		$('#stage').text(direction + ' Gibbous');
	} else {
		$('#stage').text('Full Moon');
		image = '/assets/full_moon.png';
	}

	if (percent <= 49 && percent >= 1) {
		var prefix;
		prefix = age <= 29.53/2 ? "wax" : "wan";

		if (percent > 35) {
			image = '/assets/' + prefix + '_crescent5.png';
		} else if (percent > 25) {
			image = '/assets/' + prefix + '_crescent4.png';
		} else if (percent > 15) {
			image = '/assets/' + prefix + '_crescent3.png';
		} else if (percent > 9) {
			image = '/assets/' + prefix + '_crescent2.png';			
		} else if (percent > 3) {
			image = '/assets/' + prefix + '_crescent1.png';
		} else {
			image = '/assets/new_moon.png';
		}
	}

	if (percent >= 51 && percent <= 99) {
		var prefix;
		prefix = age <= 29.53/2 ? "wax" : "wan";

		if (percent > 95) {
			image = '/assets/full_moon.png';
		} else if (percent > 85) {
			image = '/assets/' + prefix + '_gib5.png';
		} else if (percent > 75) {
			image = '/assets/' + prefix + '_gib4.png';
		} else if (percent > 65) {
			image = '/assets/' + prefix + '_gib3.png';
		} else if (percent > 55) {
			image = '/assets/' + prefix + '_gib2.png';			
		} else {
			image = '/assets/' + prefix + '_gib1.png';
		}
	}

	$('#moon').attr('src', image);
}