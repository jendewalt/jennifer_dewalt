(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);

$(document).ready(function () {

	$('#start').on('click', function () {
		var clicks = 0;
		$('body').css('cursor', 'pointer');
		$('body').disableSelection();

		$('#modal').hide();
		$('.spinner').addClass('spinner_animate');
		$('.filler').addClass('filler_animate');
		$('.mask').addClass('mask_animate');

		$('body').on('click', function () {
			clicks++;
			$('#counter').text(clicks);
		});

		setTimeout(function () {
			var cps = Math.round((clicks / 30)*Math.pow(10,2))/Math.pow(10,2);
			var cpsStr = 'clicks';
			var clickStr = 'clicks';

			$('body').css('cursor', 'auto');
			$('h1').text('Time\'s Up!');

			if (clicks == 1) {
				clickStr = 'click'
			} 
			$('h2').text('You got ' + clicks + ' ' + clickStr + '.');

			if (cps == 1) {
				cpsStr = 'click'
			}
			$('#cps').text('That\'s ' + cps + ' ' + cpsStr + ' per second!');
			$('h3').html('<a href="click_challenge.html">Try Again?</a>');
			$('button').hide();
			$('#modal').show();

			$('.spinner').removeClass('spinner_animate');
			$('.filler').removeClass('filler_animate');
			$('.mask').removeClass('mask_animate');
		}, 30000);

	});

});