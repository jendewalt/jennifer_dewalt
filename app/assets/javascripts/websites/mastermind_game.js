function mastermindGame() {
	var colors = ['#eb1144', '#11d3ed', '#f2680c', '#c111ed', 
		 		  '#0ee307', '#3375e8'];
	var code = [];
	var guesses = 8;
	var cur_guess = [];

	for (var i = 0; i < 6; i++) {
		$('<div />', {
			class: 'guess peg color',
			id: i
		}).draggable({
			helper: 'clone',
			snap: '.peg',
		}).appendTo('#c' + i).css({'background-color': colors[i] });
	}

	for (var i = 0; i < 4; i++) {
		code.push(colors[randomInt(0, colors.length - 1)]);
	}

	$('.start').on('click', function() {
		$('.info').fadeOut('500');
	});

	$('.submit').on('click', function () {
		if (cur_guess.length == 4) {
			checkGuess();
		} else {
			alert('Guess cannot have empty slots.')
		}
	});
		
	makeDroppable();
	$('body').disableSelection();

	function makeDroppable () {
		$('#row_' + guesses + ' .peg.hole').droppable({
			drop: function(e, ui) {
				var color = ui.helper.context.id;

				cur_guess[$(this).data('index')] = colors[color];
				$(this).css({'background-color': colors[color]});
			}
		});

		highlightRow();		
	};

	function highlightRow() {
		var prev_row = parseInt(guesses) + 1;
		$('#row_' + guesses).addClass('active');
		
		$('#row_' + prev_row).removeClass('active');
	};

	function generateCheckHash() {
		var hash = {};

		_.each(code, function(color) {
			hash[color] = hash[color] ? hash[color] + 1 : 1;
		});

		return hash;
	};

	function checkGuess() {
		var keys = {red_marks: 0, white_marks: 0};
		var	color_count = generateCheckHash();

		_.each(cur_guess, function (guess, i) {
			if (color_count[guess]) {
				color_count[guess] -= 1;
				keys.white_marks += 1;
			}

			if (guess == code[i]) {
				keys.red_marks += 1;
			}
		});

		fillInKeys(keys);
	};

	function fillInKeys(hash) {
		_.each(_.range(hash['white_marks']), function (num) {
			$('#row_' + guesses + ' .key[data-index="'+ num +'"]').css('background-color', 'white');
		});			
		
		_.each(_.range(hash['red_marks']), function (num) {
			$('#row_' + guesses + ' .key[data-index="'+ num +'"]').css('background-color', '#dd0000');
		});

		if (hash['red_marks'] == 4) {
			alert('You cracked the code!');
			showCode();
			$('button').off();
		} else {
			moveToNextGuess();
		}
	};

	function moveToNextGuess() {
		$('#row_' + guesses + ' .peg.hole').droppable('destroy');

		guesses -= 1;
		cur_guess = [];

		if (guesses == 0) {
			$('button').off();
			alert('You lose!');
			showCode();
		} else {
			makeDroppable();
		}
	};

	function showCode() {
		_.each(code, function (color, i) {
			$('.code .peg[data-index="'+ i +'"]').css('background-color', color).fadeIn(500);
		});
	}
}