function dryingPaint() {
	setTimeout(function() {
		$('#paint').removeClass('drying').addClass('dry');
		$('#cracks').show();
	}, 7200000);
}