function algaeTank() {
	var canvas = $('canvas')[0],
		ctx = canvas.getContext('2d'),
		h = 550,
		w = 900,
		cell_size = 10,
		cells = [],
		animation = null;

	canvas.height = h;
	canvas.width = w;

	function Cell(x, y) {
		this.x = x;
		this.y = y;
		this.state = 'dead';

		this.draw = function () {
			ctx.beginPath();

			if (this.state == 'alive') {
				ctx.fillStyle = '#1bbd61';
			} else {
				ctx.fillStyle = '#e8effa'
			}

			ctx.strokeStyle = '#d3e0f5';
			ctx.fillRect(this.x, this.y, cell_size, cell_size);
			ctx.strokeRect(this.x, this.y, cell_size, cell_size);
			ctx.closePath();
		}
	};

	function init() {
		var pos_x = 0;
		var pos_y = 0;

		for (var i = 0; i < h * w / Math.pow(cell_size, 2); i++) {
			cells.push(new Cell(pos_x, pos_y));

			pos_x += cell_size;
			if (pos_x % w / cell_size == 0) {
				pos_x = 0;
				pos_y += cell_size;
			}
		}

		_.each(cells, function (cell) {
			cell.draw();
		});

		$('#run').removeClass('disable').addClass('start');

		$('#run').on('click', function () {
			$('#run').removeClass('start').addClass('disable');
			evolveGame();
			$('#run').off();
		});
	};

	function evolveGame() {
		var new_cells = [];

		_.each(cells, function (cell, i) {
			var neighbors = getNeighbors(cell.x, i);
			var new_cell = $.extend({}, cell, new_cell);
			var live_neighbors = 0;

			_.each(neighbors, function (neighbor) {
				if (neighbor.state == 'alive') {
					live_neighbors += 1;
				}
			});

			if (new_cell.state == 'alive') {
				if (live_neighbors < 2 || live_neighbors > 3) {
					new_cell.state = 'dead';
				}
			} else {
				if (live_neighbors == 3) {
					new_cell.state = 'alive';
				}
			}

			new_cells.push(new_cell);

		});

		cells = new_cells;

		animation = setTimeout(paintScreen, 40);
	};

	function getNeighbors(x, index) {
		var neighbors = [cells[index + 1], cells[index - 1], 									//right, left
						 cells[index + w / cell_size], cells[index - w / cell_size],			//bottom, top
						 cells[index + w / cell_size + 1], cells[index - w / cell_size + 1],	//bottom right, top right
						 cells[index + w / cell_size - 1], cells[index - w / cell_size - 1]];	//bottom left, top left

		if(x == 0) {
			neighbors[1] = undefined;
			neighbors[6] = undefined;
			neighbors[7] = undefined;
		} else if (x == w - cell_size) {
			neighbors[0] = undefined;
			neighbors[4] = undefined;
			neighbors[5] = undefined;
		}

		neighbors = _.reject(neighbors, function (neighbor) {
			return neighbor == undefined;
		});

		return neighbors;
	};

	function paintScreen() {
		ctx.clearRect(0,0,w,h);

		_.each(cells, function (cell) {
			cell.draw();
		});

		evolveGame();
	};

	function selectCell(x, y) {
		_.each(cells, function (cell) {
			if (x > cell.x && x < cell.x + cell_size && 
				y > cell.y && y < cell.y + cell_size ) {
				cell.state = 'alive';

				cell.draw();
			}
		});
	};

	init();

	$('body').on('mousedown', function (e) {
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;
		selectCell(x, y);

		$('canvas').on('mousemove', function (e) {
			var x = e.pageX - canvas.offsetLeft;
			var y = e.pageY - canvas.offsetTop;

			selectCell(x, y);
		});

		$('body').on('mouseup', function () {
			$('canvas').off();
		});
	});

	$('.reset').on('click', function () {
		clearTimeout(animation);
		cells = [];
		init();
	});

	$('body').disableSelection();
};









