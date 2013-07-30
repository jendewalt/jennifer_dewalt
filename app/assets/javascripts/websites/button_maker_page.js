function buttonMaker() {
	var css_properties = ['border', 'cursor', 'padding', 'text-decoration', 'font-family', 'font-size', 'line-height', 'color', 'background-color', 'border-radius', 'border-top', 'border-bottom', 'border-left', 'border-right', 'text-shadow', 'box-shadow'];

	var showing = false;

	$('#arrow').on('click', function () {
		if (showing) {
			$('.css_code').animate({
				opacity: 0
			}, 500);
			$(this).text('\u25B2');
		} else {
			$(this).text('\u25BC');
			$('.css_code').animate({
				opacity: 1
			}, 500);
		}
		showing = !showing;
	});

	$('.button').on('click', function (e) {
		e.preventDefault();
	});

	$('#background').on('change', function () {
		$('.button').css('background-color', '#' + this.color);
	});

	$('#font-color').on('change', function () {
		$('.button').css('color', '#' + this.color);
	});

	$('#box-shadow').on('change', function () {
		$('.button').css('box-shadow', $(this).val());
	});

	$('#text-shadow').on('change', function () {
		$('.button').css('text-shadow', $(this).val());
	});

	$('#font-size').on('change', function () {
		$('.button').css('font-size', $(this).val());
	});

	$('#line-height').on('change', function () {
		$('.button').css('line-height', $(this).val());
	});

	$('#border-left').on('change', function () {
		$('.button').css('border-left', $(this).val());
	});

	$('#border-right').on('change', function () {
		$('.button').css('border-right', $(this).val());
	});

	$('#border-top').on('change', function () {
		$('.button').css('border-top', $(this).val());
	});

	$('#border-bottom').on('change', function () {
		$('.button').css('border-bottom', $(this).val());
	});

	$('#border-radius').on('change', function () {
		$('.button').css('border-radius', $(this).val());
	});

	$('#padding').on('change', function () {
		$('.button').css('padding', $(this).val());
	});

	$('#line-height').on('change', function () {
		$('.button').css('line-height', $(this).val());
	});
}