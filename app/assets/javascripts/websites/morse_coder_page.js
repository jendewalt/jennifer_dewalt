function morseCoder() {
	var time_unit = 100;
	var element_gap = time_unit;
	var letter_gap = time_unit * 2;
	var word_gap = time_unit * 3;
	var dot = new Howl({
		urls: ['/assets/dot.mp3', '/assets/dot.ogg'],
		volume: 0.6,
		onend: function () {
			setTimeout(checkIfMoreSounds, element_gap);
		}
	});
	var dash = new Howl({
		urls: ['/assets/dash.mp3', '/assets/dash.ogg'],
		volume: 0.6,
		onend: function () {
			setTimeout(checkIfMoreSounds, element_gap);
		}
	});

	var characters = {
		'a': [dot, dash],
		'b': [dash, dot, dot, dot],
		'c': [dash, dot, dash, dot],
		'd': [dash, dot, dot],
		'e': [dot],
		'f': [dot, dot, dash, dot],
		'g': [dash, dash, dot],
		'h': [dot, dot, dot, dot],
		'i': [dot, dot],
		'j': [dot, dash, dash, dash],
		'k': [dash, dot, dash],
		'l': [dot, dash, dot, dot],
		'm': [dash, dash],
		'n': [dash, dot],
		'o': [dash, dash, dash],
		'p': [dot, dash, dash, dot],
		'q': [dash, dash, dot, dash],
		'r': [dot, dash, dot],
		's': [dot, dot, dot],
		't': [dash],
		'u': [dot, dot, dash],
		'v': [dot, dot, dot, dash],
		'w': [dot, dash, dash],
		'x': [dash, dot, dot, dash],
		'y': [dash, dot, dash, dash],
		'z': [dash, dash, dot, dot],
		'0': [dash, dash, dash, dash, dash],
		'1': [dot, dash, dash, dash, dash],
		'2': [dot, dot, dash, dash, dash],
		'3': [dot, dot, dot, dash, dash],
		'4': [dot, dot, dot, dot, dash],
		'5': [dot, dot, dot, dot, dot],
		'6': [dash, dot, dot, dot, dot],
		'7': [dash, dash, dot, dot, dot],
		'8': [dash, dash, dash, dot, dot],
		'9': [dash, dash, dash, dash, dot],
		'.': [dot, dash, dot, dash, dot, dash],
		',': [dash, dash, dot, dot, dash, dash],
		'?': [dot, dot, dash, dash, dot, dot],
		'\'': [dot, dash, dash, dash, dash, dot],
		'!': [dash, dot, dash, dot, dash, dash],
		'(': [dash, dot, dash, dash, dot],
		')': [dash, dot, dash, dash, dot, dash],
		':': [dash, dash, dash, dot, dot, dot],
		';': [dash, dot, dash, dot, dash, dot],
		'+': [dot, dash, dot, dash, dot],
		'-': [dash, dot, dot, dot, dot, dash],
		'_': [dot, dot, dash, dash, dot, dash],
		'"': [dot, dash, dot, dot, dash, dot]
	};
	var cur_character_array;
	var cur_character_index;
	var cur_sound_array;
	var cur_sound_index;

	$('.btn').on('click', function () {
		cur_character_array = $('textarea').val().trim().toLowerCase().split('');

		cur_character_index = 0;

		checkIfMoreCharacters();
	});
	
	function checkIfMoreCharacters() {
		if (cur_character_array.length > cur_character_index) {
			cur_character_index += 1;
			cur_sound_array = characters[cur_character_array[cur_character_index - 1]];

			cur_sound_index = 0;

			if (cur_sound_array == undefined) {
				setTimeout(checkIfMoreCharacters, word_gap);
			} else {
				checkIfMoreSounds();				
			}
		}
	}

	function checkIfMoreSounds() {
		if (cur_sound_array.length > cur_sound_index) {
			cur_sound_index += 1;
			cur_sound_array[cur_sound_index - 1].play();
		} else {
			setTimeout(checkIfMoreCharacters, letter_gap);
		}
	}
}




