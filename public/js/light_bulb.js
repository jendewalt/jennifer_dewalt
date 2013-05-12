(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);

$(document).ready(function () {
	var mouse;
	var state = 'on';
	$('body').disableSelection();

	setTimeout(function () {
		$('#message').fadeOut(1500);
	}, 2000)

	$('#chain_container').draggable({
		containment: "parent",
		start: function (e) {
			mouse = e.pageY;
	
		},
		stop: function (e) {
			flipSwitch(e);
			animateChain();
		}
	});

	function animateChain() {
		$('#chain_container').animate({top: 0}, 100);	
	};

	function flipSwitch(e) {
		if (e.pageY >= mouse + 100) {
			$('body').addClass(state);
			$('#bulb_container').html('<img src="images/light_bulb_' + state +'.png" id="bulb">');
			$('#chain_container').html('<img src="images/chain_' + state +'.png" id="chain">');

			if (state == 'on') {
				state = 'off';
			} else {
				state = 'on'
			}
			$('body').removeClass(state);
		}
	}
});