function minesweeper() {
	var timer;
	var clock;
	var game = new Game(8, 3);
	var running = false;

	game.init();

	$('.new_game').on('click', function () {
		var level = $(this).val();

		if (level == 1) {
			game = new Game(8, 10);
		}
		if (level == 2) {
			game = new Game(16, 40);
		}
		if (level == 3) {
			game = new Game(22, 99);
		}
		game.init();
	});


	function Game(size, mines) {
		var gameData = [];
		var size = size;
		var mines = mines;
		var exposed = 0;

		this.init = function () {
			var element;
			running = false;
			$('.board').html('');
			$('#container').css('width', size * 36 + 6);
			$('#mines').text('Mines: ' + mines);
			$('#status').text('\u2620').hide()

			timer = new Timer();

			for (var i = 0; i < size; i++) {
				gameData[i] = [];

				for (var j = 0; j < size; j++) {
					element = $('<div class="square">').appendTo('.board');
					gameData[i][j] = new Square(element, i, j);
					element.data('position', {x: i, y: j});
				}
				$('<br class="clear">').appendTo('.board');
			}

			// Set the mines
			var mines_set = 0;

			while (mines_set < mines) {
				var x = randomInt(0, size - 1);
				var y = randomInt(0, size - 1);

				if (!gameData[x][y].isMine) {
					gameData[x][y].isMine = true;
					mines_set += 1;
				}
			}

			// Set the number of mine neighbors for each square
			for (var i = 0; i < size; i++) {
				for (var j = 0; j < size; j++) {
					var square = gameData[i][j];
					var neighbor_mines = checkNeighbors(square, function (sq) {	
						return !sq.isMine
					});

					square.mineCount = neighbor_mines.length;
				}
			}
		};

		this.expose = function (square) {
			if (square.isMine) {
				gameOver('lose');
				return
			} else if (square.mineCount > 0 && square.isHidden) {
				exposed += 1;
				square.isHidden = false;
				square.element.text(square.mineCount).addClass('exposed').removeClass('flagged');
			} else if (square.isHidden) {
				var neighbors = checkNeighbors(square);
				var game = this;

				exposed += 1;
				square.isHidden = false;
				square.element.addClass('exposed');

				_.each(neighbors, function (n) {
					game.expose(n);
				});			
			}
			console.log(exposed)
			console.log(size * size - mines)
			console.log('--------------------')

			if (exposed == size * size - mines) {
				gameOver('win');
			}
		};

		function checkNeighbors (square, condition) {
			var neighbors = [];

			if (square.y > 0) {		// Top
				neighbors.push(gameData[square.x][square.y - 1]);
			}
			if (square.y < size - 1) {		// Bottom
				neighbors.push(gameData[square.x][square.y + 1]);
			}	
			if (square.x > 0) {		// Left
				neighbors.push(gameData[square.x - 1][square.y]);
			}		
			if (square.x < size - 1) {		// Right
				neighbors.push(gameData[square.x + 1][square.y]);
			}
			
			if (square.y > 0 && square.x > 0) {		// Top Left
		        neighbors.push(gameData[square.x - 1][square.y - 1]);
		    }
		    if (square.y > 0 && square.x < size - 1) { 	// Top Right
		        neighbors.push(gameData[square.x + 1][square.y - 1]);
		    }
		    if (square.y < size - 1 && square.x > 0) { 	// Bottom Left
		        neighbors.push(gameData[square.x - 1][square.y + 1]);
		    }
		    if (square.y < size - 1 && square.x < size - 1) {		// Bottom Right
		        neighbors.push(gameData[square.x + 1][square.y + 1]);
    		}

    		condition = condition != undefined ? condition : function (s) { return false };

		    return _.reject(neighbors, condition);
		}

		function gameOver(status) {
			timer.stop();

			for (var i = 0; i < size; i++) {
				for (var j = 0; j < size; j++) { 
					var square = gameData[i][j];
					square.element.off();

					if (square.isMine) {
						square.element.addClass('mine');
					}
				}
			}

			if (status == 'win') {
				$('#status').text("\u263B").show();
			} else {
				$('#status').text('\u2620').show();
			}
		}
	}

	function Square (element, x, y) {
		this.x = x;
		this.y = y;
		this.element = element;
		this.isMine = false;
		this.isHidden = true;
		this.isFlagged = false;

		var that = this
		that.element.on('click', function () {
			if (!running) {
				running = true;
				timer.start();
			}

			game.expose(that);
		}).on('contextmenu', function (e) {
			e.preventDefault();
			if (that.isFlagged) {
				that.element.removeClass('flagged').text('');
			} else {
				that.element.text('\u2691').addClass('flagged');			
			}
			that.isFlagged = !that.isFlagged;
		});
	}

	function Timer() {
		var start_time;
		var elapsed = 0;
		this.running = false;

		this.start = function () {
			start_time = new Date().getTime();
			elapsed = 0;
			this.running = true;
			this.run();
		};

		this.run = function () {
			var time = new Date().getTime() - start_time;

			elapsed = Math.floor(time / 1000);
			formatTime(elapsed);

			var that = this;
			setTimeout(function () {
				if (that.running) {
					that.run();
				}
			}, 500);
		};

		this.stop = function () {
			this.running = false;
			elapsed = 0;
		};
	}

	function formatTime(seconds) {
		var min = Math.floor(seconds / 60);
		var	sec = seconds % 60;

		if (sec < 10) {
			sec = '0' + sec;
		}
		if (min < 10) {
			min = '0' + min;
		}

		cur_time = min + ':' + sec;
		$('#timer').text(cur_time);
	};

	$('#game').disableSelection();
}