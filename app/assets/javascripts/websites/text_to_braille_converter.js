function textToBraille() {
	var characters = {
		'a': [1],
		'b': [1, 3],
		'c': [1, 2],
		'd': [1, 2, 4],
		'e': [1, 4],
		'f': [1, 2, 3],
		'g': [1, 2, 3, 4],
		'h': [1, 3, 4],
		'i': [2, 3],
		'j': [2, 3, 4],
		'k': [5, 1],
		'l': [5, 1, 3],
		'm': [5, 1, 2],
		'n': [5, 1, 2, 4],
		'o': [5, 1, 4],
		'p': [5, 1, 2, 3],
		'q': [5, 1, 2, 3, 4],
		'r': [5, 1, 3, 4],
		's': [5, 2, 3],
		't': [5, 2, 3, 4],
		'u': [5, 6, 1],
		'v': [5, 6, 1, 3],
		'w': [5, 6, 3, 4],
		'x': [5, 6, 1, 2],
		'y': [5, 6, 1, 2, 4],
		'z': [5, 6, 1, 4],
		'1': [1],
		'2': [1, 3],
		'3': [1, 2],
		'4': [1, 2, 4],
		'5': [1, 4],
		'6': [1, 2, 3],
		'7': [1, 2, 3, 4],
		'8': [1, 3, 4],
		'9': [2, 3],
		'0': [2, 3, 4],
		'!': [3, 4, 5],
		'\'': [5],
		',': [3],
		'-': [5, 6],
		'.': [3, 4, 6],
		'?': [3, 5, 6],
		'^': [6],
		'#': [2, 4, 5, 6],
		' ': [] 
	};

	$('textarea').focus();

	$('textarea').on('keyup', function() {
		var text = $.trim($('textarea').val()),
			output = $('#braille_container').empty(),
			cur_braille = [];

			text = text.replace(/(\d+)/g, '#$1').replace(/(\d)([a-j])/g, '$1 $2')
					   .replace(/([A-Z])/g, '^$1').toLowerCase(); 

		_.each(text, function (c) {
			if (_.has(characters, c)) {
				cur_braille.push(characters[c]);
			} else {
				cur_braille.push(characters[' ']);
			}
		});

		_.each(cur_braille, function (char_array) {
			var cell = $('<div />', {
				class: 'cell'
			}).appendTo(output);

			_.each(char_array, function (pos) {
				cell.append('<div class="dot d' + pos + '"></div>');
			});
		});
	});
};


