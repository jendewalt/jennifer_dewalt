function signature() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var height = 400;
	var width = 700;
	var cur_color = '#000';
	var cur_size = 5;
	var hiddenCanvas = document.createElement('canvas');
    var hidden_ctx = hiddenCanvas.getContext('2d');
	var points = [];

	canvas.height = height;
	canvas.width = width;

    hiddenCanvas.height = height;
    hiddenCanvas.width = width;

	$(canvas).on('mousedown', function (e) {
		points.push({
			x: e.pageX - canvas.offsetLeft,
			y: e.pageY - canvas.offsetTop
		});
		this.drawing = true;
	});

	$(canvas).on('mousemove', function (e) {
		mouse_x = e.pageX - canvas.offsetLeft;
		mouse_y = e.pageY - canvas.offsetTop;

		if (this.drawing) {
			ctx.clearRect(0,0,width,height);
			ctx.drawImage(hiddenCanvas, 0, 0);
			points.push({
				x: mouse_x,
				y: mouse_y
			});

			drawPoints();
		}
	});

	$(canvas).on('mouseup', function () {
		this.drawing = false;
		$('canvas').css('cursor', 'default');
		points = [];
		hidden_ctx.clearRect(0,0,width,height);
		hidden_ctx.drawImage(canvas, 0, 0);
	});

	$('#clear').on('click', function () {
		ctx.clearRect(0,0,width,height);
		hidden_ctx.clearRect(0,0,width,height);
		canvas.drawing = false;
		points = [];
	});

	$('#save').on('click', function () {
		var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
		window.location.href = image;
	});

	$('.color').on('change', function () {
		cur_color = '#' + this.color;
	});

	$('.size').on('change', function () {
		var size = $('.size').val();

		if (!($.isNumeric(size))){
			alert('Size must be a number')
		} else {
			cur_size = size;
		}
	});

	$('body').disableSelection();

	function drawPoints() {
		ctx.beginPath();
		ctx.moveTo(points[0].x, points[0].y);
		for (i = 1; i < points.length - 2; i++) {
			var new_x = (points[i].x + points[i + 1].x) / 2;
			var new_y = (points[i].y + points[i + 1].y) / 2;
			ctx.quadraticCurveTo(points[i].x, points[i].y, new_x, new_y);
			ctx.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
		}
		ctx.strokeStyle = cur_color;
		ctx.lineWidth = cur_size;
    	// ctx.lineJoin = 'round';  Doesn't work right in FF or Safari?
    	ctx.lineCap = 'round';
		ctx.stroke();
	}
}