(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);

function clickCounter() {
	$('button').on('click', function (e) {
		e.preventDefault();
		$(this).attr('disabled', 'disabled');
		console.log('Hello')

		$.ajax({
			type: 'PUT',
			url: '/click_counter/buttons/1'
		});

		updateClicks();

		setTimeout($.proxy(removeDisabled, this), 400);

		function removeDisabled () {
			$(this).removeAttr('disabled');
		};
	});

	function updateClicks() {
		var clicks = $('#click_num').text();
		clicks++;
		$('#click_num').text(clicks);
	};
	
	$('body').disableSelection();
};