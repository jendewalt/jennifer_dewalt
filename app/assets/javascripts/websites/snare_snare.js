function snare() {
	$('.circle').on('click', function () {
		$('#container').addClass('shrink');

		setTimeout(function () {
			$('#container').html('');
			$('#container').css({
				backgroundImage: 'none',
				height: 0
			});
			setTimeout(function () {
				$('#error').show();
			}, 500);
		}, 1800);
	});
}