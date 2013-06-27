function quickWords() {
	var canvas = $('canvas')[0],
		ctx = canvas.getContext('2d'),
		height = 340,
		width = 240,
		letters = 'eeeeeeeeeeeeaaaaaaaaaiiiiiiiiioooooooonnnnnnrrrrrrttttttllllssssuuuuddddgggbbccmmppffhhvvwwyykjxqz'.toUpperCase().split(''),
		positions = [[0,0], [80, 0], [160, 0],
					 [0,80], [80, 80], [160, 80],
					 [0,160], [80, 160], [160, 160]]
		tiles = [],
		stage = [];

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
    	ctx.fillText(stage, width / 2, 300);		
	};

	function paintScreen() {
		ctx.clearRect(0,0,width,height);
		_.each(tiles, function(tile) {
			tile.draw();
		});

		drawStage();
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
	
	init();

	$('canvas').on('click', function (e) {
		var x = e.pageX - canvas.offsetLeft,
			y = e.pageY - canvas.offsetTop;

		if (y <= 240) {
			registerLetter(x,y);
		} else {
			checkSubmission();
		}
	});
};












