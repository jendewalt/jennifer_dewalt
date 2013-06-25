function fishyFriend() {
	var canvas = $('canvas')[0],
		ctx = canvas.getContext('2d'),
		h = window.innerHeight,
		w = window.innerWidth,
		fish_left = new Image(),
		fish_right = new Image(),
		mouseX = 0, 
		mouseY = 0,
		bubbles =[];

	canvas.height = h;
	canvas.width = w;

	$(document).on('mousemove', function (e) {
		mouseX = e.pageX;
		mouseY = e.pageY;
	});

	document.addEventListener('touchmove', function(e) {
    	e.preventDefault();

    	mouseX = e.pageX;
		mouseY = e.pageY;
	}, false);

	function Bubble() {
		this.x = randomInt(0, w);
		this.y = randomInt((h + 70), (h + 100));
		this.speed = Math.random() * 2;
		this.size = Math.random() * 6;
	};

	function drawBubble() {
		_.each(bubbles, function (b, i){
			var grd=ctx.createRadialGradient(b.size + b.x, b.size + b.y, b.size*3, b.size + b.x, b.size + b.y, b.size);
			grd.addColorStop(0,"rgba(91,174,252,0.7)");
			grd.addColorStop(.7,"rgba(207,231,254,0.5)");

			ctx.fillStyle = grd;
			ctx.shadowBlur = 2;
			ctx.shadowColor = "rgba(255,255,255, 0.3)"
			ctx.beginPath();
			ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
			ctx.fill();
			
			if (b.y < 0 - b.size * 2) {
				bubbles[i] = new Bubble;
			}
			b.y -= b.speed;
		});
		drawFish();
	};


	function drawFish() {
		if (fish_left.horizontal + 100 > mouseX) {
			ctx.drawImage(fish_left, fish_left.horizontal, fish_left.vertical);						
		} else {
			ctx.drawImage(fish_right, fish_right.horizontal, fish_right.vertical);					
		}


		setTimeout(paintScreen, 50);
	};

	function evolveFish() {
		fish_left.horizontal += (mouseX - fish_left.horizontal - 100) / 40;
		fish_left.vertical += (mouseY - fish_left.vertical - 61.5) / 40;

		fish_right.horizontal += (mouseX - fish_right.horizontal - 100) / 40;
		fish_right.vertical += (mouseY - fish_right.vertical - 61.5) / 40;
		drawBubble();
	};

	function paintScreen() {
		ctx.clearRect(0,0,w,h);
		evolveFish();
	};


	fish_right.onload = function () {
		paintScreen();

		for (var i = 0; i < 40; i++) {
			bubbles.push(new Bubble());
		}
	};
	
	fish_left.horizontal = 0;
	fish_left.vertical = 0;
	fish_right.horizontal = 0;
	fish_right.vertical = 0;

	fish_left.src = '/assets/fishy_friend.png';
	fish_right.src = '/assets/fishy_friend_right.png';


}