$(document).ready(function () {
	var words   = getWordsArray();
	var word    = getWord();
	var letters = shuffle(word);
	var score   = 0;
	var chances = 3;

	$('#start').on('click', function () {
		$('#start').hide();
		$('#message').text('Here\'s your first word. Good Luck!');
		$('#game_container').show();
		$('#guess').focus();
	})
	
	$('#letters').text(letters);

	$('form').on('submit', function (e) {
		e.preventDefault();

		checkGuess();
	});

	function checkGuess() {
		var guess = $('#guess').val().toUpperCase();
			guess = $.trim(guess);
		
		if (guess == word) {
			score++;

			$('.button').attr('disabled', 'disabled');
			$('#message').text('Correct! The word was ' + word);
			$('#score').text('Score: ' + score);

			setTimeout(function () {
				newRound();
			}, 3000);
		} else {
			chances--;
			if (chances == 1 ) {
				var message = 'Incorrect! 1 chance left';
			} else if (chances <= 0) {
				var message = 'Incorrect! You are out of chances';
				$('#word').text('The word was ' + word);
				$('.button').attr('disabled', 'disabled');
	
			} else {
				var message = 'Incorrect! ' + chances + ' chances left';
			}

			$('#message').text(message);
		}

		if (chances == 0) {
			score--;
			
			$('#score').text('Score: ' + score);
			setTimeout(function () {
				$('.button').removeAttr('disabled');
				newRound();
			}, 3000);
		}

	};

	function newRound() {
		word    = getWord();
		letters = shuffle(word);
		chances = 3;
		$('.button').removeAttr('disabled');
		$('#guess').val('');
		$('#letters').text(letters);
		$('#message').text('Here is your next word');
		$('#word').text('');
	};
	
	function getWord() {
		var newWord = words[Math.floor(Math.random() * words.length)];
		return newWord.toUpperCase();
	};

	function getWordsArray() {
		var array;

		$.ajax({
			type: 'GET',
			url: 'words.html',
			async: false,
			success: function (data) {
				array = data.split("\n");
			}
		});

		return array
	};

	function shuffle(str) {
		var a = str.split("");
		var len = a.length;

		for(var i = len - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var tmp = a[i];
			a[i] = a[j];
			a[j] = tmp;
		}
		return a.join('');
	};
});
