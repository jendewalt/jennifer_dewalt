function globulator() {
	var canvas = $('canvas')[0],
		ctx = canvas.getContext('2d'),
		width = window.innerWidth,
		height = window.innerHeight,
		globs = [],
		stationary = true,
		r_min = 5,
		mousedown_coodinates = {x: 0, y: 0};

	var selectedGlob = null;

	canvas.height = height;
	canvas.width = width;

	function Glob(x, y, radius, color) {
		this.opacity = 0.9 / (color.l + 1);
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
		this.tracking = false;

		this.volume = function () {
			return (Math.PI * this.radius) * ((Math.PI * r_min * r_min)/4 + r_min * (this.radius - r_min));
		};

		this.trackMouse = function (x, y) {
			if (this.tracking) {
				this.x = x;
				this.y = y;
			}
		};

		this.draw = function () {
			ctx.beginPath();
			ctx.fillStyle = 'hsl(' + this.color.h + ',' + this.color.s + '%, ' + this.color.l + '%)';
			ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			ctx.fill();

			ctx.strokeStyle = 'rgba(0,0,0, ' + this.opacity + ')';
			ctx.lineWidth = 2;
			ctx.stroke();
			ctx.closePath();
			
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius - 2, 0, 2 * Math.PI);
			ctx.strokeStyle = 'rgba(0,0,0, ' + this.opacity + ')';
			ctx.lineWidth = 4;
			ctx.stroke();
			ctx.closePath();

			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius - 3, 0, 2 * Math.PI);
			ctx.strokeStyle = 'rgba(0,0,0, ' + this.opacity + ')';
			ctx.lineWidth = 5;
			ctx.stroke();
			ctx.closePath();
		};
		this.drag = function (x, y) {
			this.x = x;
			this.y = y;
		};
	};

	function makeGlob(x, y, radius, color) {
		globs.push(new Glob(x, y, radius, color));
	};

	function paintScreen() {
		ctx.clearRect(0,0,width,height);
		_.each(globs, function (glob) {
			glob.draw();
		});

		requestAnimFrame(paintScreen);
	};

	function checkIfGlobGrabbed(x, y) {
		_.each(globs, function (glob) {
			if (x > glob.x - glob.radius && x < glob.x + glob.radius && 
				y > glob.y - glob.radius && y < glob.y + glob.radius) {

				selectedGlob = glob;
				selectedGlob.tracking = true;			
			}
		});

		return null;
	};

	function combinedRadius(v1, v2) {
		var A = Math.PI * r_min;
		var B = Math.PI * Math.PI * r_min * r_min / 4 - Math.PI * r_min * r_min;
		var C = -v1 - v2;

		return ((-B + Math.pow(B * B - 4 * A * C, 0.5)) / (2 * A))
	};

	function newPosition(glob_1, glob_2) {
		var vt = glob_1.volume() + glob_2.volume();
		var xf = glob_1.volume() / vt * glob_1.x + glob_2.volume() / vt * glob_2.x;
		var yf = glob_1.volume() / vt * glob_1.y + glob_2.volume() / vt * glob_2.y;

		return {x: xf, y: yf};
	};

	function newColor(glob_1, glob_2) {
		var vt = glob_1.volume() + glob_2.volume();
		var hue = (glob_1.color.h + glob_2.color.h) % 360;
		var sat = (glob_1.volume() / vt * glob_1.color.s + glob_2.volume() / vt * glob_2.color.s);
		var light = (glob_1.volume() / vt * glob_1.color.l + glob_2.volume() / vt * glob_2.color.l);


		return {h: hue, s: sat, l: light};
	}

	function checkIfGlobCombined() {
		var new_radius;
		var new_position;
		var new_color;

		globs = _.reject(globs, function (glob) {
			var distance = Math.sqrt(Math.pow(selectedGlob.x - glob.x, 2) + Math.pow(selectedGlob.y - glob.y , 2));
			if (selectedGlob != glob &&	distance < selectedGlob.radius + glob.radius - 4) {

				new_radius = combinedRadius(selectedGlob.volume(), glob.volume());
				new_position = newPosition(selectedGlob, glob);
				new_color = newColor(selectedGlob, glob);
				
				return true;
			}
		});

		if (new_radius) {
			selectedGlob.x = new_position.x;
			selectedGlob.y = new_position.y;
			selectedGlob.radius = new_radius;
			selectedGlob.color = new_color;
			selectedGlob.opacity = 0.9 / (new_color.l + 1);
		}
		
	}

	$('canvas').on('mousedown', function (e) {
		mouse_x = e.pageX - canvas.offsetLeft;
		mouse_y = e.pageY - canvas.offsetTop;

		checkIfGlobGrabbed(mouse_x, mouse_y);
		stationary = true;
		mousedown_coodinates = {x: mouse_x, y: mouse_y};
	});

	$('canvas').on('mousemove', function (e) {
		mouse_x = e.pageX - canvas.offsetLeft;
		mouse_y = e.pageY - canvas.offsetTop;

		if (Math.abs(mousedown_coodinates.x - mouse_x) > 10 || Math.abs(mousedown_coodinates.y - mouse_y) > 10) {
			stationary = false;
		}

		if (selectedGlob) {
			selectedGlob.trackMouse(mouse_x, mouse_y);

			checkIfGlobCombined();
		}
	});

	$('canvas').on('mouseup', function (e) {
		if (selectedGlob) {
			selectedGlob.tracking = false;
			selectedGlob = null;
		}
	});

	$('canvas').on('click', function (e) {
		var inside_circle = false,
			mouse_x = e.pageX - canvas.offsetLeft,
			mouse_y = e.pageY - canvas.offsetTop;

		_.each(globs, function (glob) {
			if (mouse_x > glob.x - glob.radius && mouse_x < glob.x + glob.radius && 
				mouse_y > glob.y - glob.radius && mouse_y < glob.y + glob.radius) {

				inside_circle = true;
			}
		});

		if (stationary && !inside_circle) {
			makeGlob(mouse_x, mouse_y, randomInt(5, 50), randomColorHSL());		
		}
	});

	paintScreen();

	$('body').disableSelection();

};








