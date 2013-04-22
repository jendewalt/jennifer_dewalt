$(document).ready(function () {
	$('textarea').focus();

	$('form').on('submit', function (event) {
		event.preventDefault();

		var text = $('textarea').val();
		var y = 0;

		if (text.replace(/^\s+|\s+$/g, '') == '') {
			text = 'You should probably enter some text next time.'
		}

		$('header a').addClass('dark');
		$('body').css('background-color', '#090919');
		$('#container').html('<div id="teleprompt_screen">' + text + '</div>')
		

		scrollText(y);


		function scrollText(y) {
			setTimeout(function () {
				var newY = y;
				var height = $('#teleprompt_screen').height();

				if (newY > -1 * height - 150) {
					newY -= 1;
					$('#teleprompt_screen').css('top', newY);

					scrollText(newY);
				}
			}, 30);
		};

	});
	// get the height of the screen
	// move the text up the screen by changing the top CSS

});