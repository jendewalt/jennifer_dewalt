function lightsOn() {
	var lights = [];
	var level = 1;
	var grid_size = 3;
	var moves = 0;

	makeLights();

	$('#start_btn').on('click', function () {
		$('#start').fadeOut(500);
	});

	$('#goto').on('click', function () {
		var input = $.trim($('input').val());

		if (input > 0) {
			level = input;
			grid_size *= input;
			makeLights();
		}
		$('#start').fadeOut(500);
	});

	function Light(x, y, i) {
		this.x = x;
		this.y = y;
		this.radius = 20;
		this.on = false;
		this.position = i;

		this.init = function () {
			var that = this;
			$('<div>', {
				id: 'light' + this.position,
				class: "light off",
				style: "left:" + this.x + "px; top: " + this.y + 'px;'
			}).on('click', function (e) {
				updateGameBoard(e, that);
			}).appendTo('#lights_container');
		};

		this.flip = function () {
			this.on = !this.on;

			if (this.on) {
				$('#light'+this.position).removeClass('off').addClass('on');
			} else {
				$('#light'+this.position).removeClass('on').addClass('off');
			}
		};

		function updateGameBoard(e, light) {
			var i = light.position;
			var neighbors = [i - 1, i + 1, i - grid_size, i + grid_size];

			if (i % grid_size == 0) {
				neighbors[0] = false;
			} else if (i % grid_size == (grid_size - 1)) {
				neighbors[1] = false;
			}

			_.each(neighbors, function (pos, i) {
				if (pos < 0 || pos > grid_size * grid_size - 1) {
					neighbors[i] = false;
				}
			});

			light.flip();
			_.each(neighbors, function (neighbor) {
				if (neighbor !== false) {
					lights[neighbor].flip();
				}
			});

			moves += 1;
			$('#score').text('Moves: ' + moves);

			checkForWin();
		};

		function checkForWin() {
			var lights_off = _.some(lights, function (light) {
				if (light.on == false) {
					return true
				}
			});

			if (!lights_off) {
				updateLevel();
			}
		}

		function updateLevel() {
			level += 1;
			grid_size += 1;
			$('#win h2').text('Level completed in ' + moves + ' moves.');
			$('#level').text('Next Level: ' + level);

			$('#win').fadeIn(500, function () {
				makeLights();
				setTimeout(function () {
					$('#win').fadeOut(500);
				}, 3000);
			});
		}

		this.init();
	}

	function makeLights() {
		var x = 0;
		var y = 0; 
		var size = 45;

		lights = [];
		moves = 0;

		$('#lights_container').html('');
		$('#wrapper').css('width', size * grid_size);

		_.each(_.range(grid_size * grid_size), function (num) {
			lights.push(new Light(x, y, num));

			x += size;
			if (x >= grid_size * size) {
				y += size;
				x = 0;
			}
		});
	}
}