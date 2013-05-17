$(document).ready(function () {
	var canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d'),
		w = canvas.width,
		h = canvas.height,
		level = 1;

	var Food = function () {
		this.x = Math.floor(Math.random() * (w - snake.size) / snake.size);
		this.y = Math.floor(Math.random() * (h - snake.size) / snake.size);

		this.make = function() {
			ctx.fillStyle = '#1fe30d';
			ctx.fillRect(this.x*snake.size, this.y*snake.size, snake.size, snake.size);
		};
	};

	// Snake object
	(function( snake, $, undefined ) {
		// Private properties
		var segments = [],
			speed = 240,
			length = 10,
			foodBin = [],
			eaten = 0;

		// Public properties
		snake.size = 10,
		snake.dir = 'right';

		// Public methods
		snake.start = function () {
			for (var i = length -1; i >=0; i--) {
				segments.push({x: i, y: 0});
			}

			foodBin.push(new Food());
			drawSnake();
		}		

		// Private methods
		function drawSnake() {
			ctx.clearRect(0, 0, w, h);
			_.each(segments, function (seg) {
				ctx.fillStyle = '#f5f5f5';
				ctx.fillRect(seg.x * snake.size, seg.y * snake.size, snake.size, snake.size);
			});

			_.each(foodBin, function (food) {
				food.make();
			});

			setTimeout(updateSnake, speed);
		};

		function updateSnake() {
			var new_x = segments[0].x,
				new_y = segments[0].y;

			if (snake.dir == 'right') {
				new_x++;
			} else if (snake.dir == 'left') {
				new_x--;
			} else if (snake.dir == 'down') {
				new_y++;
			} else if (snake.dir == 'up') {
				new_y--;
			}
			checkCollision(new_x, new_y);
		};

		function checkCollision(x, y) {
			var collision = false;

			for (var i = 1; i < segments.length; i++) {
				var s = segments[i];
				
				if (s.x == x && s.y == y) {
					collision = true;
				}
			}

			if (x == -1 || y == -1 || x == w /snake.size || y == h / snake.size) {
				collision = true;
			}

			if (collision) {
				$('#help').hide();
				$('#game_over').show();
			} else {
				checkFood(x, y);
			}
		};

		function checkFood(x, y) {
			_.each(foodBin, function (food, i) {
				if (food.x == x && food.y == y) {
					eaten++;
					segments.push({x: food.x, y: food.y});
					foodBin.splice(i, 1);
					
	

					if (foodBin.length == 0) {
						level++;
						speed *= 0.75;
						for (var i = 0; i < level; i++) {
							foodBin.push(new Food);
						}
						$('#level').text('Level: ' + level);
					}
				}
			});
			moveSnake(x, y);
		}

		function moveSnake(x, y) {
			var tail = segments.pop();
			tail.x = x;
			tail.y = y;
			segments.unshift(tail);

			drawSnake();
		};

	}( window.snake = window.snake || {}, jQuery ));

	snake.start();

	$('#info_tab').on('click', function() {
		$('#help').show();
	});

	$('.close').on('click', function () {
		$('#help').hide();
	});

	$(document).on('keydown', function (e) {
		var key = e.keyCode;

		if (key == 37 && snake.dir != 'right') {
			setTimeout(function () {
				snake.dir = 'left';
			}, 30);
		} else if (key == 38 && snake.dir != 'down') {
			setTimeout(function () {
				snake.dir = 'up';
			}, 30);
		} else if (key == 39 && snake.dir != 'left') {
			setTimeout(function () {
				snake.dir = 'right';
			}, 30);
		} else if (key == 40 && snake.dir != 'up') {
			setTimeout(function () {
				snake.dir = 'down';
			}, 30);
		}

		e.preventDefault();
	});
});