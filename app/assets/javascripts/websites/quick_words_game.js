function quickWords() {
	var canvas = $('canvas')[0],
		ctx = canvas.getContext('2d'),
		height = 400,
		width = 240,
		letters = 'eeeeeeeeeeeeaaaaaaaaaiiiiiiiiioooooooonnnnnnrrrrrrttttttllllssssuuuuddddgggbbccmmppffhhvvwwyykjxqz'.toUpperCase().split(''),
		positions = [[0,0], [80, 0], [160, 0],
					 [0,80], [80, 80], [160, 80],
					 [0,160], [80, 160], [160, 160]]
		tiles = [],
		stage = '',
		score = 0;

	canvas.height = height;
	canvas.width = width;

	function init() {
		_.each(positions, function (pos, i) {
			makeTile(pos[0], pos[1], letters[randomInt(0, 97)]);
		});

		paintScreen();
	};

	function Tile(x, y, letter) {
		this.x = x;
		this.y = y;
		this.letter = letter;
		this.used = false;

		this.draw = function () {
			if (this.used) {
				ctx.fillStyle = '#aaa'
			} else {
				ctx.fillStyle = '#333'				
			}

			ctx.fillRect(this.x, this.y, 80, 80);
			ctx.font = "26px Futura";
	    	ctx.textBaseline = 'middle';
	    	ctx.textAlign = 'center'
	    	ctx.fillStyle = '#fff';
	    	ctx.fillText(this.letter, this.x + 40, this.y +40);
		};
	};

	function makeTile(x, y, letter) {
		tiles.push(new Tile(x, y, letter));
	};

	function drawStage() {
		ctx.font = "26px Futura";
    	ctx.textBaseline = 'middle';
    	ctx.textAlign = 'center'
    	ctx.fillStyle = '#333';
    	ctx.fillText(stage, width / 2, 280);		
	};

	function drawScore() {
		ctx.font = "16px Futura";
    	ctx.textBaseline = 'middle';
    	ctx.textAlign = 'center'
    	ctx.fillStyle = '#333';
    	ctx.fillText('Score: ' + score, width / 2, 380);
	};

	function drawClearBtn() {
		ctx.fillStyle = "#333";
		ctx.fillRect(40, 310, 80, 30);
		ctx.font = "13px Futura";
    	ctx.textBaseline = 'middle';
    	ctx.textAlign = 'center'
    	ctx.fillStyle = '#fff';
    	ctx.fillText('Clear', 80, 325);
	};

	function drawSubmitBtn() {
		ctx.fillStyle = "#16a085";
		ctx.fillRect(120, 310, 80, 30);
		ctx.font = "14px Futura";
    	ctx.textBaseline = 'middle';
    	ctx.textAlign = 'center'
    	ctx.fillStyle = '#fff';
    	ctx.fillText('Submit', 160, 325);
	};

	function paintScreen() {
		ctx.clearRect(0,0,width,height);
		_.each(tiles, function(tile) {
			tile.draw();
		});

		drawStage();
		drawScore();
		drawClearBtn();
		drawSubmitBtn();
	};

	function addLetterToStage(tile) {
		stage = stage + tile.letter;
		tile.used = true;
		paintScreen();
	};

	function registerLetter(x, y) {
		_.each(tiles, function (tile) {
			if (x > tile.x && x < tile.x + 80 &&
				y > tile.y && y < tile.y + 80 && !tile.used) {
				addLetterToStage(tile);
			}
		});
	};

	function flashModal(state, score) {
		var msg;
		if (state == 'win') {
			msg = 'Correct! Points: ' + score;
		} else {
			msg = 'Wrong!'
		}

		$('.modal').text(msg).fadeIn('500');
		setTimeout(function () {
			$('.modal').fadeOut('1000');
		}, 1500);
	};

	function resetLevel() {
		_.each(tiles, function (tile) {
			if (tile.used) {
				tile.used = false;
			}
		});
		stage = '';
		paintScreen();
	};

	function advanceLevel() {
		_.each(tiles, function (tile) {
			if (tile.used) {
				tile.used = false;
				tile.letter = letters[randomInt(0, 97)];
			}
		});

		score += Math.pow(stage.length, 2);
		flashModal('win', Math.pow(stage.length, 2));
		stage = '';
		paintScreen();
	};

	function checkSubmission() {
		var word = stage.toLowerCase();
		if (_.indexOf(big_word_list, word) != -1) {
			advanceLevel();
		} else {
			resetLevel();
			flashModal('lose');
		}
	};
	
	init();

	$('canvas').on('click', function (e) {
		var x = e.pageX - canvas.offsetLeft,
			y = e.pageY - canvas.offsetTop;

		if (y <= 240) {
			registerLetter(x,y);
		} else if (x > 40 && x < 120 && y > 310 && y < 340) {
			resetLevel();
		} else if (x > 120 && x < 200 && y > 310 && y < 340) {
			checkSubmission();
		}
	});
};












