function hollywoodSign() {
	// [Bug fix: 03.03.16]
	var blink;
	$('#l0').on('click', function () {
		var delay = 0,
			time_step = 150;
			// blink;

		_.each(_.range(9), function (id, i) {
			setTimeout(function () {
				$('#l' + id).addClass('wave');
			}, i * time_step);

			setTimeout(function() {
				$('#l' + id).removeClass('wave');
			}, i * time_step + 700);
		});
	});

	$('#l4').on('click', function () {
		makeBlink();
		$(this).off();
	});

	$('#l5').on('click', function () {
		// [Bug fix: 03.03.16]
		if (blink) clearInterval(blink);
		$('.letter').css('color', '#ebe0d1');

		$('#l4').on('click', function () {
			makeBlink();
			$(this).off();
		});
	});

	$('#l8').on('click', function () {
		$(this).addClass('dangle');
		setTimeout(function () {
			$('#l8').removeClass('dangle');
		}, 4000);
	});

	$('body').disableSelection();

	function makeBlink() {
		blink = setInterval(function () {
			$('.letter').css('color', randomColorHex());
		}, 500);
	}
};
