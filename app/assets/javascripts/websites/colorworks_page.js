function colorWorks() {
	$('#color_input').on('keyup', function () {
		checkInput();
	});

	$('#color_input').on('change', function () {
		checkInput();
	});

	$('form').on('submit', function (e) {
		e.preventDefault();

		var hex_color = $('#color').val();

		if (/^([0-9a-fA-F]{6})?$/.test(hex_color) && hex_color != '') {
			var adjustment = $('input:radio:checked').val();
			var percent = $('#percent').val().replace('%', '') * 0.01;
			var rgb = hexToRGB(hex_color);
			var hsl = rgbToHSL(rgb.r, rgb.g, rgb.b);
			var new_colors;

			if (adjustment == 'darken' || adjustment == 'desaturate') {
				percent *= -1;
			}

			if (adjustment == 'darken' || adjustment == 'lighten') {
				new_colors = lightAdjustedColors(hsl, percent);
			} else if (adjustment == 'saturate' || adjustment == 'desaturate') {
				new_colors = satAdjustedColors(hsl, percent);
			}

			makeSwatches(new_colors);
		} else {
			alert('Please enter a 6 digit hex number.');
		}
	});

	$('#reset').on('click', function () {
		$('#swatch_section').html('');
		$('#submit').attr('disabled', 'disabled');
	});

	function checkInput() {
		var color = $('#color').val();
		
		if (/^([0-9a-fA-F]{6})?$/.test(color) && color != '') {
			$('#submit').removeAttr('disabled');
		} else {
			$('#submit').attr('disabled', 'disabled');
		}
	};

	function hexToRGB(hex) {
		var parsed_hex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return { r: parseInt(parsed_hex[1], 16),
				 g: parseInt(parsed_hex[2], 16),
				 b: parseInt(parsed_hex[3], 16) }
	}

	function rgbToHSL(r, g, b) {
		r /= 255;
		g /= 255;
		b /= 255;

		var max = Math.max(r, g, b);
		var min = Math.min(r, g, b);
		var h, s, l = (max + min) / 2;

		if (max == min) {
			h = s = 0
		} else {
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h /= 6;
		}
		return [h, s, l];  // returns values between 0 and 1;
	};

	function lightAdjustedColors(hsl, percent) {
		var h = hsl[0];
		var s = hsl[1];
		var l = hsl[2];
		var label = 'Lightened';
		var new_colors = [];

		if (percent < 0) {
			label = 'Darkened'
		}

		_.each(_.range(5), function (num) {
			var new_l = (l + percent * num);
			new_l = new_l < 1.0 ? new_l : 1.0;
			new_l = new_l > 0.0 ? new_l : 0.0;

			new_colors.push({h: h, s: s, l: new_l, label: label, percent: (percent * num * 100).toFixed(2)});
		});
		return new_colors;
	};

	function satAdjustedColors(hsl, percent) {
		var h = hsl[0];
		var s = hsl[1];
		var l = hsl[2];
		var label = 'Saturated';
		var new_colors = [];

		if (percent < 0) {
			label = 'Desaturated'
		}

		_.each(_.range(5), function (num) {
			var new_s = (s + percent * num);
			new_s = new_s < 1.0 ? new_s : 1.0;
			new_s = new_s > 0.0 ? new_s : 0.0;

			new_colors.push({h: h, s: new_s, l: l, label: label, percent: (percent * num * 100).toFixed(2)});
		});
		return new_colors;
	};

	function hslToHex(h, s, l){
	    var r, g, b;

	    if(s == 0){
	        r = g = b = l; // achromatic
	    }else{
	        function hue2rgb(p, q, t){
	            if(t < 0) t += 1;
	            if(t > 1) t -= 1;
	            if(t < 1/6) return p + (q - p) * 6 * t;
	            if(t < 1/2) return q;
	            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
	            return p;
	        }

	        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	        var p = 2 * l - q;
	        r = hue2rgb(p, q, h + 1/3);
	        g = hue2rgb(p, q, h);
	        b = hue2rgb(p, q, h - 1/3);
	    }

	    return Math.round(r * 255 + 0x10000).toString(16).substr(-2) + Math.round(g * 255 + 0x10000).toString(16).substr(-2) + Math.round(b * 255 + 0x10000).toString(16).substr(-2);	    
	}

	function makeSwatches(colors) {
		var row = $('<div />', {
			class: 'swatch_row'
		}).prependTo('#swatch_section');

		_.each(colors, function (color) {
			var color_as_hex = hslToHex(color.h, color.s, color.l);
			var div = $('<div />', {
				class: 'swatch_container'
			});

			var swatch = $('<div />',{
				class: "swatch",
				'data-color': color_as_hex,
				style: 'background-color: #' + color_as_hex
			}).on('click', function () {
				$('#color').val($(this).data('color'));
				$('#color').focus();
			});

			$(div).append(swatch)
				  .append('<div class="swatch_info"><div class="label">HEX: ' + color_as_hex + '</div><div class="label">'+ color.label + ': ' + Math.abs(color.percent) + '%</div></div>')
				  .appendTo(row);
		});
	}

};







