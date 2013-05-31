(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);

$(document).ready(function () {
	var cur_num = randomInt(1, 1000),
		count = 30,
		misses = 0,
		clock,
		cur_time;

	function checkCurNum() {
		if (cur_num % 3 == 0 && cur_num % 5 == 0) {
			return 'fizz buzz';
		} else if (cur_num % 3 == 0) {
			return 'fizz';
		} else if (cur_num % 5 == 0) {
			return 'buzz';
		} else {
			return cur_num;
		}
	};

	function timer() {
		var start = new Date().getTime(),
			elapsed = 0;

		clock = setInterval(function () {
			var time = new Date().getTime() - start;

			elapsed = Math.floor(time / 1000);
			formatTime(elapsed);
		}, 500);
	};

	function formatTime(seconds) {
		var min = Math.floor(seconds / 60), 
			sec = seconds % 60;

		if (sec < 10) {
			sec = '0' + sec;
		}
		if (min < 10) {
			min = '0' + min;
		}

		cur_time = min + ':' + sec;
		$('.timer').text('Time: ' + cur_time);
	};

	function updateStats() {
		$('.cur_num').text(cur_num);
		$('.misses').text('Misses: ' + misses);
		$('.count').text('Rounds Left: ' + count);
	};

	function updateEndCard() {
		$('h2:nth-child(2)').text('Time: ' + cur_time);
		$('h2:nth-child(3)').text('Misses: ' + misses);
		$('h2:nth-child(4)').text('Accuracy: ' + (30/(30+misses) * 100).toFixed(2) + '%');
	};

	$('.start_form').on('submit', function (e) {
		e.preventDefault();
		$('.title_card').hide();
		$('.text').focus();

		timer();
		updateStats();		
	});


	$('.input_form').on('submit', function (e) {
		e.preventDefault();
		var input = $('.text').val().toLowerCase().trim(),
			test = checkCurNum();
			
		$('.text').val('');

		if (test == input) {
			count--;
			if (count == 0) {
				updateEndCard();
				$('.end').show();
				clearInterval(clock);
			} else {
				cur_num = randomInt(1, 1000);
				updateStats();
			}
		} else {
			misses++;
			updateStats();
		}
	});

	
	$('body').disableSelection();

});

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};






