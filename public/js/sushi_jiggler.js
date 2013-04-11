$(document).ready(function () {
	var animations = [ 'shake',
					   'hop',
					   'spin',
					   'grow',
					   'hooray' ];

	function getRandomInt (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	$('.sushi_box').on ('click', function () {
		var sushi = this;
		var animation = animations[getRandomInt(0, 4)];

		$(sushi).addClass(animation);

		setTimeout(function () {
			$(sushi).removeClass(animation);
		}, 2100);
	});


});