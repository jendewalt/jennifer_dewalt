function effects() {
	var images = ['bam.png', 'boom.png', 'crunch.png', 'kaboom.png', 'klang.png',
				  'krack.png', 'oomph.png', 'ow.png', 'phoomph.png', 'ping.png',
				  'pow.png', 'skreech.png', 'splat.png', 'thwack.png', 'wham.png',
				  'zazam.png', 'zoom.png'];

	_.each(images, function (img) {
		var image = new Image();
		image.src = '/assets/' + img
	});

	$('body').on('click', function (e) {
		var x = e.pageX;
		var y = e.pageY;

		var action = $('<img class="action" src="/assets/' + images[randomInt(0, 16)] + '"/>')
			.hide()
            .load(function () {
            	$(this).css({
            		top: y - this.height / 2,
            		left: x - this.width / 2
            	});
            })
            .appendTo('#image_container')
            .show();
	});

	$('body').disableSelection();	
};