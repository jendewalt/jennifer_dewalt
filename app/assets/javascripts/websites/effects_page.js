function effects() {
	var images = ['bam.png', 'boom.png', 'crunch.png', 'kaboom.png', 'klang.png',
				  'krack.png', 'oomph.png', 'ow.png', 'phoomph.png', 'ping.png',
				  'pow.png', 'skreech.png', 'splat.png', 'thwack.png', 'wham.png',
				  'zazam.png', 'zoom.png'];

	images = _.map(images, function (image_name) {
		var image_path = '/assets/' + image_name;
		var image = $('<img/>');
		image[0].src = image_path;
		return image;
	});

	$('body').on('click', function (e) {
		var x = e.pageX;
		var y = e.pageY;

		var image = images[randomInt(0, 16)];
		xxx = image;
		image.css({
        	top: y - image[0].height / 2,
        	left: x - image[0].width / 2,
        	position: 'absolute'
        }).clone().appendTo('#image_container');
	});

	$('body').disableSelection();	
};