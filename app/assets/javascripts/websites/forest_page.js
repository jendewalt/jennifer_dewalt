function forest() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var width = window.innerWidth;
	var height = window.innerHeight;
	var current_color = '#592718';
	var brush = 'tree';

	canvas.width = width;
	canvas.height = height;

	function makeLeaf(x, y) {
		ctx.fillStyle = current_color;
		ctx.strokeStyle = 'rgba(255,255,255,0.1)';
		ctx.save();
		ctx.beginPath();
		ctx.translate(x, y);
	    ctx.rotate(randomInt(0, 360) * (Math.PI / 180));
	    ctx.translate(-x, -y);
	    
		ctx.moveTo(x, y);
		ctx.quadraticCurveTo(x + 7, y - 7, x + 14, y);
		ctx.moveTo(x, y);
		ctx.quadraticCurveTo(x + 7, y + 7, x + 14, y);
		ctx.lineJoin = 'round'
		ctx.fill();
		ctx.stroke();
		ctx.restore();
	}

	function makeBranch(x0, y0, angle, length, size) {
		if (size > 0) {
			var xf = x0 + length * Math.cos(angle);
			var yf = y0 + length * Math.sin(angle);
			var num_sub_branch = randomInt(2,5);
			var new_length = length * 0.5 + randomInt(-5, 10);

			ctx.lineWidth = size * 0.6;
			ctx.strokeStyle = current_color;
			ctx.beginPath();
			ctx.moveTo(x0, y0);
			ctx.lineTo(xf, yf);
			ctx.lineJoin = 'miter';
			ctx.stroke();

			_.each(_.range(num_sub_branch), function (num) {
				var new_angle = angle + Math.random() * 3 * Math.PI / 4 - 3 * Math.PI / 4 / 2;
				var new_size = size - 1;

				setTimeout(function () {
					makeBranch(xf, yf, new_angle, new_length, new_size);
				}, 70); 
			});
		}
	}

	ctx.fillStyle = '#fff';
	ctx.fillRect(0,0,width,height);

	$('#save').on('click', function () {
		var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
		window.location.href = image;
	});

	$('canvas').on('click', function (e) {
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;

		if (brush == 'tree') {
			makeBranch(x, y, -Math.PI / 2, randomInt(50, 80), 5);
		} else {
			makeLeaf(x, y);
		}	
	});

	$('canvas').on('mousedown', function () {
		if (brush == 'leaf') {
			$('canvas').on('mousemove', function (e) {
				var x = e.pageX - canvas.offsetLeft;
				var y = e.pageY - canvas.offsetTop;

				makeLeaf(x, y);
			});

			$('canvas').on('mouseup', function () {
				$('canvas').off('mousemove');
			});
		}
	});

	$('.color').on('change', function () {
		current_color = '#' + this.color;
	});

	$('#tree_btn').on('click', function () {
		brush = 'tree';
	});

	$('#leaf_btn').on('click', function () {
		brush = 'leaf';
	});
}