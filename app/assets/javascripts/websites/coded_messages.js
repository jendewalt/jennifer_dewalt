function codedMessages() {
	var character_list = ['A', 'B', 'C', 'D', 'E', 
						  'F', 'G', 'H', 'I', 'J', 
						  'K', 'L', 'M', 'N', 'O', 
						  'P', 'Q', 'R', 'S', 'T', 
						  'U', 'V', 'W', 'X', 'Y', 'Z', 
						  '1', '2', '3', '4', '5',
						  '6', '7', '8', '9', '0', 
						  '!', '@', '#', '%', '$',
						  '^', '&', '*', '(', ')',
						  '?', '.', ',', '\'', '/', ' '];

	if ($('form').length) {
		$('form').on('submit', function (e) {
			var message = $.trim($('#message_input').val());
			var title = $.trim($('#title_input').val());

			if (message.length < 1) {
				e.preventDefault();
				alert('Please enter a message.');
			} else if (message.length > 40) {
				e.preventDefault();
				alert('Your message is too long. Limit is 140 characters.');
			} else if (title.length < 1) {
				e.preventDefault();
				alert('Please enter a hint or title.');
			} else if (title.length > 255) {
				e.preventDefault();
				alert('Your title is too long. Limit is 255 characters.');
			} else {
				message = utf8_to_b64(message);
				$('#message').val(message);
			}
		});		
	}

	if ($('canvas').length) {
		var canvas = $('canvas')[0];
		var ctx = canvas.getContext('2d');
		var coded_message = $('#message').data('message');
		var message = b64_to_utf8(coded_message).toUpperCase();
		var column_spacing = 30;
		var char_spacing = 38;
		var width = message.length * column_spacing;
		var height = 10 * char_spacing;
		var columns = [];
		var pos_x = 0;

		canvas.width = width;
		canvas.height = height;

		function paintScreen() {
			ctx.beginPath();
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = '#00cc99';
			ctx.fillRect(0, canvas.height - char_spacing, canvas.width, char_spacing);
			ctx.closePath();

			_.each(columns, function (col) {
				col.draw();
			});
		}

		function Column(x, char) {
			this.x = x;
			this.y = 0;
			this.char = char;
			this.chars = [];
			this.char_spacing = char_spacing;
			this.width = column_spacing;
			this.rotating = false;

			this.init = function () {
				this.chars.push(this.char);
				for (var i = 0; i < 9; i += 1) {
					this.chars.push(character_list[randomInt(0, character_list.length - 1)]);
				}
				this.chars = _.shuffle(this.chars);
			};

			this.draw = function () {
				var column = this;
				var pos_y = this.y + 5;
				ctx.beginPath();
				ctx.fillStyle = '#222';
				ctx.strokeStyle = '#888';
				ctx.textBaseline = 'top'; 
				ctx.textAlign = 'center';
				ctx.font = '20px monospace';
				
				_.each(column.chars, function (char) {
					ctx.fillText(char, column.x + column.width / 2, pos_y);
					pos_y += column.char_spacing;
				});

				ctx.moveTo(this.x, 0);
				ctx.lineTo(this.x, canvas.height);
				ctx.moveTo(this.x + this.width, 0);
				ctx.lineTo(this.x + this.width, canvas.height);

				ctx.stroke();
				ctx.closePath();
			};

			this.rotate = function (times) {
				var column = this;
				column.rotating = true;
				times = times ? times : 0;

				if (times < column.char_spacing) {
					column.y += 1;
					paintScreen();

					setTimeout(function () {
						column.rotate(times + 1);
					}, 7);
				} else {
					var bottom_char = column.chars.pop();
					column.chars.unshift(bottom_char);
					column.y = 0;
					paintScreen();
					column.rotating = false;
				}				 
			}

			this.init();
		}

		function checkGuess() {
			var guess = []
			_.each(columns, function (col, i) {
				guess.push(col.chars[col.chars.length - 1]);
			});

			if (guess.join('') == message) {
				alert('CORRECT! Excellent decoding work!');
			} else {
				alert('NOPE! ' + guess.join('') + ' is not the correct answer.');
			}
		}
		_.each(message.split(''), function (char) {
			columns.push(new Column(pos_x, char));
			pos_x += column_spacing;
		});

		paintScreen();

		$('canvas').on('click', function (e) {
			var mouse_x = e.pageX - canvas.offsetLeft;

			_.each(columns, function (col) {
				if (mouse_x > col.x && mouse_x < col.x + col.width && !col.rotating) {
					col.rotate();
				}
			});
		});

		$('#solve').on('click', checkGuess);

		$('body').disableSelection();
	}
}