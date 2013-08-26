function momentOfPeace() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var height = window.innerHeight;
	var width = window.innerWidth;
	var bubbles = [];
	var sound = new Howl({
		urls: ['/assets/moments_peace.mp3', '/assets/moments_peace.ogg'],
		volume: 0.7,
		loop: true
	});

	canvas.height = height;
	canvas.width = width;

	makeBubbles(canvas.width / 50);
	paintScreen();

	$('.time_container').on('click', function () {
		var time = this.id;
		sound.fadeIn(0.7, 1000);

		$('.start').fadeOut(1000, function () {
			$('canvas').fadeIn(1000);
			startTimer(time);
		});
	});

	function startTimer (goal_time) {
		var start = new Date().getTime();
		var time = 0;
		var elapsed = '0.0';

		function instance() {
			time += 100;
			elapsed = Math.floor(time / 100) / 10;
			var diff = (new Date().getTime() - start) - time;

			if (elapsed < goal_time * 60) {
				setTimeout(instance, (100 - diff));
			} else {
				endSession();
			}
		}
		setTimeout(instance, 100);
	}

	function endSession() {
		sound.fadeOut(0.0, 2000);

		$('canvas').fadeOut(1000, function () {
			$('.headline_container h1').text('Your Moment Is Complete');
			$('.headline_container p').text('Feel free to take another moment if you wish.');
			$('.headline_container p').text('Feel free to take another moment if you wish.');
			$('.start').fadeIn(1000);
		});
	}

	function Bubble() {

		this.init = function () {
			this.x = randomInt(0, canvas.width);
			this.y = -50;
			this.radius = randomInt(1, 8);
			this.vx = randomFloat(-0.7, 0.7);
			this.vy = randomFloat(0.2, 1.5);
			this.opactity = randomFloat(0.05, 0.2)
			this.color = 'rgba(255, 255, 255, ';			
		}

		this.draw = function () {
			ctx.beginPath();
			ctx.fillStyle = this.color + this.opactity;
			ctx.shadowBlur = 10;
			ctx.shadowColor = this.color + this.opactity;
			ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			ctx.fillStyle = this.color + this.opactity;
			ctx.fill();
			ctx.closePath();

			this.evolve();
		}

		this.evolve = function () {
			this.x += this.vx;
			this.y += this.vy;
			this.radius += 0.02;

			if (this.x > canvas.width + this.radius || 
			    this.x < 0 - this.radius || 
				this.y > canvas.height + this.radius) {
				this.init();
			}
		}

		this.init();
	}

	function makeBubbles(num) {
		bubbles.push(new Bubble());

		if (bubbles.length < num) {
			setTimeout(function () {
				makeBubbles(num)
			}, 500);
		}
	}

	function paintScreen() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		_.each(bubbles, function (bubble) {
			bubble.draw();
		});

		requestAnimFrame(paintScreen)
	}
}