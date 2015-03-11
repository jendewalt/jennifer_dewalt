$(document).ready(function () {
	var canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d'),
		h = window.innerHeight,
		w = window.innerWidth,
		bubbles = [];

	canvas.height = h;
	canvas.width = w;

	init();

	$('button').on('click', function (e) {
		e.stopPropagation();
		for (var i = 0; i < 10; i++) {
			bubbles.push(new Bubble());
		}
		// [Bug fix: 03.11.2015] Original code was prompting for download.
		// $('#sound').html("<embed src='audio/bubbles.wav' hidden=true autostart=true loop=false>");
		document.getElementById('sound').innerHTML="<audio autoplay><source src='audio/bubbles.wav' type='audio/wav'></audio>";

	})

	$('#canvas').on('click', function(e) {
		var clickX = e.pageX;
		var clickY = e.pageY;

		_.each(bubbles, function(b, i) {
			if ((clickX < b.x + b.size && clickX > b.x - b.size) && (clickY < b.y + b.size && clickY > b.y - b.size)) {
				b.pop(i);
			}
		});
	});

	function init() {
		for (var i = 0; i < 20; i++) {
			bubbles.push(new Bubble());
		}
		makeBubble();
	};

	function Bubble() {
		this.x = randomInt(65, (w-65));
		this.y = randomInt((h + 70), (h + 100));
		this.speed = Math.random() * 2;
		this.size = Math.random() * 60 + 5;

		this.pop = function (i) {
			// [Bug fix: 03.11.2015] Original code was prompting for download.
			// $('#sound').html("<embed src='audio/pop.wav' hidden=true autostart=true loop=false>");
			document.getElementById('sound').innerHTML="<audio autoplay><source src='audio/pop.wav' type='audio/wav'></audio>";
			bubbles[i] = new Bubble();
		}
	};

	function makeBubble() {
		ctx.clearRect(0,0,w,h);
		_.each(bubbles, function (b, i){
			var grd=ctx.createRadialGradient(b.size + b.x, b.size + b.y, b.size*3, b.size + b.x, b.size + b.y, b.size);
			grd.addColorStop(0,"rgba(91,174,252,0.7)");
			grd.addColorStop(.7,"rgba(207,231,254,0.5)");

			ctx.fillStyle = grd;
			ctx.shadowBlur = 20;
			ctx.shadowColor = "rgb(255,255,255)"
			ctx.beginPath();
			ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
			ctx.fill();

			if (b.y < 0 - b.size * 2) {
				bubbles[i] = new Bubble;
			}
			b.y -= b.speed;
		});
		setTimeout(makeBubble, 20);
	};
});

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};
