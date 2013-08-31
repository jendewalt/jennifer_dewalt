function letterStorm() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var width = 800;
	var height = 580;
	var time_interval = 100;
	var letters = [];

	var characters = 'eeeeeeaaaaiiiioooonnnnrrrrttttlllssssuuudddgggbbbcccmmmppffhhvvvwwwyyykkjjxxqqzz'.toUpperCase().split('');
	var guessContainer = {
		x: width / 3,
		y: height - 25,
		word: '',
		draw: function () {
			ctx.beginPath();
			ctx.fillStyle = "#0e1343";
			ctx.fillRect(0, canvas.height - 50, canvas.width, canvas.height);
			ctx.fillStyle = "#fff";
			ctx.font = '28px Futura';
     		ctx.textAlign = 'center';
     		ctx.textBaseline = 'middle';
			ctx.fillText(this.word, this.x, this.y);
			ctx.closePath();
		}
	};

	var submitBtn = {
		x: width - 200,
		y: height - 50,
		width: 100,
		draw: function () {
			ctx.beginPath();
			ctx.fillStyle = "#04acff";
			ctx.fillRect(this.x, this.y, this.width, canvas.height);
			ctx.fillStyle = "#fff";
			ctx.font = '18px Futura';
     		ctx.textAlign = 'center';
     		ctx.textBaseline = 'middle';
			ctx.fillText('Submit', this.x + this.width / 2, guessContainer.y);
			ctx.closePath();
		}
	};

	var clearBtn = {
		x: width - 100,
		y: height - 50,
		width: 100,
		draw: function () {
			ctx.beginPath();
			ctx.fillStyle = "#ff6600";
			ctx.fillRect(this.x, this.y, this.width, canvas.height);
			ctx.fillStyle = "#fff";
			ctx.font = '18px Futura';
     		ctx.textAlign = 'center';
     		ctx.textBaseline = 'middle';
			ctx.fillText('Clear', this.x + this.width / 2, guessContainer.y);
			ctx.closePath();
		}
	};

	var scoreBoard = {
		x: 30,
		y: 20,
		score: 0,
		draw: function () {
			ctx.beginPath();
			ctx.fillStyle = "#0e1343";
			ctx.font = '14px Futura';
     		ctx.textAlign = 'top';
     		ctx.textBaseline = 'middle';
			ctx.fillText('Score: ' + this.score, this.x, this.y);
			ctx.closePath();
		}
	};

	var timer = {
		x: width - 20,
		y: 20,
		time: 300,
		draw: function () {
			ctx.beginPath();
			ctx.fillStyle = '#04acff';
			ctx.fillRect(this.x, this.y, -1 * this.time, 16);
			ctx.closePath();
			timer.time -= 0.1;
		}
	};

	canvas.height = height;
	canvas.width = width;

	$('#start_btn').on('click', function () {
		$('#start').hide();
		makeLetters();
		paintScreen();		
	});

	$('canvas').on('mousedown', function (e) {
		var mouse_x = e.pageX - canvas.offsetLeft; 
		var mouse_y = e.pageY - canvas.offsetTop; 

		if (mouse_y >= canvas.height - 50) {
			console.log('in cont')
			if (mouse_x > submitBtn.x && mouse_x < submitBtn.x + submitBtn.width) {
				checkSubmission(guessContainer.word);
			} else if (mouse_x > clearBtn.x && mouse_x < clearBtn.x + clearBtn.width) {
				guessContainer.word = '';
			}
		} else {
			checkForHit(mouse_x, mouse_y);
		}
	});

	$(document).on('keypress', function (e) {
		e.preventDefault();
		var key = (e.keyCode ? e.keyCode : e.which);
		var character = String.fromCharCode(e.charCode);

		if (key == 13) {
			checkSubmission(guessContainer.word);
		} else if (key == 32) {
			guessContainer.word = '';
		} else {
			checkKeyPressHit(character);
		}
	});

	function makeLetters() {
		letters.push(new Letter());

		if (letters.length < 12) {
			setTimeout(makeLetters, 600);
		}
	}

	function paintScreen() {
		ctx.clearRect(0,0,canvas.width,canvas.height);

		scoreBoard.draw();
		timer.draw();

		for (var i = 0; i < letters.length; i++) {
			letters[i].draw();
		}
		guessContainer.draw();
		submitBtn.draw();
		clearBtn.draw();

		if (timer.time <= 0) {
			$('#game_over p').text('Your score: ' + scoreBoard.score);
			$('#game_over').show();
		} else {
			requestAnimFrame(paintScreen);
		}
	}

	function Letter() {
		this.init = function () {
			this.character = characters[randomInt(0, characters.length - 1)];
			this.x = randomInt(10, canvas.width - 10);
			this.y = -20;
			this.y0 = -20;
			this.v0y = 0;
			this.time = 0;
			this.acceleration = 0.000003;			
			this.radius = 20;
		}

		this.draw = function () {
			var xoff = this.x - 22;
			var yoff = this.y - 40;

			ctx.beginPath();
			ctx.fillStyle = '#d4eefb';
			ctx.moveTo(20 + xoff, 1 + yoff);
			ctx.bezierCurveTo(7 + xoff, 21 + yoff, 1 + xoff, 31 + yoff, 1 + xoff, 43 + yoff);
			ctx.bezierCurveTo(1 + xoff, 47 + yoff, 6 + xoff, 60 + yoff, 23 + xoff, 60 + yoff);
			ctx.bezierCurveTo(40 + xoff, 60 + yoff, 44 + xoff, 46 + yoff, 44 + xoff, 42 + yoff);
			ctx.bezierCurveTo(44 + xoff, 31 + yoff, 37 + xoff, 21 + yoff, 21 + xoff, 1 + yoff);
			ctx.fill();
			ctx.closePath();

			ctx.beginPath();
			ctx.font = '28px Futura';
     		ctx.textAlign = 'center';
     		ctx.textBaseline = 'middle';
			ctx.fillStyle = "#0e1343";
			ctx.fillText(this.character, this.x, this.y);
			ctx.closePath();

			this.evolve();
		}

		this.evolve = function () {
			this.y += 1.6;

			if (this.y > canvas.height + this.radius + 70) {
				this.init();
			}
		}
		this.init();
	}

	function checkForHit(x, y) {
		_.some(letters, function (letter) {
			if (intersects(x, y, letter.x, letter.y, letter.radius)) {
				updateWord(letter.character);
				letter.init();
				return true;
			} else {
				return false;
			}
		});
	}

	function checkKeyPressHit(character) {
		character = character.toUpperCase();

		_.some(letters, function (letter) {
			if (character == letter.character) {
				updateWord(letter.character);
				letter.init();
				return true;				
			} else {
				return false;
			}
		});
	}

	function updateWord(letter) {
		guessContainer.word += letter;
	}

	function intersects(x, y, cx, cy, r) {
		var dx = x - cx;
		var dy = y - cy;
		return dx * dx + dy * dy <= r * r;
	}

	function checkSubmission(word) {
		word = word.toLowerCase();
		if (_.indexOf(big_word_list, word) != -1) {
			scoreBoard.score += Math.round(Math.pow(word.length, 1.5));
			timer.time += (word.length * 8);

			$('#status h1').text('CORRECT').addClass('correct');
		} else {
			$('#status h1').text('WRONG').addClass('wrong');
		}
		$('#status').show();
		setTimeout(function () {
			$('#status').fadeOut(300);
		}, 1200);

		guessContainer.word = '';
	}

	$('body').disableSelection();
}