$(document).ready(function () {

	makeSpots(20);

	var mouseX = 0, mouseY = 0;

	$(document).on('mousemove', function (e) {
		mouseX = e.pageX;
		mouseY = e.pageY;
	});

	document.addEventListener('touchmove', function(e) {
    	e.preventDefault();

    	mouseX = e.pageX;
		mouseY = e.pageY;
	}, false);

	for (var i = 0; i < 20; i++) {
		moveDiv("#spot"+i, randomInt(8, 50));
	}	

	function randomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	function randomColor() {
		return '#' + Math.random().toString(16).slice(2, 8);
	};

	function makeSpots(num) {
		for (var i = 0; i < num; i++) {
			var size = randomInt(3, 65);
			var color = randomColor();

			$('#container').append('<div class="spot" id="spot' + i +'"></div>');
			$('#spot'+i).css( {backgroundColor: color, height: size, width: size} );
		}
	};

	function moveDiv(elm, speed) {
		var xp = 0, yp = 0;
		var loop = setInterval(function () {
			xp += (mouseX - xp) / speed;
			yp += (mouseY - yp) / speed;

			$(elm).css({left:xp, top:yp});

		}, 30);
	};
});