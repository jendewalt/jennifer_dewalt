(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);

$(document).ready(function () {
	var canvas = $('canvas')[0],
		ctx = canvas.getContext('2d'),
		height = window.innerHeight - 40,
		width = window.innerWidth,
		plane = new Image(),
		tree = new Image(),
		time_interval = 30,
		troopers = [],
		arms_up = true,
		acceleration = 0.0001,
		level = 0,
		running = true,
		troopers_left = 5,
		hits = 0,

		island = {
			radius: 40,
			x: width / 2 - 60,
			y: height + 24
		},

		levels = [
		{
			island_width: 100,
			island_offset: 0,
			goal: 2,
			troopers_left: 5
		},
		{
			island_width: 100,
			island_offset: 0,
			goal: 2,
			troopers_left: 5
		},
		{
			island_width: 80,
			island_offset: 120,
			goal: 3,
			troopers_left: 5
		},
		{
			island_width: 80,
			island_offset: 200,
			goal: 5,
			troopers_left: 8
		},
		{
			island_width: 20,
			island_offset: 0,
			goal: 4,
			troopers_left: 8
		},
		{
			island_width: 100,
			island_offset: 200,
			goal: 3,
			troopers_left: 3
		},
		{
			island_width: 70,
			island_offset: 0,
			goal: 6,
			troopers_left: 8
		},
		{
			island_width: 50,
			island_offset: 150,
			goal: 6,
			troopers_left: 8
		},
		{
			island_width: 30,
			island_offset: 50,
			goal: 3,
			troopers_left: 5
		},
		{
			island_width: 20,
			island_offset: 250,
			goal: 4,
			troopers_left: 5
		},
		{
			island_width: 10,
			island_offset: 0,
			goal: 5,
			troopers_left: 5
		}
		];

	canvas.height = height;
	canvas.width = width;

	plane.horizontal = -200;
	plane.vertical = 50;
	plane.v0x = 0.1;

	plane.onload = function () {
		paintScreen();
	};

	plane.src = 'images/plane.png';
	tree.src = 'images/tree.png';

	function paintScreen() {
		checkTroopers();

		ctx.clearRect(0, 0, width, height);
		drawPlane();
		drawTroopers();
		drawIsland();
		evolvePlane();
		evolveTroopers();

		setTimeout(paintScreen, time_interval);
	};

	function drawPlane() {
		ctx.drawImage(plane, plane.horizontal, plane.vertical);
	};

	function evolvePlane() {
		plane.horizontal += plane.v0x*time_interval;

		if (plane.horizontal > width) {
			plane.horizontal = -200;
		}
	};

	function drawIsland() {
		var x_pos = island.x + levels[level].island_offset,
			island_width = levels[level].island_width;
		ctx.fillStyle = '#e88d15';
		ctx.beginPath();
		ctx.arc(x_pos, island.y, island.radius, 1.2 * Math.PI, 1.5 * Math.PI);
		ctx.lineTo(x_pos + island_width, island.y - island.radius);
		ctx.arc(x_pos + island_width, island.y, island.radius, 1.5 * Math.PI, 1.8 * Math.PI);
		ctx.closePath();
		ctx.fill();

		ctx.drawImage(tree, x_pos + island_width - 35, island.y - 155);
	}

	function Trooper(x, y, v0x, v0y) {
		this.x = x;
		this.y = y;
		this.x0 = x;
		this.y0 = y;
		this.v0x = v0x;
		this.v0y = v0y;
		this.time = 0;
	};

	function drawTroopers() {
		_.each(troopers, function (trooper) {
			ctx.fillStyle = '#11240e';
			ctx.beginPath();
			ctx.arc(trooper.x, trooper.y, 4, 0.5 * Math.PI, 2.5 * Math.PI);
			ctx.fill();
			ctx.lineWidth = 1.5;
			ctx.lineTo(trooper.x, trooper.y + 13);
			ctx.lineTo(trooper.x - 4, trooper.y + 25);
			ctx.moveTo(trooper.x, trooper.y + 13);
			ctx.lineTo(trooper.x + 4, trooper.y + 25);
			if (arms_up) {
				ctx.moveTo(trooper.x, trooper.y + 8);
				ctx.lineTo(trooper.x + 8, trooper.y + 7);
				ctx.moveTo(trooper.x, trooper.y + 8);
				ctx.lineTo(trooper.x - 8, trooper.y + 7);
			} else {
				ctx.moveTo(trooper.x, trooper.y + 8);
				ctx.lineTo(trooper.x + 7, trooper.y + 14);
				ctx.moveTo(trooper.x, trooper.y + 8);
				ctx.lineTo(trooper.x - 7, trooper.y + 14);	
			}
			ctx.strokeStyle = '#11240e';
			ctx.stroke();
			ctx.closePath();
		});
	};

	function evolveTroopers() {
		_.each(troopers, function (trooper) {
			trooper.x = trooper.x0 + trooper.v0x * trooper.time;
			trooper.y = trooper.y0 + 0.5 * acceleration * Math.pow(trooper.time, 2);
			trooper.time += time_interval;
		});
	};

	function checkTroopers() {
		_.each(troopers, function (trooper) {
			if (trooper.y > height + 20) {
				troopers.splice(trooper, 1);
			}
			if (trooper.y >=  height - 15 && running) {
				var x_pos = island.x + levels[level].island_offset;
				if (trooper.x > x_pos - 20 && trooper.x < x_pos + levels[level].island_width + 20) {
					hits += 1;
					troopers.splice(trooper, 1);
				}
			}
		});

		updateStats();

		if (hits >= levels[level].goal && running) {
			troopers_left = levels[level].troopers_left;
			running = false;

			if (level == 10) {
				winGame();
			} else {
				updateInfo();
			}

			$('#info').show();
		}
		if (troopers_left == 0 && troopers.length == 0 && running) {
			running = false;
			level = 0;
			$('#stats_container').hide();
			$('#game_over').show();
		}
	}

	function updateInfo() {
		$('#info h1').text('Excellent Work!');
		$($('#info h2')[0]).text('Next Level: ' + (level + 1));
		$($('#info h2')[1]).text('');
	}

	function winGame() {
		$('#info h1').text('You Won!');
		$($('#info h2')[0]).text('Mission Accomplished!');
		$($('#info h2')[1]).text('A satisfactory number of the paratroopers made it to vacation alive.');
		$('button').remove();
		$('<a>', {
			href: 'paratroopers.html',
			text: 'Play Again?'
		}).appendTo('#info .inner_modal');
	}

	function updateStats() {
		$('.troopers').text('Troopers: ' + troopers_left);
		$('.hits').text('Hits: ' + hits);
		$('.goal').text('Goal: ' + levels[level].goal);
	}

	$(document).on('keypress', function (e) {
		if (e.charCode == 32 && troopers_left != 0 && running) {
			troopers_left--;
			troopers.push(new Trooper(plane.horizontal + 115, plane.vertical + 60, plane.v0x, 0));
		}
	});

	$('#start').on('click', function () {
		$('#stats_container').show();
		level++;
		troopers_left = levels[level].troopers_left;
		hits = 0;

		$('#info').hide();

		running = true;
	});

	setInterval(function () { arms_up = !arms_up; }, 70)
	
	$('body').disableSelection();

});











