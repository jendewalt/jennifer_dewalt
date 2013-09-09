function mousingPage() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var height = window.innerHeight;
	var width = window.innerWidth;
	var current_color = '#090912';
	var mouse_image = new Image();
	var mouse = {
		x: width / 4,
		y: height / 4,
		size: 0.5,
		image: mouse_image
	}
	var explosion = new Howl({
		urls: ['/assets/aggressive.mp3', '/assets/aggressive.ogg'],
		volume: 0.7
	});

	canvas.height = height;
	canvas.width = width;

	mouse.image.onload = function() {
		moveMouse();
	};

	$('body').on('mousemove', function (e) {
		mouse.x = e.pageX - canvas.offsetLeft;
		mouse.y = e.pageY - canvas.offsetTop;

		moveMouse();
	});

	$('body').on('click', function () {
		explode();
	});

	function moveMouse() {
		mouse.size = mouse.y * 0.001;

		var offset_x = mouse.image.width / 2;
		var position_y = ((mouse.y/height) * (height / 4)) + (height / 4) * 3 - (mouse.image.height * mouse.size);

		offset_x *= mouse.size;

		(height / 2) * (mouse.y / height)

		ctx.clearRect(0,0,width,height);
		ctx.drawImage(mouse.image, mouse.x - offset_x, position_y, mouse.image.width * mouse.size, mouse.image.height * mouse.size);
	}

	function explode() {
		var times = 0;
		explosion.play();

		changeBackground(times);
	}

	function changeBackground(times) {
		var color = randomColorRGB();
		$('#sky').css('background-color', 'rgba(' + color + ', 0.95)').show();

		if (times < 25) {
			setTimeout(function () {
				changeBackground(times += 1);
			}, 30);
		} else {
			$('#sky').hide();
		}
	}

	mouse.image.src = "/assets/mouse.png";

	$('body').disableSelection();
}