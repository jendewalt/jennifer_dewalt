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
		h = window.innerHeight - 60,
		w = window.innerWidth,
		balls = [],
		bugs = [],
		bullets = 20,
		level = 1,
		curAngle = 45,
		cannon = {
			angle: degToRad(curAngle),
			x0: 40,
			y0: h - 20,
			power: 0.4
		},
		time_interval = 30,
		acceleration = 0.0001,

		levels = [
		{
			num_bugs: 3,
			bullets: 20,
			radius: 30
		},
		{
			num_bugs: 3,
			bullets: 20,
			radius: 20
		},
		{
			num_bugs: 5,
			bullets: 20,
			radius: 15		},
		{
			num_bugs: 8,
			bullets: 20,
			radius: 20		},
		{
			num_bugs: 5,
			bullets: 15,
			radius: 15		},
		{
			num_bugs: 3,
			bullets: 15,
			radius: 20		},
		{
			num_bugs: 3,
			bullets: 10,
			radius: 10		},
		{
			num_bugs: 5,
			bullets: 10,
			radius: 10		},
		{
			num_bugs: 3,
			bullets: 10,
			radius: 10		},
		{
			num_bugs: 3,
			bullets: 10,
			radius: 7		},
		{
			num_bugs: 3,
			bullets: 5,
			radius: 7
		}
		];

	canvas.height = h;
	canvas.width = w;
	

	function degToRad(deg) {
		return deg * Math.PI / 180;
	}

	function paintScreen() {
		ctx.clearRect(0, 0, w, h);
		
		drawCannon();
		drawBalls();
		drawBugs();
		checkKills();
		updateStats();

		setTimeout(paintScreen, 30);
	}

	function updateCannon() {
		cannon.x = 80 * Math.sin(cannon.angle);
		cannon.y = 80 * Math.cos(cannon.angle); 
	}

	function drawCannon () {
		ctx.fillStyle = '#34def5'
		ctx.strokeStyle = '#0898ab'
		ctx.beginPath();
		ctx.lineWidth = 40;
		ctx.moveTo(cannon.x0, cannon.y0);
		ctx.lineTo(cannon.x0 + cannon.x , cannon.y0 - cannon.y);
		ctx.stroke();
		ctx.closePath();
		
		ctx.beginPath();
		ctx.arc(cannon.x0, cannon.y0, 20, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
		
		updateCannon();
	}

	function Ball(x, y, angle, v0) {
		this.x = x;
		this.y = y;
		this.x0 = x;
		this.y0 = y;
		this.v0 = v0;
		this.angle = angle;
		this.time = 0;
		this.r = 5;
	};

	function drawBalls() {
		ctx.fillStyle = '#e61c23'
		_.each(balls, function (ball) {
			ctx.beginPath();
			ctx.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();
		});
		evolveBalls();
	};

	function evolveBalls() {
		_.each(balls, function (ball, i) {
			var v0x = ball.v0 * Math.sin(ball.angle);
			var v0y = ball.v0 * Math.cos(ball.angle);

			ball.time += time_interval;

			ball.x = ball.x0 + v0x * ball.time; 
			ball.y = ball.y0 - v0y * ball.time + acceleration * Math.pow(ball.time, 2);

			if (ball.y > h + ball.r) {
				balls.splice(i, 1);
			}
		});
	};

	function checkKills() {
		_.each(balls, function (ball) {
			_.each(bugs, function (bug, i) {
				if (ball.x + ball.r >= bug.x - bug.r && ball.x - ball.r <= bug.x + bug.r && ball.y + ball.r >= bug.y - bug.r && ball.y - ball.r <= bug.y + bug.r ) {
					bugs.splice(i, 1);

					if (bugs.length == 0) {
						if (level < 10) {
							level++;

							setLevel();
							$('.level_up').text('Next Level: ' + level);
							$('.level_up').show();
							
							setTimeout(function () {
								$('.level_up').fadeOut('700');
							}, 800);
						} else {
						$('.win').show();
						}	
					}
				}
			});
		});

		if (bullets == 0 && bugs.length != 0 && balls.length == 0) {
			$('.game_over').show();
		}
	};

	function setLevel() {
		for (var i = 0; i < levels[level].num_bugs; i++) {
			bugs.push(new Bug(levels[level].radius));
		}
		balls = []
		bullets = levels[level].bullets;
	};

	function Bug(radius) {
		this.x = Math.random() * (w - radius*2) + radius;
		this.y = Math.random() * (h - radius*2) + radius;
		this.r = radius;
	};

	function drawBugs() {
		_.each(bugs, function (bug) {
			ctx.fillStyle = '#172729';
			ctx.beginPath();
			ctx.arc(bug.x, bug.y, bug.r, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();

			ctx.beginPath();
			ctx.lineWidth = 3;
			ctx.moveTo(bug.x, bug.y);
			ctx.lineTo(bug.x + bug.r*1.75, bug.y);
			ctx.moveTo(bug.x, bug.y);
			ctx.lineTo(bug.x - bug.r*1.75, bug.y);

			ctx.moveTo(bug.x, bug.y);
			ctx.lineTo(bug.x + bug.r*1.75, bug.y + bug.r * 0.65);
			ctx.moveTo(bug.x, bug.y);
			ctx.lineTo(bug.x - bug.r*1.75, bug.y + bug.r * 0.65);

			ctx.moveTo(bug.x, bug.y);
			ctx.lineTo(bug.x + bug.r*1.75, bug.y - bug.r * 0.65);
			ctx.moveTo(bug.x, bug.y);
			ctx.lineTo(bug.x - bug.r*1.75, bug.y - bug.r * 0.65);
			ctx.strokeStyle = '#172729';
			ctx.stroke();
			ctx.closePath();

			ctx.beginPath();
			ctx.fillStyle = 'white'
			ctx.arc(bug.x + bug.r*0.4, bug.y + bug.r*0.5, bug.r * 0.2, 0, 2 * Math.PI);
			ctx.arc(bug.x - bug.r*0.4, bug.y + bug.r*0.5, bug.r * 0.2, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();
		});
	};

	function updateStats() {
		$('.power').text('Power Level: ' + Math.round(cannon.power * 100));
		$('.bullets').text('Bullets: ' + bullets);
		$('.level_stat').text('Level: ' + level);
	};

	$('#start').on('click', function () {
		setLevel();
		$('.info').fadeOut('fast');
		paintScreen();
	});

	$(document).on('keydown', function (e) {
		if (e.keyCode == 32 && bullets != 0) {
			balls.push(new Ball(cannon.x0 + cannon.x , cannon.y0 - cannon.y, cannon.angle, cannon.power));
			bullets--;
		}

		if (e.keyCode == 38) {
			cannon.angle -= degToRad(2);
		}

		if (e.keyCode == 40) {
			cannon.angle += degToRad(2);
		}

		if (e.keyCode == 37) {
			cannon.power -= 0.02;
			if (cannon.power <= 0) {
				cannon.power = 0;
			}
		}

		if (e.keyCode == 39) {
			cannon.power += 0.02;
			if (cannon.power >= 1) {
				cannon.power = 1;
			}
		}

	});

	$('body').disableSelection();
	
});
