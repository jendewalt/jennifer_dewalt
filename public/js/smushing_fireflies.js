$(document).ready(function () {
	var i = 0;

	$('body').on('click', function (e) {
		var rand = randomInt(0, 20);

		$('#container').append('<div class="drop color' + rand + ' ' + '"></div>');
		$('.color' + rand).css( {top: e.pageY, left: e.pageX, backgroundColor: randomColor });
		i += 1;
	});

	function randomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	function randomColor() {
		return '#' + Math.random().toString(16).slice(2, 8);
	};

});