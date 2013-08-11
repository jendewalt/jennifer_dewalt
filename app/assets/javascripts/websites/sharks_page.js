function sharks() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var height = window.innerHeight;
	var width = window.innerWidth;
	var screen_center = {x: width/2, y: height/2};
	var time_prime = 1000;
	var sharks = [];
	var sources = ['/assets/shark_0.png', '/assets/shark_1.png', '/assets/shark_2.png', '/assets/shark_3.png', '/assets/shark_4.png']

	canvas.height = height;
	canvas.width = width;

	function Shark(x_prime, y_prime, img_src) {
		var shark_img = new Image;

		this.x_prime = x_prime;
		this.y_prime = y_prime;
		this.img = shark_img;
		this.time = 1;
		this.x = screen_center.x;
		this.y = screen_center.y;

		var that = this;

		shark_img.onload = function () {
			that.height = shark_img.height;
			that.width = shark_img.width;
		}

		this.draw = function () {
			var scale = 0.005 * this.time;
			var cur_width = this.width * scale;
			var cur_height = this.height * scale;
			var offset_x = cur_width / 2;
			var offset_y = cur_height / 2;

			this.time += 2;
			this.x = screen_center.x + (this.x_prime / 10000) * Math.pow(this.time, 2);
			this.y = screen_center.y + (this.y_prime / 10000) * Math.pow(this.time, 2);
			
			ctx.drawImage(this.img, this.x - offset_x, this.y - offset_y, cur_width, cur_height);
		}
		shark_img.src = img_src;
	} 

	function makeShark(x_prime, y_prime, img_src) {
		sharks.push(new Shark(x_prime, y_prime, img_src));
	}

	function checkSharks() {
		_.each(sharks, function (shark) {
			if (shark.x > width * 2 || shark.x < 0 - shark.width ||
				shark.y > height * 2 || shark.y < 0 - shark.height) {
				
				var angle = Math.random() * Math.PI * 2;
				var x = Math.cos(angle) * height * 0.2;
				var y = Math.sin(angle) * height * 0.2;

				shark.x_prime = x;
				shark.y_prime = y;
				shark.time = 1;
				shark.img.src = sources[randomInt(0, sources.length - 1)];
				shark.x = screen_center.x;
				shark.y = screen_center.y;
			}
		});
		requestAnimFrame(paintScreen);
	}

	function paintScreen() {
		ctx.clearRect(0,0,width, height);
		
		_.each(sharks, function (shark) {
		 	shark.draw();
		});
		checkSharks();
	}

	function addSharks() {
		if (sharks.length < 12) {
			var angle = Math.random() * Math.PI * 2;
			var x = Math.cos(angle) * height * 0.2;
			var y = Math.sin(angle) * height * 0.2;

			makeShark(x, y, sources[randomInt(0, sources.length - 1)]);
		}
		setTimeout(addSharks, randomInt(500, 2000));
	}

	addSharks();
	
	paintScreen();
}