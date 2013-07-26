function globGlob() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var height = window.innerHeight;
	var width = window.innerWidth;
	var globs = [];
	var r_min = 5;
	var winner_color = { h:336.8, s:50, l:44.7 };
	var challenger_color = { h:163, s:80, l:45.1 };
	var game_length = 10;
	var display_time = game_length;
	var running = false;
	var start;
	var	elapsed = 0;

	var last_glob_size = $('canvas').data('size');

	canvas.height = height;
	canvas.width = width;

	function Glob(x, y, radius, color) {
		this.opacity = 0.9 / (color.l + 1);
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;

		this.draw = function () {
			ctx.beginPath();
			ctx.fillStyle = 'hsl(' + this.color.h + ',' + this.color.s + '%, ' + this.color.l + '%)';
			ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			ctx.fill();

			ctx.strokeStyle = 'rgba(0,0,0, ' + this.opacity + ')';
			ctx.lineWidth = 2;
			ctx.stroke();
			ctx.closePath();
			
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius - 2, 0, 2 * Math.PI);
			ctx.strokeStyle = 'rgba(0,0,0, ' + this.opacity + ')';
			ctx.lineWidth = 4;
			ctx.stroke();
			ctx.closePath();

			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius - 3, 0, 2 * Math.PI);
			ctx.strokeStyle = 'rgba(0,0,0, ' + this.opacity + ')';
			ctx.lineWidth = 5;
			ctx.stroke();
			ctx.closePath();
		};
	}

	function endGame() {
		$('body').off();
		$('.score').text(globs[1].radius + ' awesome units!');

		if (globs[1].radius > globs[0].radius) {
			$('#kudos').text('Nice work beating the last glob grower!');
		} else {
			$('#kudos').text('Too bad you couldn\'t beat the last glob grower, though.');
		}

		$('.end').fadeIn(400);
		$.ajax({
			type: 'PUT',
			url: '/glob_glob/globs/1',
			data: {
				size: globs[1].radius
			}
		});
	}

	function paintScreen() {
		elapsed = new Date().getTime() - start;
		display_time = Math.ceil(game_length - elapsed / 1000);

		ctx.clearRect(0, 0, width, height);

		_.each(globs, function (glob) {
			glob.draw();
		});

		ctx.fillStyle = '#eb7405';
		ctx.font = '30px Futura';
		ctx.textAlign = 'center';
		ctx.fillText(display_time, width / 2, 80);

		if (elapsed >= game_length * 1000) {
			endGame();
			return;
		}
		setTimeout(paintScreen, 30);
	}

	function init() {
		globs.push(new Glob(width/3, height/2, last_glob_size, winner_color));
		globs.push(new Glob(width * (2/3), height/2, 10, challenger_color));

		_.each(globs, function (glob) {
			glob.draw();
		});

		ctx.fillStyle = '#eb7405';
		ctx.font = '30px Futura';
		ctx.textAlign = 'center';
		ctx.fillText(display_time, width / 2, 80);
	}

	init();

	$('body').on('keydown', function (e) {
		var key = e.charCode || e.keyCode;
		if (key == 32 && !running) {
			running = true;
			start = new Date().getTime();
			$('.start').fadeOut(200);
			paintScreen();
		}
	});

	$('body').on('keyup', function (e) {
		var key = e.charCode || e.keyCode;
		if (key == 32) {
			globs[1].radius += 1;
		}
	});

	$('body').disableSelection();
}