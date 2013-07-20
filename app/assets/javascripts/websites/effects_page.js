function effects() {
	var images = ['bam.png', 'boom.png', 'crunch.png', 'kaboom.png', 'klang.png',
				  'krack.png', 'oomph.png', 'ow.png', 'phoomph.png', 'ping.png',
				  'pow.png', 'skreech.png', 'splat.png', 'thwack.png', 'wham.png',
				  'zazam.png', 'zoom.png'];

	images = _.map(images, function (image_name) {
		var image_path = '/assets/' + image_name;
		$('<img/>')[0].src = image_path;
		return image_path;
	});

	$('body').on('click', function (e) {
		var x = e.pageX;
		var y = e.pageY;

		var image_path = images[randomInt(0, 16)];
		$('<img src=' + image_path +'>').load(function () {
			$(this).css({
    			top: y - this.height / 2,
    			left: x - this.width / 2,
    			position: 'absolute'
        	}).appendTo('#image_container');
		});
	});

	$('body').disableSelection();	
};