$(document).ready(function () {
	var w = window.innerWidth;

	_.each(magneticWords, function (word) {
		$('<div>', {
		class: 'magnet',
		style: 'position:absolute',
		text: word
		}).css({
			top: Math.random()*180, 
			left: Math.random()*w*0.75 + 140
		}).draggable().appendTo('#magnet_container');
	});

});