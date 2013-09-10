function windowPage() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var height = 600;
	var width = 500;
	var outside = new Image();
	var g = ctx.createLinearGradient(0, canvas.height * 2.3, canvas.width * 1.5, 0 );
			g.addColorStop(0, 'rgba(209, 221, 229, 0.399)');
			g.addColorStop(0.135, 'rgba(255, 255, 255, 0.556)');
			g.addColorStop(0.19, 'rgba(224, 228, 251, 0.506)');
			g.addColorStop(0.355, 'rgba(255, 255, 255, 0.467)');
			g.addColorStop(0.5, 'rgba(255, 255, 255, 0.467)');
			g.addColorStop(0.76, 'rgba(179, 196, 239, 0.371)');
			g.addColorStop(0.925, 'rgba(255, 255, 255, 0.449)');
			g.addColorStop(0.99, 'rgba(210, 228, 249, 0.445)');
			
	canvas.height = height;
	canvas.width = width;

	var mouse = {
		y: canvas.height
	}
	var sound = new Howl({
		urls: ['/assets/nature.mp3', '/assets/nature.ogg'],
		volume: 0.0,
		loop: true
	});
	var images = $('#images').data('img');

	var windowPane = {
		width: canvas.width,
		height: canvas.height / 2,
		position: canvas.height,
		open: 0,
		draw: function () {
			//Draw top pane
			ctx.beginPath();
			ctx.fillStyle = g;
			ctx.fillRect(0, 0, this.width, this.height);

			ctx.strokeStyle = '#fafafa';
			ctx.lineWidth = 10;
			ctx.moveTo(0, this.height);
			ctx.lineTo(this.width, this.height);
			ctx.stroke();
			ctx.closePath();

			// Draw bottom/movible pane
			ctx.beginPath();
			ctx.fillStyle = g;
			ctx.fillRect(0, this.position, this.width, -1 *this.height);

			ctx.strokeStyle = '#fafafa';
			ctx.lineWidth = 10;
			ctx.moveTo(0, this.position);
			ctx.lineTo(this.width, this.position);
			ctx.moveTo(0, this.position - this.height);
			ctx.lineTo(this.width, this.position - this.height);
			ctx.stroke();
			ctx.closePath();
		}
	};

	outside.onload = function () {
		drawWindow();
	};

	outside.draw = function () {
		var offset_x = (canvas.width - outside.width) / 2;
		var offset_y = (canvas.height - outside.height) / 2;

		ctx.drawImage(outside, offset_x, offset_y);		
	};

	$('canvas').on('mousemove', function (e) {
		mouse.y = e.pageY - canvas.offsetTop;

		if (mouse.y < 600 && mouse.y > canvas.height / 2) {
			windowPane.position = mouse.y;
			sound.volume(1 - ((mouse.y - canvas.height / 2) / (canvas.height / 2)));
		}

		drawWindow();
	});

	$('button').on('click', function () {
		outside.src = images[randomInt(0, images.length - 1)];
		drawWindow();
	})

	function drawWindow() {
		outside.draw();
		windowPane.draw();
	}

	sound.play().volume(0.0);

	outside.src = images[randomInt(0, images.length - 1)];
}