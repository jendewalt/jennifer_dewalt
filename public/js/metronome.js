(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);

$(document).ready(function () {
	var left = true,
		pendulum_timeout,
		bpm = 135,
		one_min = 60000,
		running = false;

	function start() {
		pendulum_timeout = setTimeout(start, one_min / bpm);
		
		swingPendulum();
		beep();
	};

	function swingPendulum() {
		var bps = 1 / (bpm/60);
		
		if (left) {
			$('#pendulum_container').removeClass('swing_right');
			$('#pendulum_container').addClass('swing_left');

			$("#pendulum_container").css('-webkit-transition', 'all ' + bps + 's ease-in-out');
    		$("#pendulum_container").css('-moz-transition', 'all ' + bps + 's ease-in-out');
    		$("#pendulum_container").css('-o-transition', 'all ' + bps + 's ease-in-out');
    		$("#pendulum_container").css('transition', 'all ' + bps + 's ease-in-out');
			left = false;
		} else {
			$('#pendulum_container').removeClass('swing_left');
			$('#pendulum_container').addClass('swing_right');

			$("#pendulum_container").css('-webkit-transition', 'all ' + bps + 's ease-in-out');
    		$("#pendulum_container").css('-moz-transition', 'all ' + bps + 's ease-in-out');
    		$("#pendulum_container").css('-o-transition', 'all ' + bps + 's ease-in-out');
    		$("#pendulum_container").css('transition', 'all ' + bps + 's ease-in-out');

			left = true;
		}
	};

	function reset() {
		clearTimeout(pendulum_timeout);
		$('#pendulum_container').removeClass('swing_right');
		$('#pendulum_container').removeClass('swing_left');
		$('#pendulum_container').addClass('reset');
	};

	function beep() {
		document.getElementById('beep').play();
	};

	$('button').on('click', function () {
		if (running) {
			$(this).text('Start');
			reset();
		} else {
			$(this).text('Stop');
			$('#pendulum_container').removeClass('reset');
			start();
		}

		running = !running
	});

	$('#weight').draggable({
		containment: 'parent',
		zIndex: 20,
		stop: function (e, obj) {
			bpm = Math.round(obj.position.top * 0.8 + 40);
			$('#bpm').text(bpm + ' bpm');
		}
	});

	$('body').disableSelection();
	
});