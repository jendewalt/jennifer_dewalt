(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);

$(document).ready(function () {
	var canvas = $('canvas')[0],
		ctx = canvas.getContext('2d'),
		h = window.innerHeight,
		w = window.innerWidth,
		stars  = [],
		lasers = [],
		aliens = [],
		mouse = {
			x: 0,
			y: 0
		},
		ship_x = 0,
		ship_y = 0,
		alien_speed = 4,
		alien_rate = 2000,
		score = 0,
		game_over = false;
		
		canvas.height = h;
		canvas.width = w;

	var play = setInterval(paintScreen, 30);

	init();

	setTimeout(function () {
		$('.info').fadeOut('1500');
	}, 1500);


	$('canvas').on('mousemove', function (e) {
		mouse.x = e.clientX;
		mouse.y = e.clientY;
	});

	document.addEventListener('touchmove', function (e) {
    	e.preventDefault();

    	mouse.x = e.pageX;
		mouse.y = e.pageY;
	}, false);

	$('canvas').on('click', function () {
		lasers.push(new Laser(ship_x, ship_y));
	});

	document.addEventListener('touchstart', function () {
		lasers.push(new Laser(ship_x, ship_y));
	});

	function init() {
		makeStars();
		makeAliens();
	};

	function paintScreen() {
		ctx.fillStyle = '#02041f';
		ctx.fillRect(0,0,w,h);

		drawStars();
		drawSpaceship();
		drawLasers();
		drawAliens();

		checkCollisions();
	};

	function Star() {
		this.x = Math.random() * w;
		this.y = Math.random() * h;
		this.radius = Math.random() * 2;
		this.speed = Math.random() * 3;
		this.color = '#f5fae3';
	};

	function makeStars() {
		for (var i = 0; i < 200; i++) {
			stars.push(new Star());
		}
	};

	function makeAliens() {
		aliens.push(new Alien());

		setTimeout(makeAliens, alien_rate);
	};

	function drawStars() {
		_.each(stars, function (star, i) {
			ctx.fillStyle = star.color;
			ctx.beginPath();
			ctx.arc(star.x -= star.speed * 3, star.y, star.radius, 0, 2 * Math.PI);
			ctx.closePath();
			ctx.fill();

			if (star.x < -1 * star.radius) {
				star.x = w + star.radius;
			}

		});
	};

	function drawSpaceship() {
		ship_x += (mouse.x - ship_x) / 20;
		ship_y += (mouse.y - ship_y) / 5;
		if (!game_over) {
	        ctx.fillStyle = '#a3b9d6';
	        ctx.beginPath();
	        ctx.moveTo(ship_x, ship_y);
	        ctx.lineTo(ship_x - 35, ship_y - 15);
	        ctx.lineTo(ship_x - 45, ship_y);
	        ctx.lineTo(ship_x - 35, ship_y + 15);
	        ctx.lineTo(ship_x, ship_y);
	        ctx.closePath();
	        ctx.fill()			
		}
	};

	function Laser(x, y) {
		this.x = x;
		this.y = y;
		this.color = '#ff1f44';
	};

	function drawLasers() {
		_.each(lasers, function (laser, i) {
			ctx.strokeStyle = laser.color;
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(laser.x, laser.y);
			ctx.lineTo(laser.x + 30, laser.y);
			ctx.closePath();
			ctx.stroke();

			laser.x += 15;

			if (laser.x > w + 30) {
				lasers.splice(i, 1);
			}
		});
	};

	function Alien() {
		this.x = Math.random() + w;
		this.y = Math.random() * h;
		this.color = '#ff801f';
		this.speed = alien_speed;
	};

	function drawAliens() {
		_.each(aliens, function (alien, i) {
			ctx.fillStyle = alien.color;
			ctx.beginPath();
			ctx.moveTo(alien.x, alien.y);
			ctx.lineTo(alien.x + 20, alien.y + 10);
			ctx.lineTo(alien.x + 20, alien.y + 10);
			ctx.lineTo(alien.x + 15, alien.y);
			ctx.lineTo(alien.x + 20, alien.y - 10);
			ctx.lineTo(alien.x + 20, alien.y - 10);
			ctx.lineTo(alien.x, alien.y);
			ctx.closePath();
			ctx.fill();

			alien.x -= alien.speed;

			if (alien.x < 0 - 20) {
				aliens.splice(i, 1);
			}
		});
	};

	function checkCollisions() {
		_.each(aliens, function (alien, i) {
			if (alien.x < ship_x && alien.x > ship_x - 45 && alien.y < ship_y + 20 && alien.y > ship_y - 20) {

				clearInterval(play);

				ctx.fillStyle = 'rgba(199,40,26, 0.3)';
				ctx.beginPath();
				ctx.arc(alien.x - 5, ship_y, 90, 0, 2 * Math.PI);
				ctx.fill();
				ctx.closePath();

				ctx.beginPath();
				ctx.arc(alien.x - 5, ship_y, 80, 0, 2 * Math.PI);
				ctx.fill();
				ctx.closePath();

				ctx.beginPath();
				ctx.arc(alien.x - 5, ship_y, 70, 0, 2 * Math.PI);
				ctx.fill();
				ctx.closePath();

				ctx.beginPath();
				ctx.arc(alien.x - 5, ship_y, 60, 0, 2 * Math.PI);
				ctx.fill();
				ctx.closePath();

				ctx.beginPath();
				ctx.arc(alien.x - 5, ship_y, 50, 0, 2 * Math.PI);
				ctx.fill();
				ctx.closePath();

				ctx.beginPath();
				ctx.fillStyle = 'rgba(199,40,26, 0.95)';
				ctx.arc(alien.x - 5, ship_y, 40, 0, 2 * Math.PI);
				ctx.fill();
				ctx.closePath();

				$('.game_over').show();
				$('body').css('cursor', 'auto');

			} else {
				_.each(lasers, function (laser, j) {
					if ((alien.x < laser.x + 25) && (alien.x > laser.x) && 
						(alien.y < laser.y + 17) && (alien.y > laser.y - 17)) {

						score += 100;

						if (score % 500 == 0 && score != 0) {
							alien_rate *= 0.8;
							alien_speed *= 1.1;
						}

						aliens.splice(i, 1);
						lasers.splice(j, 1);

						ctx.beginPath();
						ctx.fillStyle = 'rgba(199,40,26, 0.95)';
						ctx.arc(alien.x - 5, laser.y, 40, 0, 2 * Math.PI);
						ctx.fill();
						ctx.closePath();
					}
				});
			}
		});
		
		updateScore();
	};

	function updateScore() {
		 ctx.fillStyle = '#ff801f';
		 ctx.font = 'bold 18px Lucida Grande';
		 ctx.fillText('Score: ' + score, 30, 30);
	};


	$('body').disableSelection();
});



















