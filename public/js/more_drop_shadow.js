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

		var current = $(this).css('box-shadow');

		var a = current.split('px');
		var blur = a[a.length-3];
		var spread = a[a.length-2];
		var newBlur = parseInt(blur) + 1; 
		var newSpread = parseInt(spread) + 3; 
		
		$(this).css('box-shadow', 'rgba(-1, 1, 0, 0.35) 0px 0px ' + newBlur + 'px ' + newSpread + 'px');

	});

	$('.text_shadow').on('click', function (event) {

		var current = $(this).css('text-shadow');

		var a = current.split('px');
		var blur = a[a.length-2];
		var vert = a[a.length-3];

		var newBlur = parseInt(blur) + 1; 
		var newVert = parseInt(vert) + 1; 
			
		event.stopPropagation();
		$(this).css('text-shadow', 'rgb(-1, 1, 0) 1px ' + newVert + 'px ' + newBlur + 'px');

	});

	$('body').disableSelection();

});