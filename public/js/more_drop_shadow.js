(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);


$(document).ready(function () {

	$('.box_shadow').on('click', function () {

		var current = $(event.target).css('box-shadow');

		var a = current.split('px');
		var blur = a[a.length-3];
		var spread = a[a.length-2];
		var newBlur = parseInt(blur) + 1; 
		var newSpread = parseInt(spread) + 3; 
		
		$(event.target).css('box-shadow', 'rgba(-1, 1, 0, 0.35) 0px 0px ' + newBlur + 'px ' + newSpread + 'px');

	});

	$('.text_shadow').on('click', function () {

		var current = $(event.target).css('text-shadow');

		var a = current.split('px');
		console.log(a);
		
		var blur = a[a.length-2];
		console.log(blur);

		var vert = a[a.length-3];
		console.log(vert);
		
		// var horiz = a[a.length-4];
		// console.log(horiz);

		var newBlur = parseInt(blur) + 1; 
		var newVert = parseInt(vert) + 1; 
		// var newHoriz = parseInt(spread) + 3; 
		
		console.log(event.target);
		console.log(current);
		
		$(event.target).css('text-shadow', 'rgb(-1, 1, 0) 1px ' + newVert + 'px ' + newBlur + 'px');

	});

	$('body').disableSelection();

});