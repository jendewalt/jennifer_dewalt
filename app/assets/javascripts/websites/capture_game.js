function captureGame() {
	var canvas = $('canvas')[0],
		ctx = canvas.getContext('2d'),
		h = 500,
		w  = 700,
		balls = [],
		blasts = [],
		total_captured = 0,
		current_captured = 0,
		time_int = 50,
		level = 1,
		running = false,

		levels = [
			{
				num_balls: 3,
				target: 1
			},
			{
				num_balls: 8,
				target: 2
			},
			{
				num_balls: 12,
				target: 4
			},
			{
				num_balls: 20,
				target: 6
			},
			{
				num_balls: 25,
				target: 8
			},
			{
				num_balls: 25,
				target: 10
			},
			{
				num_balls: 40,
				target: 13
			},
			{
				num_balls: 40,
				target: 15
			},
			{
				num_balls: 45,
				target: 20
			},
			{
				num_balls: 40,
				target: 25
			},
			{
				num_balls: 50,
				target: 30
			},
			{
				num_balls: 50,
				target: 35
			},
			{
				num_balls: 55,
				target: 40
			},
			{
				num_balls: 58,
				target: 45
			},
			{
				num_balls: 65,
				target: 55
			},
			{
				num_balls: 73,
				target: 65
			},
			{
				num_balls: 80,
				target: 70
			},
			{
				num_balls: 80,
				target: 75
			},
			{
				num_balls: 80,
				target: 78
			}
		];

		canvas.height = h;
		canvas.width = w;

		function Ball(x, y, vx, vy) {
			this.x = x;
			this.y = y;
			this.vx = vx;
			this.vy = vy;
			this.r = 8;
			this.color = randomColorRGB();

			this.move = function () {
				if(this.x > w - 8) {
					this.x = w - 8;
					this.vx = -this.vx;
				} else if(this.x < 8) {
					this.x = 8;
					this.vx = -this.vx;
				}

				if(this.y > h - 8) {
					this.y = h - 8;
					this.vy = -this.vy;
				} else if(this.y < 38) {
					this.y = 38;
					this.vy = -this.vy;
				}

				this.x+= this.vx;
				this.y+= this.vy;

				ctx.fillStyle = 'rgba('+ this.color + ', 1)';
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
				ctx.closePath();
				ctx.fill();
			};
		};

		function Blast(x, y, color) {
			this.x = x;
			this.y = y;
			this.r = 40;
			this.color = color;
			this.time = time_int;

			this.draw = function () {
				ctx.fillStyle = 'rgba('+ this.color + ', 0.75)';
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
				ctx.closePath();
				ctx.fill();

				this.time += 50;
			};
		};

		function makeBall(x, y) {
			var vx = randomFloat(-5, 5);
			var vy = randomFloat(-5, 5);

			if (vx < 3 && vx > 0) {
				vx += 3;
			} else if (vx > -3 && vx < 0) {
				vx -= 3;
			}

			if (vy < 3 && vy > 0) {
				vy += 3;
			} else if (vy > -3 && vy < 0) {
				vy -= 3;
			}

			balls.push(new Ball(x, y, vx, vy));
		};

		function makeBlast(x, y, color) {
			blasts.push(new Blast(x, y, color));
		};

		function flashFail() {
			$('.fail').fadeIn('300');
		};

		function flashNextLevel() {
			$('.next h2').text('Target: ' + levels[level - 1].target);
			$('.next').fadeIn('300');
			setTimeout(function () {
				$('.next').fadeOut('300');
			}, 800);
		}

		function showWin() {
			$('.win').fadeIn('300');
		};

		function checkBlasts() {
			_.each(blasts, function (blast, i) {
				if (blast.time > 1500) {
					blasts.splice(i, 1);
				}
			});

			if (blasts.length == 0) {
				running = false;
				if (current_captured < levels[level - 1].target) {
					flashFail();
					startLevel();
				} else {
					total_captured += current_captured
					level++;

					if (level <= levels.length) {
						flashNextLevel();
						startLevel();
					} else {
						showWin();
					}
				}
			}
		};

		function drawScorePanel() {
			ctx.fillStyle = '#eb7405';
			ctx.fillRect(0, 0, w, 30);
			ctx.fillStyle = '#fff';
			ctx.font = '16px Open Sans';
			ctx.fillText('Target: ' + levels[level - 1].target, 20, 20);
			ctx.fillText('Captured: ' + current_captured, 120, 20);
			ctx.fillText('Score: ' + total_captured * 100, 250, 20);
		}

		function checkCollisions() {
			_.each(balls, function (ball, i) {
				_.each(blasts, function (blast, j) {
					if (ball.x - ball.r > blast.x - blast.r && ball.x + ball.r < blast.x + blast.r &&
						ball.y - ball.r > blast.y - blast.r && ball.y + ball.r < blast.y + blast.r) {
						
						makeBlast(ball.x, ball.y, ball.color);
						balls.splice(i, 1);

						current_captured++;
					}
				});
			});
			checkBlasts()
		};

		function paintScreen() {
			ctx.fillStyle = '#fff';
			ctx.fillRect(0,0,w,h);
			drawScorePanel();

			_.each(balls, function (ball) {
				ball.move();
			});
			_.each(blasts, function (blast) {
				blast.draw();
			});

			if (running) {
				checkCollisions();
			}
		};

		function startLevel() {
				balls = [];
				current_captured = 0;

				_.each(_.range(levels[level - 1].num_balls), function (i) {
					makeBall(randomInt(20, w - 20), randomInt(20, h - 42));
				});

				$('canvas').on('click', function (e) {
					var x = e.pageX - canvas.offsetLeft;
					var y = e.pageY - canvas.offsetTop;

					makeBlast(x, y, '100, 100, 100');
					running = true;
					$('canvas').off();
				});
		};

		startLevel();

		var play = setInterval(function () {
			paintScreen();
		}, time_int);

		$('.retry').on('click', function () {
			$('.modal').fadeOut('300');
		})

	$('body').disableSelection();
};


















