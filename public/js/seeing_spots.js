$(document).ready(function () {
	var canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d'),
		numOfSpots,
		guess,
		success = 0,
		correct,
		results = [],
		rounds = 0;

	for (var i = 0; i < 30; i++) {
		results.push([0, 0]);

		$('<div>', {
			class: 'guess',
			id: i,
			text: i + 1
		}).on('click', checkGuess).appendTo('#btn_container');
	}
	
	$('.start_btn').on('click', function () {

		$('.modal').hide();
		setTimeout(playGame, 1000);
	});

	function playGame() {
		makeSpots();

		if (rounds < 30) {
			$('#rounds_left').text('Rounds remaining: ' + (29 - rounds));			
		}

		setTimeout(function () {
			ctx.clearRect(0,0,700,400);

		}, 300);
	};

	function checkGuess(el) {
		var guess = Number(this.id);
		rounds++;

		(results[guess])[1]++;
		correct = false;

		if (guess == numOfSpots - 1) {
			(results[guess])[0]++;
			correct = true;
		}

		checkResults();
	}

	function checkResults() {
		success = 0;
		var continue_checking = true;

		_.each(results, function (numArray) {
			if ( numArray[0]/numArray[1] > 0.5 && continue_checking ) {
				success++;
			} else {
				continue_checking = false;
			}
		});


		showResult();
	}

	function showResult() {
		if (correct) {
			$('#correct').show();
			$('#correct').fadeOut(1000);
		} else {
			$('#incorrect').show();
			$('#incorrect').fadeOut(1000);
		}

		if (success > 0) {
			$('#score').text('Average number of spots you can see: ' + success + '.');
		}

		if (rounds == 30) {
			$('.modal h1').text('You\'ve finished 30 rounds!');
			$($('.modal h2')[0]).text('The average number of spots you can see is: ' + success + '.');
			$($('.modal h2')[1]).text('This test is over, but you can play as long as you like!');
			$('.start_btn').text('Keep Going!').css('width', 200);

			setTimeout(function () {
				$('.modal').show();
				$('#rounds_left').text('Rounds remaining: infinite');
			}, 1000);
			
		} else {
			setTimeout(playGame, 1500);
		}
	};

	function makeSpots() {
		if (rounds == 0) {
			numOfSpots = 1;
		} else {
			numOfSpots = Math.floor(Math.random() * 4) + success + (success > 1 ? -1 : 1);
		}
		ctx.clearRect(0,0,700,400);
		ctx.fillStyle = '#eee';

		for (var i = 0; i < numOfSpots; i++) {
			var x = Math.random() * 640 + 10;
			var y = Math.random() * 340 + 10;

			ctx.beginPath();
			ctx.arc(x, y, 10, 0, Math.PI * 2);
			ctx.fill();
		}
	};
		
});

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};