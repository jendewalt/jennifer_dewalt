function hourglass() {
	var canvas = $('canvas')[0],
		ctx = canvas.getContext('2d'),
		height = 400,
		width = 201,
		mask = new Image(),
		time = 10000,
		interval = 50,
		top_sand = {
			y: -110
		},
		bottom_sand = {
			y: 0
		};

	canvas.height = height;
	canvas.width = width;

	function evolveSand() {
		var increment = 110 / (time/interval)
		top_sand.y += increment;
		bottom_sand.y -= increment;

		setTimeout(paintScreen, interval);
	};

	function drawCanvas() {
		ctx.fillStyle = '#1abc9c';
		ctx.strokeStyle = '#1abc9c';
		ctx.fillRect(0, 200, width, top_sand.y);
		ctx.fillRect(0, 397, width, bottom_sand.y);

		if (top_sand.y >= 0){
			top_sand.y = 0;
			$('.times_up').show();
		} else {
			drawStream();
			evolveSand();
		}	

		ctx.drawImage(mask, mask.horizontal, mask.vertical);
	};

	function drawStream() {
		ctx.beginPath();
		ctx.lineWidth = 5;
		ctx.moveTo(width / 2, 200);
		ctx.lineTo(width /2, height);
		ctx.closePath();
		ctx.stroke();

	};

	function paintScreen() {
		ctx.clearRect(0,0,width,height);
		drawCanvas();
	};

	$('form').on('submit', function (e) {
		e.preventDefault();

		var entry = Number($('.time').val());

		if (_.isNaN(entry)) {
			console.log(_.isNaN(entry))
			alert("Time limit must be a number.");
		} else {
			time = entry * 60000;
			$('.modal').hide();
			paintScreen();
		}

	});

	mask.horizontal = 0;
	mask.vertical = 0;

	mask.src = '/assets/hourglass.png';
};