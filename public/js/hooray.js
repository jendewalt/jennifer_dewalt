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
		h = window.innerHeight,
		w = window.innerWidth,
		confetti = [],
		spent = [],
		mouse,
		sound = true;

		canvas.height = h;
		canvas.width = w;

	$('#rope_container').draggable({
		containment: "parent",
		start: function (e) {
			mouse = e.pageY;
		},
		stop: function (e) {
			if (e.pageY >= mouse + 100) {
				releaseConfetti();
				playSound();
			}
			animateRope();
		}
	});

	paintScreen();

	setTimeout(function () {
		$('#message').fadeOut(1500);
	}, 2000);

	$('button').on('click', function () {
		if (sound) {
			$('button').addClass('off');
			$('button').removeClass('on');
			$('button').text('Sound Off');
		} else {
			$('button').addClass('on');
			$('button').removeClass('off');
			$('button').text('Sound On');
		}

		sound = !sound;
	});

	function releaseConfetti() { 
		for (var i = 0; i < 600; i++) {
			confetti.push(new Confetti);
		}
	};

	function Confetti() {
		var shapes = ['square', 'circle'];

		this.x = Math.random() * w;
		this.y = Math.random() * 200 - 200;
		this.speed = Math.random() * 8 + 6;
		this.size = Math.random() * 7;
		this.color = randomColor();
		this.shape = shapes[Math.floor(Math.random() * 2)];
	};

	function paintScreen() {
		ctx.clearRect(0,0,w,h);
		drawConfetti();
		drawSpent();
		evolveConfetti(confetti);
		
		setTimeout(paintScreen, 30);
	};

	function drawConfetti() {
		_.each(confetti, function (piece) {
			if (piece.shape == 'circle') {
				drawCircle(piece);
			} else if (piece.shape == 'square') {
				drawSquare(piece);
			}
		});
	};

	function drawCircle(circle) {
		ctx.fillStyle = circle.color;
		ctx.beginPath();
		ctx.arc(circle.x, circle.y, circle.size, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
	};

	function drawSquare(square) {
		ctx.fillStyle = square.color;
		ctx.fillRect(square.x, square.y, square.size, square.size);
	};

	function drawSpent() {
		_.each(spent, function (piece) {
			if (piece.shape == 'circle') {
				drawCircle(piece);
			} else if (piece.shape == 'square') {
				drawSquare(piece);
			}
		});

		if (spent.length > 800) {
			spent.splice(0, spent.length - 800);
		}
	};

	function evolveConfetti(array) {
		_.each(array, function (item, i) {
			item.y += item.speed;

			if (item.y >= h - item.size) {
				item.y = h - item.size;
				spent.push(item);
				array.splice(i, 1);
			}
		}); 
	};

	function playSound() {
		if (sound) {
  			$('#sound').html("<audio autoplay><source src='audio/yay.wav' type='audio/wav'></audio>");
		}
	};

	function animateRope() {
		$('#rope_container').animate({top: 0}, 100);	
	};
	
	$('body').disableSelection();
	
});

function randomColor() {
	return '#' + Math.random().toString(16).slice(2, 8);
};







