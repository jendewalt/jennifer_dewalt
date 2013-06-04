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
		h = window.innerHeight - 1,
		w = window.innerWidth,
		drops = [],
		water_level = h - 5;

		canvas.height = h;
		canvas.width = w;

	setInterval(paintScreen, 30);

	$('canvas').on('click', function (e) {
		var x = e.pageX;
		var y = e.pageY;

		makeRainDrop(x, y);
	});

	$('button').on('click', function () {
		for (var i = 0; i < 100; i++) {
			makeRainDrop(randomInt(0, w), -1 * randomInt(15, 500));
		}
	});

	function paintScreen() {
		ctx.clearRect(0,0,w,h);
		drawRain();
		drawWater();
	}

	function Drop(x, y) {
		this.x = x;
		this.y = y;
		this.speed = 3;
		this.radius = 5;
	};

	function makeRainDrop(x, y) {
		drops.push(new Drop(x, y));
	};

	function drawRain() {
		_.each(drops, function (drop, i) {
			ctx.fillStyle = '#1385f0';
			ctx.beginPath();
			ctx.arc(drop.x, drop.y, drop.radius, 0, 2 * Math.PI);
			ctx.closePath();
			ctx.fill();

			ctx.beginPath();
			ctx.moveTo(drop.x + drop.radius*Math.cos(11*Math.PI/6), drop.y + drop.radius*Math.sin(11*Math.PI/6));
			ctx.lineTo(drop.x, drop.y - drop.radius * 1.7);
			ctx.lineTo(drop.x + drop.radius*Math.cos(7*Math.PI/6), drop.y + drop.radius*Math.sin(7*Math.PI/6));
			ctx.closePath();
			ctx.fill();

			evolveDrop(drop, i)
		});
	}

	function evolveDrop(drop, i) {
		drop.y += drop.speed;

		if (drop.y > water_level + drop.radius * 2) {
			drops.splice(i, 1);
			water_level -= 0.25;
		}
	};

	function drawWater() {
		if (water_level > 40) {
			ctx.fillStyle = '#1385f0';
			ctx.fillRect(0, water_level, w, h);
		} else {
			water_level = 40;
			ctx.fillStyle = '#1385f0';
			ctx.fillRect(0, 40, w, h);
			$('button').off().css({
				'background-color': '#e1e5ed',
				'cursor': 'auto'
			});
		}
		moveDucky();			
	};

	function moveDucky() {
		$('#ducky').css('top', water_level - 34);
	}
	
	$('body').disableSelection();
	
});

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};
