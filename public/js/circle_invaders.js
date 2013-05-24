$(document).ready(function () {
	var canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d'),
		invaders = [],
		shots = [],
		lives = 3,
		score = 0,
		level= 0,
		h = window.innerHeight - 40,
		w = window.innerWidth;

		canvas.height = h;
		canvas.width = w;

	(function( shooter, $, undefined ) {

	    shooter.x = w/2;
	    shooter.y = h;

	    shooter.draw = function () {
	        ctx.fillStyle = '#3a3a47';
	        ctx.fillRect(shooter.x, shooter.y, -30, -30);
	    };

	    shooter.shoot = function () {
	    	shots.push({
	    		x: shooter.x - 17,
	    		y: h - 30,
	    		speed: -3
	    	});
	    }

	}( window.shooter = window.shooter || {}, jQuery ));

	function Invader() {
		this.x = Math.random()*(w - 100) + 50;
		this.y = -50;
		this.color = randomColor();
		this.r = 15;
		this.speed = Math.random();
	};

	function drawShots() {
		_.each(shots, function (shot, i) {
			ctx.fillStyle = '#c20020';
			ctx.fillRect(shot.x, shot.y, 3, 5);

			_.each(invaders, function (invader, i) {
				if (shot.x < invader.x + invader.r && shot.x > invader.x - invader.r) {
					if (shot.y <= invader.y + invader.r) {
						score++;
						invaders[i] = new Invader();
					}
				}
			});

			if (shot.y <= 0) {
				shots.splice(i, 1);
			}

			shot.y += shot.speed;
		});
	}

	function drawScreen() {
		ctx.clearRect(0,0,w,h);
		drawInvaders();
		drawShots();
		shooter.draw();

		$('.lives').text('Lives: ' + lives);
		$('.score').text('Score: ' + score);

		if (lives == 0) {
			$('#game_over').show();
		} else {
			setTimeout(drawScreen, 20);
		}
	};

	function drawInvaders() {
		_.each(invaders, function (invader, i) {
			ctx.fillStyle = invader.color;
			ctx.beginPath();
			ctx.arc(invader.x, invader.y, invader.r, 0, Math.PI * 2);
			ctx.closePath();
			ctx.fill();

			invader.y += invader.speed;

			if (invader.y >= h - invader.r - 30) {
				invaders[i] = new Invader();
				lives--;
			}
		});
	};

	function init() {
		for (var i = 0; i < 8; i++) {
			invaders.push(new Invader());
		}
		drawScreen();

		setInterval(function () {
			for (var i = 0; i < 2; i++) {
				invaders.push(new Invader());
			}
			_.each(invaders, function (invader) {
				invader.speed += 0.08;
			});
		}, 10000);
	};

	$('.close').on('click', function () {
		$('#info').hide();
		init();
	});

	$(document).on('keydown', function (e) {
		var key = e.keyCode;
		if ( key == 32) {
			shooter.shoot();
		}

		if (key == 37) {
			shooter.x -= 10;

			if (shooter.x < 30) {
				shooter.x = 30;
			}
		}

		if (key == 39) {
			shooter.x += 10;

			if (shooter.x > w) {
				shooter.x = w;
			}
		}
	});
});

function randomColor() {
	return '#' + Math.random().toString(16).slice(2, 8);
};