function viewGraph() {
	var number_of_views = $('#views_container > div').size(),
		incrementer = 1 / (number_of_views * 1.3),
		opacity = 1,
		cur_div = number_of_views;

	_.each(_.range(number_of_views), function (n) {
		assignBackground(cur_div - n);
		opacity -= incrementer;
	});

	$('#info_tab').on('click', function () {
		$('.modal.info').fadeIn('400');
	});

	$('.close').on('click', function () {
		$('.modal.info').fadeOut('300');
	});

	function assignBackground(n) {
		$('.view_mark:nth-child(' + n + ')').css('opacity', opacity);
	};
};