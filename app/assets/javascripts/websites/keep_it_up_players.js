function keepItUpGame() {
	window.requestAnimFrame = (function(){
	  return  window.requestAnimationFrame       ||
	          window.webkitRequestAnimationFrame ||
	          window.mozRequestAnimationFrame    ||
	          window.oRequestAnimationFrame      ||
	          window.msRequestAnimationFrame     ||
	          function( callback ){
	            window.setTimeout(callback, 1000 / 60);
	          };
	})();

	var canvas = $('canvas')[0],
		ctx = canvas.getContext('2d'),
		h = window.innerHeight * 0.8,
		w = 500,
		bounces = 0,
		time_interval = 30,
		acceleration = 0.00025,
		running,
		repaint,
		ball = {
			x: w / 2,
			y: h - 30,
			x0: w / 2,
			y0: h - 30,
			v0y: 0.23,
			time: 0,
			r: 20
		};

	canvas.height = h;
	canvas.width = w;

	function paintScreen() {
		ctx.clearRect(0, 0, w, h);
		drawBall();
		updateBounceScore();
	};

	function drawBall() {
		ctx.fillStyle = '#17b078'
		ctx.beginPath();
		ctx.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();

		evolveBall();
	};

	function evolveBall() {
		ball.y = ball.y0 - ball.v0y * ball.time + acceleration * Math.pow(ball.time, 2);

		ball.time += time_interval;

		if (ball.y > h + ball.r * 2) {
			clearInterval(repaint);
			$('input.score').val(bounces);
			$('h2.score').text('Your score is ' + bounces);
			$('#game_over').show();
		}
	};

	function checkIfHit(mouseX, mouseY) {
		if (mouseX > ball.x - ball.r && mouseX < ball.x + ball.r && mouseY > ball.y - ball.r && mouseY < ball.y + ball.r) {
			return true;
		}
	};

	function bounceBall() {
		ball.time = 0;
		ball.y0 = ball.y;
		ball.v0y += 0.025;
	};

	function updateBounceScore() {
		ctx.fillStyle = '#de1d91';
		ctx.font = 'bold 18px Lucida Grande';
		ctx.fillText('Score: ' + bounces, 30, 30);
	};

	paintScreen();

	$('.start_btn').on('click', function () {
		$('#start').fadeOut('400');		
	});

	$('canvas').on('mousedown', function (e) {
		var mouseX = e.pageX - canvas.offsetLeft;
		var mouseY = e.pageY - canvas.offsetTop;

		if (checkIfHit(mouseX, mouseY)){
			if (running === undefined) {
				repaint = setInterval(paintScreen, time_interval);
				running = true;
				bounces++;
			} else {
				bounceBall();
				bounces++;
			}
		}
	});

	$('form').on('submit', function (e) {
		if ($('#enter_name').val().length > 30) {
			e.preventDefault();

			$('#enter_name').val('');
			alert('Your name is too long. Better think of a nickname.');
		
		} else if ($('#enter_name').val().trim() == '') {
			e.preventDefault();

			$('#enter_name').val('');
			alert('Too embarrassed to enter a name, huh? TOO BAD! Name can\'t be empty!');
			
		} else {
			$('#enter_name').val($('#enter_name').val().trim());
			$('input.score').val(bounces);
		}
	});

	$('body').disableSelection();
};















