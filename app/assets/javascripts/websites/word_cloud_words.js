function wordCloud() {
	$('#text_field').focus();

	$('form').on('submit', function (e) {
		var input = $('#text_field').val();

		if (input.length > 255) {
			e.preventDefault();
			showWarning('Your text is too long.');
		} else if (input.length < 1) {
			e.preventDefault();
			showWarning('Your text is too short.')
		}
	});

	$('#info_tab').on('click', function () {
		$('.modal').fadeIn(400);
	});

	$('.close').on('click', function () {
		$('.modal').fadeOut(400);
	});

	function showWarning(text) {
		$('.input_warning').css('opacity', 0).text(text).animate({
			opacity: 1
		}, 300);
		
		$('#text_field').focus();
	}
}