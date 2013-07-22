function checkSketch() {
	var height = window.innerHeight;
	var width = window.innerWidth;
	var num_boxes = ((height * width ) / (18 * 18));
	var turbo = false;

	$('#sketch_pad').css({
		height: height,
		width: width
	});
	
	_.each(_.range(1, num_boxes), function (num) {
		$('<input>', {
			type: 'checkbox'
		}).on('mouseover', function () {
			if (turbo) {
				this.setAttribute('checked', 'checked');
			}
		}).appendTo('#sketch_pad');
	});

	$('#turbo').on('click', function () {
		if (!turbo) {
			$(this).text('Turbo Mode On').removeClass('turbo_off');
		} else {
			$(this).text('Turbo Mode Off').addClass('turbo_off');			
		}
		turbo = !turbo;
	});

	$('#reset').on('click', function () {
		window.location = "/check_sketch/page";
	});
};
