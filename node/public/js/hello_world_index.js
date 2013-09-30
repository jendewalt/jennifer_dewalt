window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);

$(document).on('ready', function () {
	var serverBaseUrl = document.domain;
	var hello_world = io.connect(serverBaseUrl + '/node/hello_world', {resource: 'node/socket.io'});
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var h = window.innerHeight;
	var w = window.innerWidth;
	var hooray_sound = new Howl({
			urls: ["/audio/yay" + '.mp3', "/audio/yay" + '.ogg']
		});
	var explode_sound = new Howl({
			urls: ["/audio/aggressive" + '.mp3', "/audio/aggressive" + '.ogg'],
			volume: 0.7
		});
	var sushi_animations = [ 'shake', 'hop', 'spin','grow', 'hooray' ];
	var jen_animations = [ 'jen_dangle', 'jen_jump', 'jen_flip', 'spin'];
	var dark = true;
	var confetti =[];

	var bacon_full = new Image;
	var bacon_top_left = new Image;
	var bacon_top_right = new Image;
	var bacon_bottom_left = new Image;
	var bacon_bottom_right = new Image;
	var bacons = [];
	var bacon_parts = [];
	var flashes = [];

	var phrases = [];

	canvas.height = h;
	canvas.width = w;

	$('body').disableSelection();

	paintScreen();
	animateShark();

	$( window ).resize(function() { 
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	});

	$('form').on('submit', function (e) {
		e.preventDefault();
		var message = $.trim($('#outgoing_message').val());

		if (message.length > 0 && message.length <= 255) {
			sendMessage(message);
		}
		$('#outgoing_message').val('');
	});

	hello_world.on('incomingMessage', function (data) {
		ctx.font = "20px Arial";
		var offset = ctx.measureText(data.text).width / 2;

		var message = {
			text: data.message,
			x: randomInt(offset, canvas.width - offset),
			y: -30,
			color: randomColor(),
			draw: function () {
				ctx.beginPath();
				ctx.textAlign = 'center';
				ctx.font = "20px Arial";
				ctx.fillStyle = this.color;
				ctx.fillText(this.text, this.x, this.y);
				ctx.closePath();

				this.y += 3;
				if (this.y > canvas.height + 30) {
					phrases = _.reject(phrases, function (other_phrase) {
						return this == other_phrase;
					}, this);
				}
			}
		}

		phrases.push(message);
	});

	hello_world.on('error', function (reason) {
	});

	function sendMessage(message) {
		$.post('/node/hello_world/message', {
			message: message
		});
	}

	$('#dude_container').on('click', function () {
		var dude = $(this);
		dude.addClass('play');

		setTimeout(function () {
			dude.removeClass('play');
		}, 1000);
	});

	$('#rope_container').draggable({
		containment: "parent",
		start: function (e) {
			mouse = e.pageY;
		},
		stop: function (e) {
			if (e.pageY >= mouse + 100) {
				releaseConfetti();
			}
			$('#rope_container').animate({top: 0}, 100);
		}
	});

	$('.sushi_box').on('click', function () {
		var animation = sushi_animations[randomInt(0, sushi_animations.length - 1)];
		var sushi = $(this);
		sushi.addClass(animation);
		setTimeout(function () {
			sushi.removeClass(animation);
		}, 1000);
	});

	$('#jen').on('click', function () {
		var animation = jen_animations[randomInt(0, jen_animations.length - 1)];
		$('#jen').addClass(animation);

		setTimeout(function () {
			$('#jen').removeClass(animation);
		}, 4000);
	});

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
				explode_sound.play();

				bacons[i] = new Bacon();
			}
		});
	});

	function paintScreen() {
		ctx.clearRect(0,0,canvas.width, canvas.height);

		_.each(phrases, function (phrase) {
			phrase.draw();
		});

		_.each(confetti, function (piece) {
			piece.draw();
		});

		_.each(bacons, function (bacon, i) {
			bacon.draw();

			if (bacon.y > canvas.height) {
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
			return (part.x < -30 || part.x > canvas.width || part.y < -145 || part.y > canvas.height);
		});

		flashes = _.reject(flashes, function (flash) {
			return flash.time <= 0;
		});

		requestAnimFrame(paintScreen);
	}

	function animateShark() {
		$('#shark_container').css({
			right: -200
		}).animate({
			right: canvas.width + 200
		}, 3500, 'linear', animateShark);
	}

	function releaseConfetti() {
		if (dark) {
			$('#dark').hide();
			$('body').css('background-color', 'white');
			$('#party').show();
			$('#pull_me').hide();
			dark = false;
		}

		hooray_sound.play();
		makeConfetti();
	}

	function makeConfetti(times) {
		var times = times ? times : 0;
		for (var i = 0; i < 50; i++) {
			confetti.push(new Confetti);
		}

		if (times < 12) {
			setTimeout(function () {
				makeConfetti(times + 1);
			}, 50);
		}
	}

	function Confetti() {
		this.x = Math.random() * w;
		this.y = -20;
		this.speed = Math.random() * 8 + 6;
		this.radius = Math.random() * 7;
		this.color = randomColor();

		this.draw = function () {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			ctx.fillStyle = this.color;
			ctx.fill();
			ctx.closePath();

			evolve(this);
		}

		function evolve(piece) {
			piece.y += piece.speed;

			if (piece.y > canvas.height + piece.radius) {
				confetti = _.reject(confetti, function (other_piece) {
					return piece == other_piece;
				});
			}
		}
	}

	setInterval(function () {
		if (bacons.length < 6) {
			makeBacon();
		}
	}, randomInt(50, 2000));

	function makeBacon() {
		bacons.push(new Bacon());
	};

	function Bacon() {
		this.x = randomInt(0, canvas.width);
		this.y = -145;
		this.vy = randomInt(2,5);

		this.draw = function () {
			ctx.drawImage(bacon_full, this.x, this.y);
			this.y += this.vy;
		}
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
	}

	bacon_full.src = '/images/hw_bacon_full.png';
	bacon_top_left.src = '/images/hw_bacon_1.png';
	bacon_top_right.src = '/images/hw_bacon_2.png';
	bacon_bottom_left.src = '/images/hw_bacon_3.png';
	bacon_bottom_right.src = '/images/hw_bacon_4.png';

	function randomColor() {
		return '#' + Math.random().toString(16).slice(2, 8);
	}

	function randomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	};
});