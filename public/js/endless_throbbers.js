(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);

$(document).ready(function () {
	var count = 0;
	var id;

	$('body').disableSelection();

	$('body').on('click', function (e) {
		if (count == 0){
			$('#container').append('<img class="throbber" id="' + id +'" src="images/throbber_1.gif">');
			$('#' + id).css({marginTop: '50px'});
			count += 1;

			setTimeout(function () {
				$('p').text('That\'s odd. Try clicking somewhere else.');
			}, 1500);
		} else if (count == 1) {
			makeThrobber(e);
			setTimeout(function () {
				$('p').text('So weird! Maybe try the other side?');
			}, 1000);
		} else if (count == 2) {
			makeThrobber(e);
			setTimeout(function () {
				$('p').text('Welp. I got nothing else for you. You\'re on your own now.');
			}, 1000);
			setTimeout(function () {
				$('p').fadeOut('2000');
			}, 4000);
		} else {
			makeThrobber(e);
		}
	});

	function makeThrobber(e) {
		var rand = Math.floor(Math.random()*13);
		var throbber = 'throbber_' + rand + '.gif';
		id = 't' + count;

		if (rand == 5) {
			throbber = 'throbber_' + rand + '.png';
		}

		$('#container').append('<img class="throbber" id="' + id +'" src="images/' + throbber +'">');
		$('#' + id).css({position: 'absolute', top: e.pageY, left: e.pageX});

		if (rand == 5) {
			$('#' + id).addClass('spin');			
		}

		count += 1;
	}
});
