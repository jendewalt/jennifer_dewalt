function infiniteDescent() {
	var canvas = $('canvas')[0],
		ctx = canvas.getContext('2d'),
		height = window.innerHeight,
		width = window.innerWidth,
		center_x = width / 2,
		center_y = height / 2,
		max_dimension = width > height ? width : height;

	var audio = new Howl({
		urls: ['/assets/infinite_descent.mp3', '/assets/infinite_descent.ogg'],
		loop: true,
		autoplay: true,
		volume: 0.85,
	});

	canvas.height = height;
	canvas.width = width;

	function drawSpiral() {
		var angle = Math.PI;
		var radius = 0;

		ctx.clearRect(-max_dimension / 2, -max_dimension / 2, max_dimension * 2, max_dimension * 2);
		
		ctx.beginPath();
	    ctx.translate(center_x, center_y);
	    ctx.rotate(0.1);

		while (radius < max_dimension) {
			angle += 0.1;
			radius = 0.07 * Math.pow(angle, 2);

			x = 0 + radius * Math.cos(angle);
			y = 0 + radius * Math.sin(angle);

			ctx.lineTo(x, y);
		}

		ctx.strokeStyle = "#f0f0f0";
		ctx.lineWidth = 5;
		ctx.stroke();
		ctx.closePath();
	    ctx.translate(-center_x, -center_y);
		
		setTimeout(drawSpiral, 40);
	};

	drawSpiral();
}