function plinky() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var height = 600;
	var width = 400;
	var pegs = [];
	var wins = [];
	var acceleration = 10;

	canvas.height = height;
	canvas.width = width;

	var disk = {
		radius: 14,
		x: 14,
		y: 14,
		vx: 0,
		vy: 0,
		color: '#51bdfc',
		tracking: true,

		draw: function () {
			ctx.beginPath();
			ctx.fillStyle = disk.color;
			ctx.arc(disk.x, disk.y, disk.radius, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();
		}
	}

	function Peg(x, y) {
		this.x = x,
		this.y = y,
		this.radius = 2,
		this.color = 'white',

		this.draw = function () {
			ctx.beginPath();
			ctx.fillStyle = this.color;
			ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();
		}
	}

	function makePegs() {
		var pos_x = 0;
		var pos_y = 100;
		var even_row = true;

		_.each(_.range(105), function (num) {
			pegs.push(new Peg(pos_x, pos_y));

			pos_x += 40;

			if (pos_x > 400) {
				pos_y += 40;
				pos_x = even_row ? 20 : 0;
				even_row = !even_row;
			}
		});	
	} 

	function ResultBin(x, y, width, result) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.result

		if (result == 'win') {
			this.color = "#35d49a";
		} else {
			this.color = "#d42a2a"
		}

		this.draw = function () {
			ctx.beginPath();
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x,this.y,this.width,height);
			ctx.fill();
			ctx.closePath();
		};
	}

	function makeWins () {
		var y = height - 15;
		var w = 50;

		wins.push(new ResultBin(75, y, w, 'win'));
		wins.push(new ResultBin(175, y, w, 'win'));
		wins.push(new ResultBin(275, y, w, 'win'));
	}

	function evolveDisk(delta_time) {
		disk.vy += acceleration * delta_time / 1000;
		disk.x += disk.vx;
		disk.y += disk.vy;

		_.each(pegs, function (peg) {
			var distance = Math.sqrt(Math.pow(disk.x - peg.x, 2) + Math.pow(disk.y - peg.y, 2));

			if (distance <= disk.radius) {
				var vx_temp = disk.vx;
				var vy_temp = disk.vy;
				var r = disk.radius;
				var delta_x = (disk.x - peg.x) / distance * r;
				var delta_y = (disk.y - peg.y) / distance * r;

				disk.x = peg.x + delta_x * 1.05;
				disk.y = peg.y + delta_y * 1.05;

				disk.vx = -0.7 * (vx_temp * delta_x * delta_x / (r*r) + vy_temp * delta_x * delta_y / (r*r));
				disk.vy = -0.7 * (vy_temp * delta_y * delta_y / (r*r) + vx_temp * delta_x * delta_y / (r*r));
			}
		});

		if (disk.y > height + disk.radius) {
			disk.tracking = true;
			disk.y = disk.radius;
			disk.vx = 0;
			disk.vy = 0;

			_.each(wins, function (win) {
				if (disk.x > win.x && disk.x < win.x + win.width) {
					$('#win').fadeIn(500);

					setTimeout(function () {
						$('#win').fadeOut(500);
					}, 2000);
				} 
			});

			$('canvas').on('mousemove', function (e) {
				var mouse_x = e.pageX - canvas.offsetLeft;

				disk.x = mouse_x;
			});	
		}
	}

	function animate(last_time) {
		var date = new Date();
        var time = date.getTime();
        var delta_time = time - last_time;

		ctx.clearRect(0,0,width,height);

		ctx.fillStyle = '#d42a2a';
		ctx.fillRect(0, height - 15, width, height);

		_.each(pegs, function (peg) {
			peg.draw();
		});

		_.each(wins, function (bin) {
			bin.draw();
		});

		disk.draw();

		if (!disk.tracking) {
			evolveDisk(delta_time)
		}

		requestAnimFrame(function () {
			animate(time);
		});	
	}

	var date = new Date();
    var time = date.getTime();
	
	makePegs();
	makeWins();
    animate(time);


	$('canvas').on('mousemove', function (e) {
		var mouse_x = e.pageX - canvas.offsetLeft;

		disk.x = mouse_x;
	});	
	
	$('canvas').on('click', function () {
		$('canvas').off('mousemove');

		if (disk.tracking) {
			disk.tracking = false;
		}
	});

}