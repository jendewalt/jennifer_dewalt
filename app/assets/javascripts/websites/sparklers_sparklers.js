function sparklers() {
	var canvas = $('canvas')[0],
		ctx = canvas.getContext('2d'),
		h = window.innerHeight,
		w = window.innerWidth,
		particles = [],
		color = '#ffe0ab',
		time_interval = 10,
		acceleration = 0.0001,
		sparkler = {
			x: w / 2,
			y: h / 2,
			x0: w / 2,
			y0: h / 2
		}
		mouse = {
			x: w / 2,
			y: h / 2
		};

	canvas.height = h;
	canvas.width = w;

	paintScreen();

	makeParticles(mouse.x, mouse.y);

	$('body').disableSelection();

	$('canvas').on('mousemove', function (e) {
		mouse.x = e.pageX;
		mouse.y = e.pageY;
	});

	document.addEventListener('touchmove', function (e) {
    	e.preventDefault();

    	mouse.x = e.pageX;
		mouse.y = e.pageY;
	}, false);

	function paintScreen() {
		ctx.fillStyle = 'rgba(0,0,0,0.15)';
		ctx.fillRect(0, 0, w, h);

		drawSparkler();

		requestAnimFrame(paintScreen);		
	};

	function makeParticles(x, y) {
		for (var i = 0; i < 100; i++) {
			particles.push(new Particle(x, y, color, Math.random()*1.2));
		}
	};

	function Particle(x, y, color, size) {
		this.x = x;
		this.y = y;
		this.x0 = x;
		this.y0 = y;
		this.v0 = Math.random()/4;
		this.angle = Math.random() * (360 * Math.PI / 180);
		this.time = 0;
		this.r = size,
		this.color = color;
	};

	function drawSparkler() {
		ctx.beginPath();
		ctx.strokeStyle = '#222';
		ctx.lineWidth = 1;
		ctx.moveTo(sparkler.x, sparkler.y);
		ctx.lineTo(sparkler.x + 20, sparkler.y + 100);
		ctx.stroke();
		ctx.closePath();

		ctx.strokeStyle = 'rgba(255,224,171, 0.5)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(sparkler.x0, sparkler.y0);
		ctx.lineTo(sparkler.x, sparkler.y);
		ctx.stroke();
		ctx.closePath();

		sparkler.x0 = sparkler.x;			
		sparkler.y0 = sparkler.y;	

		sparkler.x += (mouse.x - sparkler.x) / 2;
		sparkler.y += (mouse.y - sparkler.y) / 2;		

		drawParticles();
	};

	function drawParticles() {
		_.each(particles, function (part) {
			ctx.fillStyle = part.color;
			ctx.beginPath();
			ctx.arc(part.x, part.y, part.r, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();
		});

		evolveParticles();
	};

	function evolveParticles() {
		_.each(particles, function (part, i) {
			var v0x = part.v0 * Math.sin(part.angle);
			var v0y = part.v0 * Math.cos(part.angle);

			part.time += time_interval;

			part.x = part.x0 + v0x * part.time; 
			part.y = part.y0 - v0y * part.time + acceleration * Math.pow(part.time, 2);

			if (part.time > randomInt(300, 1000)) {
				particles[i] = new Particle(sparkler.x, sparkler.y, color, Math.random()*1.2);
			}
		});
	};
};