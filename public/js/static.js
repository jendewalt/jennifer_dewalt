$(document).ready(function () {
	var canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d'),
		h = 600,
		w = 800,
		color = 'mono',
		id = ctx.createImageData(w,h),
		data = id.data;

	canvas.height = h;
	canvas.width = w;

	data[0] = 0;
	data[1] = 0;
	data[2] = 0;
	data[3] = Math.random();

	function makeSpot(id, x, y, r, g, b, a) {
		var index = (x + y * id.width) * 4;
		id.data[index+0] = r;
		id.data[index+1] = g;
		id.data[index+2] = b;
		id.data[index+3] = a;
	};

	function init() {
		var posX = 0,
			posY = 0;

		for (var i = 0; i < 480000; i++) {
			var r, g, b, a;

			if (color == 'color') {
				r = Math.random() * 256 | 0;
				g = Math.random() * 256 | 0;
				b = Math.random() * 256 | 0;			
			} else if (color == 'mono') {
				var shade = Math.random() * 256 | 0;
				r = shade;
				g = shade;
				b = shade;	
			}
			
			makeSpot(id, posX, posY, r, g, b, 255);

			posX++;

			if (posX % w == 0) {
				posX = 0;
				posY++;
			}
		}
		ctx.putImageData(id, 0, 0);

		setTimeout(init, 80);		
	};

	init();

	$('#mono').on('click', function (e) {
		color = 'mono';
	});

	$('#color').on('click', function (e) {
		color = 'color';
	});

});

