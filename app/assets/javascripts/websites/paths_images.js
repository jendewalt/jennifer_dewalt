function pathsImages() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var height = window.innerHeight;
	var width = window.innerWidth;
	var phrase = "The quick brown fox jumps over the lazy dog.".split('');
	var cur_index = 0;
	var min_size = 6;
	var opacity = 1.00;
	var font_color = '#000000';
	var font = 'serif'
	var timeout;
	var mouse = {
		lastX: 0,
		lastY: 0,
		drawing: false
	}
		
	canvas.height = height;
	canvas.width = width;

	ctx.fillStyle = 'white';
	ctx.fillRect(0,0,canvas.width,canvas.height);

	$('body').disableSelection();

	$('canvas').on('mousemove', function (e) {
		mouse.x = e.pageX - canvas.offsetLeft;
		mouse.y = e.pageY - canvas.offsetTop;

		if (!mouse.drawing) {
			clearTimeout(timeout);
			$('#control_container').show();

			timeout = setTimeout(function () {
				$('#control_container').fadeOut(500);
			}, 3000);
		} else {
			$('#control_container').hide();
		}

		drawLetter();
	});

	$('canvas').on('click', function (e) {
		mouse.x = e.pageX - canvas.offsetLeft;
		mouse.y = e.pageY - canvas.offsetTop;

		ctx.globalAlpha = opacity;
		ctx.fillStyle = font_color;
		ctx.font = min_size + 'px ' + font;
		ctx.fillText(phrase[cur_index], mouse.x, mouse.y);

		cur_index += 1 

		if (cur_index > phrase.length - 1) {
			cur_index = 0;
		}
	});

	$('#control_container').on('click', function (e) {
		e.stopPropagation();
		e.preventDefault();
		clearTimeout(timeout);
	});

	$('.opacity').on('click', function () {
		opacity += this.id == 'opacity_inc' ? 0.05 : -0.05;
		opacity = opacity > 0 ? opacity : 0;
		opacity = opacity <= 1.00 ? opacity : 1.00;

		$('#cur_opacity').text(opacity.toFixed(2));
	});

	$('.size').on('click', function () {
		min_size += this.id == 'size_inc' ? 2 : -2;
		min_size = min_size >= 0 ? min_size : 0;
		$('#cur_size').text(min_size);
	});

	$('#text').on('change', function () {
		phrase = this.value;
		cur_index = 0;
	});

	$('.picker').on('change', function () {
		font_color = '#' + this.value;
	});

	$('#font').on('change', function (e) {
		e.stopPropagation();
		font = $("#font option:selected").val();
	});

	$('#clear').on('click', function () {
		ctx.globalAlpha = 1;
		ctx.fillStyle = 'white';
		ctx.fillRect(0,0,canvas.width,canvas.height);
	});

	$('#save').on('click', function () {
		var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
		window.location.href = image;
	});

	$('canvas').on('mousedown', function (e) {
		mouse.drawing = true;
		mouse.lastX = e.pageX - canvas.offsetLeft;
		mouse.lastY = e.pageY - canvas.offsetTop;
	});

	$('canvas').on('mouseup', function () {
		mouse.drawing = false;
	});

	function drawLetter(click) {
		if (mouse.drawing || click) {
			var dx = mouse.x - mouse.lastX;
			var dy = mouse.y - mouse.lastY;
			var distance = Math.sqrt(dx * dx + dy * dy);
			var angle = Math.atan2(dy, dx);
			var font_size = min_size + distance / 3;
			var letter = phrase[cur_index];
			var letter_width;

			ctx.font = font_size + "px " + font;
			letter_width = ctx.measureText(letter).width;

			if (letter_width < distance) {
				ctx.save();
				ctx.beginPath();
				ctx.translate(mouse.lastX, mouse.lastY);
				ctx.rotate(angle);
				ctx.globalAlpha = opacity;
				ctx.fillStyle = font_color;
				ctx.fillText(letter,0,0);
				ctx.rotate(-angle);
				ctx.translate(-mouse.lastX, -mouse.lastY);
				ctx.restore();
				ctx.closePath();

				cur_index += 1;
				if (cur_index > phrase.length - 1) {
					cur_index = 0;
				}

				mouse.lastX = mouse.lastX + Math.cos(angle) * letter_width;
				mouse.lastY = mouse.lastY + Math.sin(angle) * letter_width;
			}
		}
	}
}