function colorWalk() {
	var blocks = [];
	var colors = ['#14b19f', '#0e274e', '#ec5257', '#6c2275', '#f9ac00'];
	var grid_length = 30;
	var grid_height = 20;
	var block_size = 20;
	var moves = 0;
	var dead = 1;

	makeBlocks();

	_.each(colors, function (color) {
		new Control(color);
	});

	$('.close').on('click', function () {
		$('.modal').fadeOut(300);
	});

	function Block(x, y, color, i, isDead) {
		this.x = x;
		this.y = y;
		this.color = color;
		this.position = i;
		this.isDead = isDead;

		this.init = function () {
			$('<div>', {
				id: 'block' + this.position,
				class: "block",
				style: "left:" + this.x + "px; top: " + this.y + 'px; background-color:' + this.color
			}).appendTo('#gameboard');
		};

		this.init();
	}

	function Control(color) {
		this.color = color;

		var that = this;

		this.init = function () {
			$('<div>', {
				class: "control btn",
				style: "background-color:" + this.color
			}).on('click', function (e) {
				updateGameBoard(that);
			}).appendTo('#control_container');
		};

		this.init();

		function updateGameBoard(control) {
			var color = control.color;
			_.each(blocks, function (block) {
				if (block.isDead) {
					getNeighbors(block, color);
				}
			});

			moves += 1;
			$('.score').text(moves);
		}

		function getNeighbors(block, color) {
			var i = block.position;
			var neighbor_positions = [i - 1, i + 1, i - grid_length, i + grid_length];

			if (i % grid_length == 0) {
				neighbor_positions[0] = false;
			} else if (i % grid_length == (grid_length - 1)) {
				neighbor_positions[1] = false;
			}

			neighbor_positions = _.reject(neighbor_positions, function (pos, i) {
				if (pos < 0 || pos > grid_length * grid_height - 1) {
					return true;
				} else if (pos === false) {
					return true;
				}
			});

			checkNeighbors(neighbor_positions, color);
		}

		function checkNeighbors(positions, color) {
			_.each(positions, function (position) {
				var block = blocks[position];
				if (block.color == color && !block.isDead) {
					block.isDead = true;
					$('#block' + position).css('background-color', '#d9d9d9');
					checkIfFinished(block, color);
				}
			});
		}
		
		function checkIfFinished(block, color) {
			var game_continues = _.some(blocks, function (block) {
				return block.isDead == false
			});

			if (game_continues) {
				getNeighbors(block, color);
			} else {
				$('#game_over').fadeIn(300);
			}
		}	

	}

	function makeBlocks() {
		var x = 0;
		var y = 0; 

		blocks = [];
		moves = 0;

		$('#gameboard').html('');
		$('#wrapper').css({
			'width': block_size * grid_length,
			'height': block_size * grid_height
		});
		$('#score').text('Moves: ' + moves);

		_.each(_.range(grid_length * grid_height), function (num) {
			var color = colors[randomInt(0, 4)];
			var dead = false;

			if (num == 0) {
				dead = true;
				color = "#d9d9d9";
			}
			
			blocks.push(new Block(x, y, color, num, dead));

			x += block_size;
			if (x >= grid_length * block_size) {
				y += block_size;
				x = 0;
			}
		});
	};
}


