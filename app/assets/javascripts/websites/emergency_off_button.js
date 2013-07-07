function emergencyOff() {
	var length = 10;

	$('button').on('click', function () {
		setTimeout(function () {
			$('.modal').fadeIn(200);
			startProgressBar();
		});
	});

	function startProgressBar() {
		setTimeout(function () {
			$('.inner_bar').css('width', length);

			incrementBar();
		}, 100);
	};

	function incrementBar() {
		length++;

		if (length > 395) {
			length = 10;

			shutDown();
		} else {
			$('.inner_bar').css('width', length);
			setTimeout(incrementBar, 20);
		}
	};

	function shutDown() {
		;
	}
}