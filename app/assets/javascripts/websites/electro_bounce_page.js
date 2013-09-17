function electroBounce() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var height = window.innerHeight;
	var width = window.innerWidth;
	var nodes = [];
	var picker = '#ffffff';
	var monochrome;
	var distance;
	var speed;
	var line_width;
	var timeout;

	canvas.height = height;
	canvas.width = width;

	initNodes();
	paintScreen();

	$('canvas').on('click', function (e) {
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;
		var color = monochrome ? '#' + picker : randomColorHex();

		nodes.push(new Node(x, y, color));
	});

	$('body').on('mousemove', function () {
		clearTimeout(timeout);
		$('#control_container').show();

		timeout = setTimeout(function () {
			$('#control_container').fadeOut(500);
		}, 5000);
	});

	$('#control_container').on('click', function () {
		clearTimeout(timeout);
	});

	$('#reset').on('click', function () {
		nodes = [];
		initNodes();
	});

	$('.speed').on('click', function () {
		speed *= this.id == 'speed_inc' ? 1.1 : 0.9;
	});

	$('.dist').on('click', function () {
		distance += this.id == 'dist_inc' ? 10 : -10;

		distance = distance > 0 ? distance : 0;
	});

	$('.width').on('click', function () {
		line_width += this.id == 'width_inc' ? 1 : -1;

		line_width = line_width > 1 ? line_width : 1;
	});

	$('#color_toggle').on('click', function () {
		if (monochrome) {
			monochrome = false;

			_.each(nodes, function (node) {
				node.color = randomColorHex();
			});
			$('#color_toggle').text('GO MONO');
			$('#color_picker').hide();
		} else {
			monochrome = true;

			_.each(nodes, function (node) {
				node.color = picker;
			});

			$('#color_toggle').text('GO MULTI');
			$('#color_picker').show();
		}
	});

	$('.picker').on('change', function () {
		picker = '#' + this.value;

		_.each(nodes, function (node) {
			node.color = picker;
		});
	});

	$('body').disableSelection();

	function initNodes() {
		var y = Math.random() * canvas.height;
		var color = randomColorHex();
		var x = Math.random() * canvas.width;

		if (nodes.length == 0) {
			if (monochrome) {
				monochrome = false;

				_.each(nodes, function (node) {
					node.color = randomColorHex();
				});
				$('#color_toggle').text('GO MONO');
				$('#color_picker').hide();
			}			

			distance = 150;
			speed = 1;
			line_width = 1;
		}

		nodes.push(new Node(x, y, color));

		if (nodes.length < 30) {
			initNodes();
		}
	}

	function Node(x, y, color) {
		this.x = x;
		this.y = y;
		this.vx = randomInt(-2, 2);
		this.vy = randomInt(-2, 2);
		this.color = color;

		this.draw = function () {
			var node = this;

			_.each(nodes, function (other_node) {
				dx = node.x - other_node.x;
				dy = node.y - other_node.y;
				dist = Math.sqrt(dx * dx + dy * dy);

				if (dist < distance) {
					ctx.beginPath();
					ctx.strokeStyle = node.color;
					ctx.lineWidth = line_width;
					ctx.lineCap = 'round';
					ctx.moveTo(node.x, node.y);
					ctx.lineTo(other_node.x, other_node.y);
					ctx.stroke();
					ctx.closePath();
				}
			});

			this.evolve();
		};

		this.evolve = function () {
			if (this.x >= canvas.width || this.x <= 0) {
				this.vx *= -1;
			}
			if (this.y >= canvas.height || this.y <= 0) {
				this.vy *= -1;
			}

			this.x += this.vx * speed;
			this.y += this.vy * speed;
		}
	}

	function paintScreen() {
		ctx.fillStyle = 'rgba(0,0,0,0.3)';
		ctx.fillRect(0,0,canvas.width, canvas.height);

		_.each(nodes, function (node) {
			node.draw();
		});

		requestAnimFrame(paintScreen);
	}
}
