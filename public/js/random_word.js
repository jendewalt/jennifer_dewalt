$(document).ready(function () {
	var words = getWordsArray();
	var running = true;
	var start

	startWords();

	$('.button').on('click', function () {
		if (running) {
			stopWords();
		} else {
			startWords();
		}
	});

	function startWords() {
		start = setInterval(function () {
					running = true;
					$('.button').val('Stop').removeClass('start').addClass('stop');
					$('#word_container').text(words[Math.floor(Math.random() * words.length)]);
				}, 50);	
	}

	function stopWords() {
		running = false;
		$('.button').val('Start').removeClass('stop').addClass('start');
		clearInterval(start);		
	}

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
});