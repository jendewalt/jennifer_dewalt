$(document).ready(function () {
	var colors = ['red', 'green', 'blue', 'yellow'];
	var level = 1;
	var curPattern = [];
	var i = 0;

	$('button').on('click', function () {
		$('#modal').hide();
		makePattern();
	});

	function getAttempt() {
		var attempt = [];
		var i = 0;

		$('.pad').on('click', function () {
			var color = this.id;
			attempt.push(color);
			lightPad(color);
			
			if (attempt[i] != curPattern[i]) {
				playSound('fail');
				$('.pad').off();
				$('#fail').show().fadeOut('slow');
				curPattern = [];
				level = 0;
				setTimeout(function () {
					makePattern();
				}, 800);
			} else if (curPattern.length == attempt.length) {
				$('.pad').off();
				level++
				makePattern();
			} else {
				i++;
			}
		});
	};

	function flashPattern() {
		setTimeout(function () {
			if (i < curPattern.length) {
				lightPad(curPattern[i]);
				i++;
				flashPattern();
			} else {
				i = 0;
				getAttempt();
			}
		}, 500);	
	};

	function makePattern() {
		$('#level').text('Level ' + level);
		var color = colors[Math.floor(Math.random() * 4)];

		setTimeout(function () {
			curPattern.push(color);
			flashPattern();	
		}, 500);
	};

	function playSound(color) {
		var url = color + '.wav'
  		document.getElementById('sound').innerHTML="<audio autoplay><source src='audio/" + url + "' type='audio/wav'></audio>";
	}

	function lightPad(color) {
		$('#' + color).addClass('glow_' + color);
		playSound(color);
		setTimeout(function () {
			$('#' + color).removeClass('glow_' + color);
		}, 300);
	};
});