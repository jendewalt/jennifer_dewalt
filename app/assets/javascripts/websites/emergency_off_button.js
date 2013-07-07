function emergencyOff() {
	var length = 10;

	$('button').on('click', function () {
		$('.modal').fadeIn(800);
		setTimeout(startProgressBar, 800);
	});

	function startProgressBar() {
		$('.inner_modal.progress_bar').fadeIn(300);
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
		$('.inner_modal.progress_bar').hide();
		$('.inner_modal.shut_down').show();
		$('#content').addClass('flicker');

		setTimeout(function () {
			$('#content').html('');
			$('body').css('background-color', 'black');
			$('.shut_down').addClass('flicker');
			
			setTimeout(function () {
				$('body').html('');
			}, 1000);

		}, 400);
	}
}