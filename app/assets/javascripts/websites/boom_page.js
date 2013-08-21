function boomPage() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');

	var part_canvas = $('canvas')[1];
	var part_ctx = canvas.getContext('2d');

	var window_height = window.innerHeight;
	var window_width = window.innerWidth;
	var frames = [];
	var time_interval = 40;
	var mouse = {};
	var scale_adjust = 300;

	var particles = [];
	var	color = '#ebf9ff';
	var	part_time_interval = 10;
	var	acceleration = 0.0001;

	var bells = new Howl({
		urls: ['/assets/bells.mp3', '/assets/bells.ogg'],
		volume: 0.5
	});
	var boom = new Howl({
		urls: ['/assets/boom.mp3', '/assets/boom.ogg'],
		volume: 0.75
	});
	
	canvas.height = window_height;
	canvas.width = window_width;	
	part_canvas.height = window_height;
	part_canvas.width = window_width;

	function Frame(width, height, scale) {
		this.orig_width = this.width = width;
		this.orig_height = this.height = height;

		this.x = (canvas.width - width) / 2;
		this.y = (canvas.height - height) / 2;
		this.x_offset = (canvas.width - width) / 2;
		this.y_offset = (canvas.height - height) / 2;

		this.time = 1;
		this.orbs = [];

		this.makeOrb = function () {
			var orb = {};
			var x_offset = randomNumWithGap(0, 20, 80, 100) / 100;
			var y_offset = randomNumWithGap(0, 20, 80, 100) / 100;
		
			orb.radius = 400;
			orb.x_offset = x_offset
			orb.y_offset = y_offset
			orb.x = this.width * x_offset - this.x_offset;
			orb.y = this.height * y_offset - this.y_offset;
			this.orbs.push(orb);
		};

		this.evolve = function () {
			evolveFrame(this);
		}

		this.draw = function () {
			ctx.beginPath();
			ctx.fillStyle = 'transparent';
			ctx.fillRect(this.x, this.y, this.width, this.height);
			ctx.closePath();

			_.each(this.orbs, function (orb) {
				ctx.beginPath();
				ctx.fillStyle = 'rgba(255,255,255,0.4)';
				ctx.arc(orb.x, orb.y, orb.radius, 0, 2 * Math.PI);
				ctx.fill();
				ctx.closePath();
				
				ctx.beginPath();
				ctx.fillStyle = 'rgba(255,255,255,0.85)';
				ctx.arc(orb.x, orb.y, orb.radius / 1.2, 0, 2 * Math.PI);
				ctx.fill();
				ctx.closePath();
			});
		};

		function evolveFrame(frame) {
			frame.width = frame.orig_width / (frame.time * frame.time) * scale_adjust;
			frame.height = frame.orig_height / (frame.time * frame.time) * scale_adjust;

			frame.x = (frame.orig_width - frame.width) / 2 + frame.x_offset;
			frame.y = (frame.orig_height - frame.height) / 2 + frame.y_offset;

			frame.time += 1;

			_.each(frame.orbs, function (orb) {
				orb.x = frame.x + frame.width * orb.x_offset;
				orb.y = frame.y + frame.height * orb.y_offset;
				orb.radius = 250 / (frame.time * frame.time) * scale_adjust;
			});

			frame.draw();
		}

		for (var i = 0; i < randomInt(1, 3); i++) {
			this.makeOrb();
		}
	}

	function makeFrame() {
		frames.push(new Frame(canvas.width * 2, canvas.height * 2, 2));		
	}

	function makeParticles(x, y, scale) {
		for (var i = 0; i < 100; i++) {
						
			particles.push(new Particle(x, y, color, Math.random()*5.2 / (scale * 0.002), scale));
		}
	};

	function Particle(x, y, color, size, scale) {
		this.x = x;
		this.y = y;
		this.x0 = x;
		this.y0 = y;
		this.v0 = Math.random() / (scale * 0.003);
		this.angle = Math.random() * (360 * Math.PI / 180);
		this.time = 0;
		this.r = size,
		this.color = color;
		this.scale = scale;
	};

	function drawParticles() {
		_.each(particles, function (part) {
			part_ctx.fillStyle = part.color;
			part_ctx.beginPath();
			part_ctx.arc(part.x, part.y, part.r, 0, 2 * Math.PI);
			part_ctx.fill();
			part_ctx.closePath();
		});

		evolveParticles();
	};

	function evolveParticles() {
		particles = _.reject(particles, function (part, i) {
			var v0x = part.v0 * Math.sin(part.angle);
			var v0y = part.v0 * Math.cos(part.angle);

			part.time += part_time_interval;

			part.x = part.x0 + v0x * part.time; 
			part.y = part.y0 - v0y * part.time + acceleration * Math.pow(part.time, 2);

			if (part.time > randomInt(500, 1200)) {
				return true;
			}
		});
	};
	
	function paintScreen() {
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		_.each(frames, function (frame, i) {
			frame.evolve();

			if (frame.width < 10) {
				frames[i] = new Frame(canvas.width * 2, canvas.height * 2, 2);
			}
		});

		drawParticles();

		setTimeout(paintScreen, time_interval);
	}

	function intersects(x, y, cx, cy, r) {
	    var dx = x - cx;
	    var dy = y - cy;
	    return dx * dx + dy * dy <= r * r;
	}

	function init() {
		makeFrame();

		if (frames.length < 10) {
			setTimeout(init, 3000);
		}
	}

	init();
	paintScreen();

	$('canvas').on('mousemove', function (e) {
		mouse.x = e.pageX - canvas.offsetLeft;
		mouse.y = e.pageY - canvas.offsetTop;
	});

	document.addEventListener('touchmove', function (e) {
    	e.preventDefault();
    	mouse.x = e.pageX - canvas.offsetLeft;
		mouse.y = e.pageX - canvas.offsetTop;
	}, false);

	$('canvas').on('click', function (e) {
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;

		_.each(frames, function (frame) {
			var scale = frame.time * frame.time;
			frame.orbs = _.reject(frame.orbs, function (orb) {
				if (intersects(x, y, orb.x, orb.y, orb.radius)) {
					makeParticles(orb.x, orb.y, scale);
					bells.play();
					boom.play();
					return true;
				}
			});
		});
	});

	$('body').disableSelection();
}










