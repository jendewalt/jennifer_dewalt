function splodinBacon() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var height = window.innerHeight;
	var width = window.innerWidth;
	var bacon_full = new Image;
	var bacon_top_left = new Image;
	var bacon_top_right = new Image;
	var bacon_bottom_left = new Image;
	var bacon_bottom_right = new Image;
	var bacons = [];
	var bacon_parts = [];
	var flashes = [];
	
	canvas.width = width;
	canvas.height = height;

	setInterval(function () {
		if (bacons.length < 20) {
			makeBacon();
		}
	}, randomInt(50, 2000));

	function makeBacon() {
		bacons.push(new Bacon());
	};

	function Bacon() {
		this.x = randomInt(0, width);
		this.y = -145;
		this.vy = randomInt(2,5);

		this.draw = function () {
			ctx.drawImage(bacon_full, this.x, this.y);
			this.y += this.vy;
		}
	};

	function paintScreen() {
		ctx.clearRect(0,0,width,height);
		_.each(bacons, function (bacon, i) {
			bacon.draw();

			if (bacon.y > height) {
				bacons[i] = new Bacon();
			}
		});

		_.each(bacon_parts, function (part) {
			part.draw();	
		});

		_.each(flashes, function (flash) {
			flash.draw();	
		});

		bacon_parts = _.reject(bacon_parts, function (part) {
			return (part.x < -30 || part.x > width || part.y < -145 || part.y > height);
		});

		flashes = _.reject(flashes, function (flash) {
			return flash.time <= 0;
		});

		requestAnimFrame(paintScreen);
	};

	function BaconPart(x, y, img) {
		this.x = x;
		this.y = y;
		this.vx = randomInt(-20, 20);
		this.vy = randomInt(-20, 20);

		this.draw = function () {
			ctx.drawImage(img, this.x, this.y);

			this.x += this.vx;
			this.y += this.vy;
		}
	}


	$('canvas').on('click', function (e) {
		var mouse_x = e.pageX;
		var mouse_y = e.pageY;

		_.each(bacons, function (bacon, i) {
			if (mouse_x > bacon.x && mouse_x < bacon.x + 30 && 
				mouse_y > bacon.y && mouse_y < bacon.y + 144) {

				bacon_parts.push(new BaconPart(bacon.x, bacon.y, bacon_top_left));
				bacon_parts.push(new BaconPart(bacon.x + 15, bacon.y, bacon_top_right));
				bacon_parts.push(new BaconPart(bacon.x, bacon.y + 72, bacon_bottom_left));
				bacon_parts.push(new BaconPart(bacon.x + 15, bacon.y + 72, bacon_bottom_right));

				flashes.push(new Flash(mouse_x, mouse_y));

				bacons[i] = new Bacon();
			}
		});
	});

	function Flash(x, y) {
		this.x = x;
		this.y = y;
		this.time = 10;

		this.draw = function () {
			ctx.fillStyle = 'rgba(255,219,74, 0.5)';
			ctx.beginPath();
			ctx.arc(this.x, this.y, 40, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();

			ctx.beginPath();
			ctx.fillStyle = '#ffcc00';
			ctx.arc(this.x, this.y, 30, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();

			ctx.beginPath();
			ctx.fillStyle = '#ff7b00';
			ctx.arc(this.x, this.y, 20, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();

			ctx.beginPath();
			ctx.fillStyle = '#e00000';
			ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();

			ctx.beginPath();
			ctx.fillStyle = '#1e00ff';
			ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();
			
			this.time -= 1;
		}
	};

	paintScreen();

	bacon_full.src = '/assets/bacon_full.png';
	bacon_top_left.src = '/assets/bacon_1.png';
	bacon_top_right.src = '/assets/bacon_2.png';
	bacon_bottom_left.src = '/assets/bacon_3.png';
	bacon_bottom_right.src = '/assets/bacon_4.png';

};