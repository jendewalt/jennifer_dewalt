function colorPickerPage() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var width = 450;
	var height = 300;

	canvas.width = width;
	canvas.height = height;

	var colorPicker = {
		color: { r:0, g:0, b:0 },
			
		makePalette: function () {
			var gradient = ctx.createLinearGradient(0,0,canvas.width,0);

			gradient.addColorStop(0,    "rgb(255,   0,   0)");
			gradient.addColorStop(0.02,    "rgb(255,   0,   0)");
			gradient.addColorStop(0.15, "rgb(255,   0, 255)");
			gradient.addColorStop(0.33, "rgb(0,     0, 255)");
			gradient.addColorStop(0.49, "rgb(0,   255, 255)");
			gradient.addColorStop(0.67, "rgb(0,   255,   0)");
			gradient.addColorStop(0.84, "rgb(255, 255,   0)");
			gradient.addColorStop(0.98,    "rgb(255,   0,   0)");
			gradient.addColorStop(1,    "rgb(255,   0,   0)");

			ctx.fillStyle = gradient;
			ctx.fillRect(0,0,canvas.width,canvas.height);

			var overlay = ctx.createLinearGradient(0,0,0,canvas.height);

			overlay.addColorStop(0,   "rgba(255, 255, 255, 1)");
			overlay.addColorStop(0.02,   "rgba(255, 255, 255, 1)");
			overlay.addColorStop(0,   "rgba(255, 255, 255, 1)");
			overlay.addColorStop(0.5, "rgba(255, 255, 255, 0)");
			overlay.addColorStop(0.5, "rgba(0,     0,   0, 0)");
			overlay.addColorStop(0.98,   "rgba(0,     0,   0, 1)");
			overlay.addColorStop(1,   "rgba(0,     0,   0, 1)");

			ctx.fillStyle = overlay;
			ctx.fillRect(0,0,canvas.width,canvas.height);

			$('canvas').on('mousedown', function (e) {
				$('canvas').on('mousemove', function (e) {
					var mouse_x = e.pageX - canvas.offsetLeft;
					var mouse_y = e.pageY - canvas.offsetTop;
					var img_data = ctx.getImageData(mouse_x, mouse_y, 1, 1);

					$(document).css('cursor', 'crosshair');

					colorPicker.color = { r: img_data.data[0], g: img_data.data[1], b: img_data.data[2] };
					colorPicker.updateSwatch();
				});

				$(document).on('mouseup', function () {
					$('canvas').off('mousemove');
				})
			});
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
				colorPicker.color = input;
				colorPicker.updateSwatch();
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
				colorPicker.color.r = rgb_color[0];
				colorPicker.color.g = rgb_color[1];
				colorPicker.color.b = rgb_color[2];
				colorPicker.updateSwatch();
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
			  .append('<div class="swatch_info"><div class="label">RGB: ' +  color.r + ', ' + color.g + ', ' + color.g + '</div><div class="label">HEX: #' + rgbComponentToHex(color.r) + rgbComponentToHex(color.g) + rgbComponentToHex(color.b) + '</div>')
			  .prependTo('#palette_container');
	};

}