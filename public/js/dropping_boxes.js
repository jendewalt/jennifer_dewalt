$(document).ready(function () {

	$('.box').on('click', function () {
		var animations = [ 'crawl', 'dangle', 'jump', 'stretch', 'flip' ];
		var box = this;
		var animation = animations[Math.floor(Math.random() * 5)];

		$(box).addClass(animation);

		setTimeout(function () {
			$(box).removeClass(animation);
		}, 4000);
	});
});