function swivelGame() {
	var canvas = $('canvas')[0],
		ctx = canvas.getContext('2d'),
		h = 500,
		w = 500,
		animation,
		flips = 0,
		tiles= [];

	canvas.height = h;
	canvas.width = w;

	function Tile(x, y, direction, edge) {
		this.x = x;
		this.y = y;
		this.radius = 10;
		this.direction = direction;
		this.isEdge = edge;

		this.flip = function (flipper) {
			this.direction += 1;
			flips += 1;

			if (this.direction > 4) {
				this.direction = 1;
			}

			var tile = this;
			setTimeout(function () {
				checkNeighbors(tile, flipper);

			}, 70)
		};

		this.draw = function () {

			var startAngle,
				endAngle;

			ctx.fillStyle = '#fff';
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			ctx.fill();
			ctx.shadowBlur = 2;
			ctx.shadowColor = "rgba(0,0,0,0.3)";
			ctx.closePath();

			ctx.beginPath();
			
			if (this.direction == 1) {
				ctx.fillStyle = '#e74c3c';
				startAngle = Math.PI;
				endAngle = Math.PI * 1.5;
			} else if (this.direction == 2) {
				ctx.fillStyle = '#3498db';
				startAngle = Math.PI * 1.5;
				endAngle = Math.PI * 2;
			} else if (this.direction == 3) {
				ctx.fillStyle = '#8e44ad';
				startAngle = Math.PI * 2;
				endAngle = Math.PI * 0.5;
			} else if (this.direction == 4) {
				ctx.fillStyle = '#2ecc71';
				startAngle = Math.PI * 0.5;
				endAngle = Math.PI;
			}
			ctx.arc(this.x, this.y, this.radius, startAngle, endAngle, false);
			ctx.lineTo(this.x, this.y);

			ctx.fill();
			ctx.closePath();

		}

		function checkNeighbors(tile, flipper) {
			var i = _.indexOf(tiles, tile),
				raw_neighbors = [i - 25, i + 1, i + 25, i - 1], // top, right, bottom, left
				neighbors = [];


			_.each(raw_neighbors, function (pos) {
				if (pos < 0 || pos > 624) {
					neighbors.push(false);
				} else {
					neighbors.push(pos);
				}
			});

			if (tile.direction == 1 || tile.direction == 2) {
				if (neighbors[0] && (tiles[neighbors[0]].direction == 3 || tiles[neighbors[0]].direction == 4)) {
					triggerFlip(tiles[neighbors[0]], i);
				}
			}
			if (tile.direction == 3 || tile.direction == 4) {
				if (neighbors[2] && (tiles[neighbors[2]].direction == 1 || tiles[neighbors[2]].direction == 2)) {
					triggerFlip(tiles[neighbors[2]], i);
				}
			}
			if ((tile.direction == 1 || tile.direction == 4) && tile.isEdge != 'left') {
				if (neighbors[3] !== false && (tiles[neighbors[3]].direction == 2 || tiles[neighbors[3]].direction == 3)) {
					triggerFlip(tiles[neighbors[3]], i);
				}
			}
			if ((tile.direction == 2 || tile.direction == 3) && tile.isEdge != 'right') {
				if (neighbors[1] && (tiles[neighbors[1]].direction == 1 || tiles[neighbors[1]].direction == 4)) {
					triggerFlip(tiles[neighbors[1]], i);
				}
			}
		};

		function triggerFlip(tile, flipper) {
				tile.flip(flipper);
		}
	};

	function makeTile(x, y, direction, edge) {
		tiles.push(new Tile(x, y, direction, edge));
	}

	function paintScreen() {
		ctx.clearRect(0,0,w,h);

		_.each(tiles, function (tile) {
			tile.draw();
		});
		
		$('#flips').text("Swivels: " + flips);
	};

	function init() {
		var x = 10,
			y = 10;
		
		for (var i = 0; i < 625; i++) {
			var edge = false;
			if (x > 490) {
				x = 10;
				y += 20;
				edge = 'left';
			} else if (x == 490) {
				edge = 'right';
			}

			makeTile(x, y, randomInt(1, 4), edge);

			x += 20;

		}
		paintScreen();
	};

	init();

	$('canvas').on('click', function (e) {
		var mouseX = e.pageX - canvas.offsetLeft,
			mouseY = e.pageY - canvas.offsetTop;

		_.each(tiles, function (tile, i) {
			if (mouseX > tile.x - tile.radius && mouseX < tile.x + tile.radius &&
				mouseY > tile.y - tile.radius && mouseY < tile.y + tile.radius) {
				tile.flip(i);
			}
		});
	});

	animation = setInterval(paintScreen, 80);


	$('body').disableSelection();
};