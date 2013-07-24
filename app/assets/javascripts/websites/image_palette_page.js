function imagePalette() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var img = document.createElement('img');
	var w = 300;
	var h = 200;

	canvas.width = w;
	canvas.height = h;

	var has_text = true;
	var clearCanvas = function () {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		has_text = false;
	};

	ctx.font = '16px Geneva';
	ctx.textAlign = 'center';
	ctx.fillStyle = '#999';

	ctx.fillText("Drag an image from your", w/2, h/2 - 60);
	ctx.fillText("computer into this box.", w/2, h/2 - 35);
	ctx.fillText("Click on the image to add", w/2, h/2 + 35);
	ctx.fillText("the color to the color palette.", w/2, h/2 + 60);

	// Img loading
	img.addEventListener('load', function () {
		clearCanvas();
		canvas.width = img.width
		canvas.height = img.height
		ctx.drawImage(img, 0, 0);
	}, false);

	// To enable drag and drop
	canvas.addEventListener('dragover', function (e) {
		e.preventDefault();
	}, false);

	// handle dropped img file
	canvas.addEventListener('drop', function (e) {
		var files = e.dataTransfer.files;

		if (files.length > 0) {
			var file = files[0];
			if(typeof FileReader !== 'undefined' && file.type.indexOf('image') != -1) {
				var reader = new FileReader();
				reader.onload = function (e) {
					img.src = e.target.result;
				}
				reader.readAsDataURL(file);
			}
		}
		e.preventDefault();
	}, false);

	$('canvas').on('click', function (e) {
		if (!has_text) {
			var canvas_x = (e.pageX - canvas.offsetLeft);
			var canvas_y = (e.pageY - canvas.offsetTop);
			var imageData = ctx.getImageData(canvas_x, canvas_y, 1, 1);
			var colors = imageData.data;

			$('button').show();

			pushSwatchToPalette(colors);
		}
	});

	$('button').on('click', function () {
		$('button').hide();
		$('#palette').html('');
	});

	function pushSwatchToPalette(color) {
		var div = $('<div />', {
				class: 'swatch_container'
			});

		var swatch = $('<div />', {
			class: "swatch",
			style: 'background-color: rgb(' + color[0] + ', ' + color[1] + ', ' + color[2] + ')'
		});

		$(div).append(swatch)
			  .append('<div class="swatch_info"><div class="label">RGB: ' +  color[0] + ', ' + color[1] + ', ' + color[2] + '</div><div class="label">HEX: #' + rgbComponentToHex(color[0]) + rgbComponentToHex(color[1]) + rgbComponentToHex(color[2]) + '</div>')
			  .prependTo('#palette');
	};

	function rgbComponentToHex(c) {
    	var hex = c.toString(16);
    	return hex.length == 1 ? "0" + hex : hex;
    };
};