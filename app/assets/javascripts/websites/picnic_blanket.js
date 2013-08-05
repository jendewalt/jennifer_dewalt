function picnic() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var width = window.innerWidth;
	var height = window.innerHeight;
	var bugs = [];
	var squishes = [];
	var num_bugs = 30;
	var mouse = {
		x: width / 2,
		y: height / 2
	}

	canvas.height = height;
	canvas.width = width;

	function Bug(x, y) {
		this.x = x;
		this.y = y;
		this.radius = 10;
		this.color = '#222222';
		this.vx = (Math.random() - 0.5) * 4;
		this.vy = (Math.random() - 0.5) * 4;
		this.legs_in = randomInt(0, 1);

		this.draw = function () {
			var c = this.legs_in ? 1.63 : 1.75;
			ctx.fillStyle = this.color;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();

			ctx.beginPath();
			ctx.lineWidth = 3;
			ctx.moveTo(this.x, this.y);
			ctx.lineTo(this.x + this.radius * c, this.y);
			ctx.moveTo(this.x, this.y);
			ctx.lineTo(this.x - this.radius * c, this.y);

			ctx.moveTo(this.x, this.y);
			ctx.lineTo(this.x + this.radius * c, this.y + this.radius * 0.65);
			ctx.moveTo(this.x, this.y);
			ctx.lineTo(this.x - this.radius * c, this.y + this.radius * 0.65);

			ctx.moveTo(this.x, this.y);
			ctx.lineTo(this.x + this.radius * c, this.y - this.radius * 0.65);
			ctx.moveTo(this.x, this.y);
			ctx.lineTo(this.x - this.radius * c, this.y - this.radius * 0.65);
			ctx.strokeStyle = this.color;
			ctx.stroke();
			ctx.closePath();

			ctx.beginPath();
			ctx.fillStyle = 'white'
			ctx.arc(this.x + this.radius*0.4, this.y + this.radius*0.5, this.radius * 0.2, 0, 2 * Math.PI);
			ctx.arc(this.x - this.radius*0.4, this.y + this.radius*0.5, this.radius * 0.2, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();

			this.legs_in = !this.legs_in;
		}
	}

	function makeBugs() {
		_.each(_.range(num_bugs), function (num) {
			bugs.push(new Bug(randomInt(0, width), randomInt(0, height), '#222222'));
		});
	}

	function evolveBugs() {
		_.each(bugs, function (bug) {
			var delta_x = bug.x - mouse.x;
			var delta_y = bug.y - mouse.y;
			var mouse_dist = Math.sqrt(Math.pow(delta_x, 2) + Math.pow(delta_y, 2));
			var force_range = 50;
			var mouse_vy = delta_y/mouse_dist * force_range;
			var mouse_vx = delta_x/mouse_dist * force_range;

			bug.vx += mouse_vx / Math.pow(mouse_dist, 1.6);
			bug.vy += mouse_vy / Math.pow(mouse_dist, 1.6);

			bug.x += bug.vx;
			bug.y += bug.vy;

			_.each(bugs, function (other_bug) {
				var dx = bug.x - other_bug.x;
				var dy = bug.y - other_bug.y;
				var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy , 2));
			
				if (bug != other_bug && distance < bug.radius + other_bug.radius) {
					var bvx = bug.vx;
					var bvy = bug.vy;

					bug.vx = other_bug.vx;
					bug.vy = other_bug.vy;

					other_bug.vx = bvx;
					other_bug.vy = bvy;
				}
			});

			if (bug.x < bug.radius * -2) {
				bug.x = bug.radius * -2;
				bug.vx = Math.random() * 2;
				bug.vy = (Math.random() - 0.5) * 4;
			}
			
			if (bug.x > width + bug.radius * 2) {
				bug.x = width + bug.radius * 2;
				bug.vx = -1 * Math.random() * 2;
				bug.vy = (Math.random() - 0.5) * 4;
			} 
			if (bug.y < bug.radius * -2) {
				bug.y = bug.radius * -2;
				bug.vx = (Math.random() - 0.5) * 4;
				bug.vy = Math.random() * 2;
			}
			if (bug.y > height + bug.radius * 2) {
				bug.y = height + bug.radius * 2;
				bug.vx = (Math.random() - 0.5) * 4;
				bug.vy = -1 * Math.random() * 2;
			}
		});

		setTimeout(paintScreen, 40);
	}

	function Squish(x, y) {
		this.time = 0;
		this.x = x - 10;
		this.y = y - 10;

		this.draw = function () {
			ctx.beginPath();
			ctx.fillStyle = "rgba(0,0,0,0.75)"
			ctx.moveTo(this.x, this.y);
			// Subtractions to adjust for offset in generator. Needs to be caluclated out after finalized in future.
			ctx.bezierCurveTo(76 - (77) + this.x, 87 - (94) + this.y, 80 - (77) + this.x, 80 - (94) + this.y, 90 - (77) + this.x, 86 - (94) + this.y);
			ctx.bezierCurveTo(96 - (77) + this.x, 90 - (94) + this.y, 98 - (77) + this.x, 90 - (94) + this.y, 103 - (77) + this.x, 83 - (94) + this.y);
			ctx.bezierCurveTo(120 - (77) + this.x, 78 - (94) + this.y, 104 - (77) + this.x, 90 - (94) + this.y, 122 - (77) + this.x, 91 - (94) + this.y);
			ctx.bezierCurveTo(134 - (77) + this.x, 100 - (94) + this.y, 120 - (77) + this.x, 108 - (94) + this.y, 106 - (77) + this.x, 100 - (94) + this.y);
			ctx.bezierCurveTo(100 - (77) + this.x, 104 - (94) + this.y, 107 - (77) + this.x, 117 - (94) + this.y, 89 - (77) + this.x, 104 - (94) + this.y);
			ctx.bezierCurveTo(75 - (77) + this.x, 110 - (94) + this.y, 65 - (77) + this.x, 103 - (94) + this.y, this.x, this.y);
			ctx.fill();

			this.time += 1;			
		}
	}

	function evolveSquishes() {
		squishes = _.reject(squishes, function (squish) {
			if (squish.time > 20) {
				return true;
			}
		});
	}

	function paintScreen() {
		ctx.clearRect(0,0,width, height);

		_.each(squishes, function (squish) {
			squish.draw();
		});
		_.each(bugs, function (bug) {
			bug.draw();
		});
		
		evolveBugs();
		evolveSquishes();
	}

	makeBugs();
	paintScreen();

	$('body').on('mousemove', function (e) {
		mouse.x = e.pageX - canvas.offsetLeft;
		mouse.y = e.pageY - canvas.offsetTop;
	});

	$('canvas').on('click', function (e) {
		mouse.x = e.pageX - canvas.offsetLeft;
		mouse.y = e.pageY - canvas.offsetTop;

		bugs = _.reject(bugs, function (bug) {
			var dx = bug.x - mouse.x;
			var dy = bug.y - mouse.y;
			
			if (dx*dx + dy*dy <= 5 * bug.radius * bug.radius) {
				squishes.push(new Squish(bug.x, bug.y));
				return true;
			}
		});
		
		if (bugs.length < 30) {
			var new_y = randomInt(0, 1) ? 0 : height + 10 * 2;
			var new_x = randomInt(0, 1) ? 0 : width + 10 * 2;

			bugs.push(new Bug(new_y, new_x));
		}
	});

	$('body').disableSelection();
}