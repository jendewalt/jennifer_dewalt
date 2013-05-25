(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);

$(document).ready(function () {
	var canvas = $('canvas')[0];
		ctx = canvas.getContext('2d'),
		h = window.innerHeight - 25,
		w = window.innerWidth
		plane = new Image();

	canvas.height = h;
	canvas.width = w;

	plane.onload = function () {
		ctx.drawImage(plane, 50, 50);
	};

	plane.src = 'plane.png';
	
	$('body').disableSelection();
	
});