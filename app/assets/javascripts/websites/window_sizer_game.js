function windowSizer() {
	var screen_height = screen.availHeight;
	var screen_width = screen.availWidth;
	var target_width;
	var target_height;
	var running = false;
	var score = 0;

	$('#start').on('click', function () {
		$('#start_container').fadeOut(300);
		running = true;
		setNewTarget();
		timer();
	});

	
	$(window).resize(function () {
		if (window.innerWidth > target_width - 3 &&  window.innerWidth < target_width + 3 && 
			window.innerHeight > target_height - 3 && window.innerHeight < target_height + 3 &&
			running) {
			score += 1;
			setNewTarget();
		}
	});		


	function setNewTarget() {
		target_width = randomInt(500, screen_width - 200);
		target_height = randomInt(250, screen_height - 200);

		$('#target_text').text(target_width + ' x ' + target_height);
		$('#target_area').animate({
			width: target_width,
			height: target_height,
		}, 300).css({
			'backgroundColor': randomColorHex
		});

		$('#score').text('Resizes: ' + score);
	};

	function timer() {
		var start = new Date().getTime(),
			elapsed = 0;

		clock = setInterval(function () {
			var time = new Date().getTime() - start;

			elapsed = Math.floor(time / 1000);
			updateProgressBar(60 - elapsed);

			if (elapsed == 60) {
				clearInterval(clock);
				endGame();
			}
		}, 500);
	};

	function updateProgressBar(seconds) {
		$('#progress_bar').css('width', seconds / 60 * 100 + '%');
	};

	function endGame() {
		running = false;
		$('#info_container').hide();
		$('#final_score').text('Total Resizes: ' + score);
		$('#end_container').fadeIn(300);
	};
}