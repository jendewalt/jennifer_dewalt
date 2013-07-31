function brickSmasher() {
	var width = 600;
	var height = 500;
	var random_direction = randomInt(0, 1) * 2 - 1;
	var speed_x = 3 * random_direction;
	var speed_y = -3;
	var paddle_width = 150;
	var paddle_height = 10;
	var brick_width = 50;
	var brick_height = 30;
	var bricks = [];
	var brick_hits = 0;
	var init_num_bricks = width / brick_width * 8;
	var colors = ['#e8566c', '#e8566c', '#1CCFC7', '#1CCFC7', '#FFC54A', '#FFC54A', '#19E1B2', '#19E1B2'];

	var ball_layer = new Kinetic.Layer();
	var paddle_layer = new Kinetic.Layer();
	var brick_layer = new Kinetic.Layer();

	var stage = new Kinetic.Stage({
        container: 'game',
        width: width,
        height: height
    });

	var ball = new Kinetic.Circle({
		x: randomInt(30, stage.getWidth() - 30),
		y: stage.getHeight() - 30,
		radius: 10,
		fill: '#0f0b7a',
		id: 'ball'
	});

	var paddle = new Kinetic.Rect({
		x: stage.getWidth() / 2,
		y: stage.getHeight() - 10,
		width: paddle_width,
		height: paddle_height,
		offsetX: paddle_width / 2, 
		fill: '#e8566c',
		id: 'paddle'
	});

	var frame_rate = 20;

	makeBricks();

	ball_layer.add(ball);
	paddle_layer.add(paddle);
	stage.add(ball_layer);
	stage.add(paddle_layer);
	stage.add(brick_layer);

	animate();

	$('body').on('mousemove', function (e) {
		var mouse = stage.getMousePosition();

		if (mouse) {
			paddle.setX( mouse.x);
			paddle_layer.draw();
		}
	});

	function animate() {
		ball.move(speed_x, speed_y);
		ball_layer.draw();

		if (ball.getY() > stage.getHeight() + ball.getRadius()) {
			$('h2').text('Bricks Smashed: ' + brick_hits);
			$('.modal').fadeIn(500);
		} else {
			checkCollisions();
		}
	}

	function Brick(x, y, color, i) {
		this.x = x;
		this.y = y;
		this.i = i;
		this.color = color;
		this.top = y;
		this.bottom = y + brick_height;
		this.left = x;
		this.right = x + brick_width;

		var brick = new Kinetic.Rect({
			x: this.x,
			y: this.y,
			width: brick_width,
			height: brick_height,
			fill: this.color,
			id: 'brick' + i		
		});

		brick_layer.add(brick);
	}

	function makeBricks() {
		var i = 0;
		var color = colors[i];
		var pos_x = 0;
		var pos_y = 50;

		_.each(_.range(init_num_bricks), function (num) {
			bricks.push(new Brick(pos_x, pos_y, color, num));

			pos_x += brick_width;

			if (pos_x >= stage.getWidth()) {
				pos_x = 0;
				pos_y += brick_height + 3;
				i += 1;
				color = colors[i]
			}
		});
	}

	function checkCollisions() {
		var ball_radius = ball.getRadius();
		var ball_x = ball.getX();
		var ball_y = ball.getY();
		var paddle_x = paddle.getX();
		var paddle_y = paddle.getY();

		// Check walls
		if (ball_x < 0 + ball_radius || ball_x > stage.getWidth() - ball_radius) {
			speed_x *= -1;
		} 
		if (ball_y + ball_radius < 0 + ball_radius) {
			speed_y *= -1;
		} 

		// Check paddle
		if (ball_x - ball_radius > paddle_x - paddle.getOffsetX() && ball_x + ball_radius < paddle_x + paddle.getOffsetX() && ball_y + ball_radius >= paddle_y) {

			ball.setY(paddle_y - 1 - ball_radius);
			speed_y *= -1;
			if (ball_x < paddle_x + paddle.getOffsetX) {
				speed_x = Math.abs(speed_x) * -1;
			} else if (ball_x >= paddle_x + paddle.getOffsetX) {
				speed_x = Math.abs(speed_x);
			}
		}

		// Check Bricks
		_.each(bricks, function (brick) {
			// Check Top & Bottom
			if (brick.left <= ball_x && ball_x <= brick.right) {
				if ((brick.top <= ball_y - ball_radius && ball_y - ball_radius <= brick.bottom) || (brick.top <= ball_y - ball_radius && ball_y - ball_radius <= brick.bottom)) {

					speed_y *= -1;
					stage.get('#brick' + brick.i).destroy();
					bricks = _.reject(bricks, function (check_brick) {
						return check_brick == brick;
					});

					brick_layer.draw();
					brick_hits += 1;
					updateGame();
				}
			}	
			// Check left and right
			if (brick.top <= ball_y && ball_y <= brick.bottom) {
                if ((brick.left <= ball_x - ball_radius && ball_x - ball_radius <= brick.right) || (brick.left <= ball_x - ball_radius && ball_x - ball_radius <= brick.right)) {	

                	speed_y *= -1;
					stage.get('#brick' + brick.i).destroy();
					bricks = _.reject(bricks, function (check_brick) {
						return check_brick == brick;
					});

					brick_layer.draw();
					brick_hits += 1;
					updateGame();
                }
            }		
		});	
		setTimeout(animate, frame_rate);
	}

	function updateGame() {
		if (brick_hits % 4 == 0 && brick_hits != 0) {
			frame_rate *= 0.85;
		}
	}
}