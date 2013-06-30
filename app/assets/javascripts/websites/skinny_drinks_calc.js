function skinnyDrinks() {
	$('form').on('submit', function (e) {
		e.preventDefault();

		var name = $('.name').val().replace(/^\s+|\s+$/g, '');
		var abv = $('.abv').val().replace(/^\s+|\s+$/g, '');
		var calories = $('.calories').val().replace(/^\s+|\s+$/g, '');
		var ounces = $('.ounces').val().replace(/^\s+|\s+$/g, '');

		if (name === '') {
			name = "beverage"
		}

		if (_.isNaN(Number(abv))) {
			abv = abv.replace('%', '').replace(/^\s+|\s+$/g, '');
			if (_.isNaN(Number(abv))) {
				alert('Please enter the ABV as a numerical percent (e.g. 40%).');
			}
		} else if (_.isNaN(Number(calories))) {
			alert('Please enter the calories as a number (e.g. 99).');			
		} else if (_.isNaN(Number(abv))) {
			alert('Please enter the ounces as a number (e.g. 1.5).');
		} else {
			var skinny_factor = calculateSkinnyFactor(abv, calories, ounces);

			if (_.isNaN(skinny_factor)) {
				skinny_factor = 0;
			}

			if (skinny_factor > 100) {
				alert('Error: Skinny Factor out of range. Please check that the calories in your beverage and the beverage size in ounces are correct.');
			}
			 else {
				skinny_factor = skinny_factor.toFixed(2);
				$('.result').html('The Skinny Factor for ' + name + ' is');
				$('.skinny_factor').html(skinny_factor);
				$('#result_container').show();
			}
		}
	});

	function calculateSkinnyFactor(abv, cal, oz) {
		var cal_per_oz_alcohol = cal / (oz * abv / 100);

		var cal_per_oz_in_pure_alcohol = 245 / 1.5;

		return cal_per_oz_in_pure_alcohol / cal_per_oz_alcohol * 100;
	};
}