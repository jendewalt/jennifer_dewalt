$(document).ready(function () {
	var count = 0;

	$('button').on('click', function () {
		$(this).hide();
		newButton();
	});

	function newButton() {
		var btn = randomInt(0, 5)

		if (btn == 0) {
			$('.btn_'+btn).css({top: randomInt(50, 450), left: randomInt(50, 800), 
									 backgroundColor: randomColor(), height: randomInt(22, 100),
									 width: randomInt(80, 200)}).show();
		} else {
			$('.btn_'+btn).css({top: randomInt(50, 450), left: randomInt(50, 800)}).show();
		}
	};

	function randomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	};

	function randomColor() {
		return '#' + Math.random().toString(16).slice(2, 8);
	};
});