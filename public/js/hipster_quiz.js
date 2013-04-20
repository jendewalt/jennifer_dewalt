$(document).ready(function () {
	$('form').on('submit', function (event) {
		event.preventDefault();

		var total = getScore();
		var message;
		
		if (total < 42*1/4) {
			message = "You're definitely not an SF hipster.";
		} else if (total < 42*1/2) {
			message = "You might be an SF hipster.";
		} else if (total < 42*3/4) {
			message = "You're most likely an SF hipster.";
		} else {
			message = "You're a Super SF Hipster!";
		}

		var your_score = "<div id='score'>You're score is " + total + '.</div>';
		message = '<div id="message">' + message + '</div>';

		$('#container').html(your_score + message);

		function getScore() {
			var score = 0;

			for (var i = 1; i < 15; i++) {
				var question = i;

				var answer = $('input[name=q' + i + ']:checked').val();

				if (answer) {
					score += parseInt(answer);
				}
			}
			return score;
		};
	});
});