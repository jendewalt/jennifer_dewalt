function chromatones() {
	if ($('#recent_palettes').length > 0) {
		palettes = $('.palette_container');

		_.each(palettes, function (palette, i) {
			var colors = $(palette).data('colors');
			for (var i = 0; i < 10; i++) {
				color = colors[i]
				if (color) {
					staticSwatch(color.color, palette);
				}
			};

			if (colors.length > 10) {
				$(palette).append('<div class="more">and ' + (colors.length - 10) + ' more colors.</div>')
			}

		});
	}

	if ($('#swatch_container_show').length > 0) { 
		var colors = $('#palette_data').data('palette');

		_.each(colors, function (color) {
			staticSwatch(color.color, '#swatch_container_show');
		});
	}

	if ($('#swatch_container_new').length > 0) {	
		var swatches = [];

		function Swatch() {
			this.color = randomColorHex();

			this.buildSwatch = function () {
				var swatch = this;

				var div = $('<div>', {
					class: 'swatch',
				});

				var swatch_color = $('<div>', {
					class: 'swatch_color',
					style: 'background-color:' + swatch.color
				});

				var close = $('<div />', {
					class: "close",
					text: 'X'
				}).on('click', function () {
					swatches = _.reject(swatches, function (s) {
						return s == swatch;
					});

					$(this).parent().remove();
				});

				var swatch_info = $('<div>', {
					class: 'swatch_info',
				}).append('<label>Color: </label>');

				var color_input = $('<input>', {
					class: 'color',
					value: swatch.color
				}).on('change', function () {
					swatch.color = '#' + $(this).val();
					$(swatch_color).css('background-color', swatch.color);
				}).appendTo(swatch_info);

				new jscolor.color(color_input.get(0));

				$(div).append(close)
					  .append(swatch_color)
					  .append(swatch_info)
					  .appendTo('#swatch_container_new');
			}

			this.buildSwatch();
		}
		
		for (var i = 0; i < 5; i++) {
			swatches.push(new Swatch());
		}

		$('#add').on('click', function (e) {
			e.preventDefault();
			swatches.push(new Swatch());
		});

		$('#save').on('click', function (e) {
			e.preventDefault();
			savePalette(swatches);
		});
	}

	function staticSwatch( color, elm ) {
		this.color = color;

		this.buildSwatch = function () {
			var swatch = this;

			var div = $('<div>', {
				class: 'swatch',
			});

			var swatch_color = $('<div>', {
				class: 'swatch_color',
				style: 'background-color:' + swatch.color
			});

			var swatch_info = $('<div>', {
				class: 'swatch_info',
			}).append('<label>Color: ' + swatch.color + '</label>');

			$(div).append(swatch_color)
				  .append(swatch_info)
				  .appendTo(elm);
		}

		this.buildSwatch();
	}

	function formatPaletteData(swatches) {
		var title = $.trim($('#title').val());
		var name = $.trim($('#name').val());
		var palette = _.map(swatches, function (swatch) {
			return {
				color: swatch.color,
			};
		});

		palette.push({title: title});
		palette.push({name: name});
		return palette;		
	}

	function savePalette(swatches) {
		var data = formatPaletteData(swatches);

		$('#throbber').show();

		$.ajax({
			url: "/chromatones/palettes",
			type: "POST",
			data: {colors: data},
			dataType: 'json',
			success: function (data) {
				window.location = '/chromatones/palettes/';
			},
			error: function (xhr, status) {
				$('#throbber').hide();
				alert('There was a problem with your request. Please try again.');
			}
		});
	}
}