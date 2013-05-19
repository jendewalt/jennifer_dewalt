(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);

$(document).ready(function () {
	var canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d'),
		h = 500,
		w = 600,
		paddles = [],
		ball = {},
		score = 0,
		speed = 30,
		mouse = {x: 0, y: 0};

	canvas.height = h;
	canvas.width = w;
	$('body').disableSelection();

	function Paddle(pos) {
		this.h = 75;
		this.w = 10;
		this.x = (pos == 'left') ? 0 : w - this.w;
		this.y = h/2 - this.h/2;

		this.draw = function () {
			ctx.fillStyle = '#02c222';
			ctx.fillRect(this.x, this.y, this.w, this.h);
		};
	};

	ball = {
		x: randomInt(200, 400),
		y: randomInt(50, 450),
		vx: 5,
		vy: 5,
		radius: 10,

		draw: function () {
			ctx.beginPath();
			ctx.fillStyle = '#e8093d';
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
			ctx.fill();
		},

		move: function () {
			if (this.y > h - this.radius) {
				this.y = h - this.radius;
				this.vy *= -1;
			} else if(this.y < this.radius) {
				this.y = this.radius;
				this.vy *= -1;
			}

			this.x+= this.vx;
			this.y+= this.vy;
		}
	}

	function draw() {
		ctx.clearRect(0,0,w,h);
		ball.draw();
		_.each(paddles, function (p) {
			p.draw();
		});

		checkCollision();
	};

	function checkCollision() {
		var p1 = paddles[0],
			p2 = paddles[1],
			collision = false;

		if (ball.x >= w - 20) {
			if (ball.y > p2.y && ball.y < p2.y + p2.h) {
				ball.x = w-20;
				collision = true;
			}
		} else if (ball.x <= 20) {
			if (ball.y > p1.y && ball.y < p1.y + p1.h) {
				ball.x = 20;
				collision = true;
			}
		}

		if (collision) {
			ball.vx *= -1;
			score ++;
			if (score % 5 == 0) {
				speed *= 0.75;
				_.each(paddles, function (p) {
					p.h *= 0.85;
				})
			}
		}

		if (ball.x + ball.radius < 0 || ball.x - ball.radius > w) {
			$('#game_over').show();
		} else {
			update();
		}
	};

	function update() {
		ball.move();

		$('#score').text('Score: ' + score);

		setTimeout(function () {
			draw();
		}, speed);
	};

	function init() {
		paddles.push(new Paddle('left'));
		paddles.push(new Paddle('right'));

		draw();
	};

	$('#start').on('click', function () {
		$('#title_card').fadeOut('fast');

		setTimeout(function () {
			init();

			$('canvas').on('mousemove', function (e) {
			var p1 = paddles[0],
				p2 = paddles[1];

				p1.y = e.pageY - canvas.offsetTop;
				p2.y = e.pageY - canvas.offsetTop;
			});
		}, 600);
	});
});

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};












