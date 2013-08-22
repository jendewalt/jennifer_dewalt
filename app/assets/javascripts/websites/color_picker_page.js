function colorPickerPage() {
	var main_canvas = $('canvas')[0];
	var main_ctx = main_canvas.getContext('2d');
	var hue_canvas = $('canvas')[1];
	var hue_ctx = hue_canvas.getContext('2d');
	var main_width = 300;
	var main_height = 300;

	var hue_width = 40;
	var hue_height = 300;
	var color_gradient = new Image();

	main_canvas.width = main_width;
	main_canvas.height = main_height;

	hue_canvas.width = hue_width;
	hue_canvas.height = hue_height;

	var colorPicker = {
		color: { r:255, g:0, b:0 },
			
		makePalette: function () {
			var hue_gradient = hue_ctx.createLinearGradient(0,0,0,hue_canvas.height);

			hue_gradient.addColorStop(0,    "rgb(255,   0,   0)");
			hue_gradient.addColorStop(0.02,    "rgb(255,   0,   0)");
			hue_gradient.addColorStop(0.15, "rgb(255,   0, 255)");
			hue_gradient.addColorStop(0.33, "rgb(0,     0, 255)");
			hue_gradient.addColorStop(0.49, "rgb(0,   255, 255)");
			hue_gradient.addColorStop(0.67, "rgb(0,   255,   0)");
			hue_gradient.addColorStop(0.84, "rgb(255, 255,   0)");
			hue_gradient.addColorStop(0.98,    "rgb(255,   0,   0)");
			hue_gradient.addColorStop(1,    "rgb(255,   0,   0)");

			hue_ctx.fillStyle = hue_gradient;
			hue_ctx.fillRect(0,0,hue_canvas.width,hue_canvas.height);

			color_gradient.onload = function () {
				main_ctx.fillStyle = 'rgb(255, 0, 0)';
				main_ctx.fillRect(0,0,main_canvas.width, main_canvas.height);
				main_ctx.drawImage(color_gradient, 0, 0, main_canvas.width, main_canvas.height);
			};

			$('#hue').on('mousedown', function (e) {
				$('#hue').on('mousemove', function (e) {
					var mouse_x = e.pageX - hue_canvas.offsetLeft;
					var mouse_y = e.pageY - hue_canvas.offsetTop;
					var color = colorPicker.color;
					var img_data = hue_ctx.getImageData(mouse_x, mouse_y, 1, 1);

					$(document).css('cursor', 'crosshair');

					colorPicker.color = { r: img_data.data[0], g: img_data.data[1], b: img_data.data[2] };
					colorPicker.drawMainCanvas('rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')');
				});

				$(document).on('mouseup', function () {
					$('canvas').off('mousemove');
				});
			});

			$('#main').on('mousedown', function (e) {
				$('#main').on('mousemove', function (e) {
					var mouse_x = e.pageX - main_canvas.offsetLeft;
					var mouse_y = e.pageY - main_canvas.offsetTop;
					var img_data = main_ctx.getImageData(mouse_x, mouse_y, 1, 1);

					$(document).css('cursor', 'crosshair');

					colorPicker.color = { r: img_data.data[0], g: img_data.data[1], b: img_data.data[2] };
					colorPicker.updateSwatch();
				});

				$(document).on('mouseup', function () {
					$('canvas').off('mousemove');
				});
			});
		},

		drawMainCanvas: function (hue) {
			var color = colorPicker.color;
			main_ctx.clearRect(0,0,main_ctx.width, main_ctx.height);
			main_ctx.fillStyle = hue;
			main_ctx.fillRect(0,0,main_canvas.width, main_canvas.height);
			main_ctx.drawImage(color_gradient, 0, 0, main_canvas.width, main_canvas.height);

			colorPicker.updateSwatch();
		},

		colorAsRGB: function () {
			var color = colorPicker.color;
			return color.r + ', ' + color.g + ', ' + color.b;
		},

		colorAsHex: function () {
			var color = colorPicker.color;
			var r = rgbComponentToHex(color.r);
			var g = rgbComponentToHex(color.g);
			var b = rgbComponentToHex(color.b);

			return r + g + b;
		},

		updateSwatch: function () {
			$('#swatch').css('background-color', '#' + colorPicker.colorAsHex());
			$('#rgb').val(colorPicker.colorAsRGB);
			$('#hex').val(colorPicker.colorAsHex);
		}
	}

	$('input').on('change', function () {
		var input = $(this).val().replace(' ', '');
		if (this.id == 'hex') {
			input = hexToRgb(input.replace('#', ''));

			if (input) {
				var hue = 180 / Math.PI * Math.atan2((Math.sqrt(3)*(input.g - input.b)), 2 * input.r - input.g - input.b) + 360;

				colorPicker.color = input;
				colorPicker.updateSwatch();
				colorPicker.drawMainCanvas('hsl(' + hue + ', 100%, 50%)');
			}
		} else if (this.id == 'rgb') {
			var rgb_color = [];
			input = input.replace(' ', '').split(',');

			_.each(input, function (val) {
				var num = parseInt(val);
				if (num <= 255 && num >= 0) {
					rgb_color.push(num)
				}
			});

			if (rgb_color.length == 3) {
				var hue = 180 / Math.PI * Math.atan2((Math.sqrt(3)*(input[1] - input[2])), 2 * input[0] - input[1] - input[2]) + 360;

				colorPicker.color.r = rgb_color[0];
				colorPicker.color.g = rgb_color[1];
				colorPicker.color.b = rgb_color[2];
				colorPicker.updateSwatch();
				colorPicker.drawMainCanvas('hsl(' + hue + ', 100%, 50%)');
			}
		}
	});

	colorPicker.makePalette();

	$('button').on('click', function () {
		pushSwatchToPalette(colorPicker.color);
	});

	$('canvas').disableSelection();

	function pushSwatchToPalette(color) {
		var div = $('<div />', {
				class: 'swatch_container'
			});

		var swatch = $('<div />', {
			class: "swatch",
			style: 'background-color: rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')'
		});

		var close = $('<div />', {
			class: "close",
			text: 'X'
		}).on('click', function () {
			$(this).parent().remove();
		});

		$(div).append(close)
			  .append(swatch)
			  .append('<div class="swatch_info"><div class="label">RGB: ' +  color.r + ', ' + color.g + ', ' + color.b + '</div><div class="label">HEX: #' + rgbComponentToHex(color.r) + rgbComponentToHex(color.g) + rgbComponentToHex(color.b) + '</div>')
			  .prependTo('#palette_container');
	};

	color_gradient.src = '/assets/color_picker_gradient.png';

}