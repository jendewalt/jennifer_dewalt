function polychrome() {
	var player;
	var timeout;

	if ($('#show_data_show').length > 0) {
		var show_data = $('#show_data_show').data('show');
		var header = $('header');

		header.hide();

		$('body').on('mousemove', function () {
			clearTimeout(timeout);
			header.show();

			timeout = setTimeout(function () {
				header.fadeOut(500);
			}, 3800);
		});

		playShow(0, show_data, 'body');
	}

	if ($('#swatch_container').length > 0) {	
		var swatches = [];

		function Swatch() {
			this.color = randomColorHex();
			this.duration = 60;

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

				swatch_info.append('<label>Duration: </label>');

				var duration_input = $('<input>', {
					class: 'duration',
					value: swatch.duration
				}).on('change', function () {
					var input = Number($(this).val()) ? $(this).val() : 60;
					swatch.duration = input;
				}).appendTo(swatch_info);

				$(div).append(close)
					  .append(swatch_color)
					  .append(swatch_info)
					  .appendTo('#swatch_container');
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

		$('#preview').on('click', function (e) {
			e.preventDefault();
			var show_data = formatShowData(swatches);
			$('#preview_container').show();
			playShow(0, show_data, '#preview_container');
		});

		$('#back').on('click', function () {
			clearTimeout(player);
			$('#preview_container').hide();
		});

		$('#save').on('click', function (e) {
			e.preventDefault();
			saveShow(swatches);
		});
	}

	function playShow(i, data, element) {
		$(element).css('background-color', data[i].color);

		player = setTimeout(function () {
			i = i + 1 < data.length ? i += 1 : 0;
			playShow(i, data, element);
		}, data[i].duration * 1000);
	}

	function formatShowData(swatches) {
		var show = _.map(swatches, function (swatch) {
			return {
				color: swatch.color,
				duration: swatch.duration
			};
		});

		return show;		
	}

	function saveShow(swatches) {
		var data = formatShowData(swatches);

		$.ajax({
			url: "/polychrome/shows",
			type: "POST",
			data: {show: data},
			dataType: 'json',
			success: function (data) {
				window.location = '/polychrome/shows/' + data;
			},
			error: function (xhr, status) {
				alert('There was a problem with your request. Please try again.');
			}
		});
	}
}