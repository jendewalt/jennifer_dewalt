$(document).ready(function () {
	$('.start').on('mouseenter', function () {
		var win = false;
		var	failPhrases = ["That's lame.",
					 	   "Ouch, too bad.",
					 	   "I am sure you're good at something.",
					 	   "That wasn't too pretty.",
					 	   "Well, at least you tried.",
					 	   "Maybe cursors just aren't your thing.",
					 	   "I've seen worse failures.",
					 	   "Well that sucked.",
					 	   "Are you using your foot?"]

		$('.end').on('mouseenter', function () {
			$('#modal').show();
			win = true;
		});

		$('.game_container').on('mouseleave', function () {
			if (win == false) {
				var phrase = failPhrases[Math.floor(Math.random() * 9)];

				$('#modal').html("<h1>FAIL!</h1>" + "<h2>" + phrase + "</h2>" + "<a href='' class='button' id='try_again'>Try Again?</a>" + "<a href='keep_it_straight.html' class='button'>Start Over</a>").show();

				$('#try_again').on('click', function (e) {
					e.preventDefault();
					location.reload();
				});
			}
		});

	});
});