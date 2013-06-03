(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);

$(document).ready(function () {
	var orbs = [],
		lit = [],
		num_orbs = 5,
		level = 1,
		h = 450,
		w = 700,
		diameter = 40;

	function setOrbs(num) {
		for (var i = 0; i < num; i++) {
			var x = randomInt(diameter, w - diameter),
				y = randomInt(diameter, h - diameter);

			orbs.push(new Orb(x, y));

			$('<div>', {
				class: 'orb',
			}).css({
				top: y,
				left: x
			}).appendTo('.board')
			.on('click', function (){
				var pos = $(this).position();
				if (pos.left == orbs[0].x && pos.top == orbs[0].y) {
					$(this).addClass('lit');
					lit.push(orbs.shift());
					
					if (orbs.length == 0) {
						levelUp();
					}
				} else {
					var elm = this;
					shakeOrb(elm);

					orbs = lit.concat(orbs);
					lit = [];

					$('.orb').removeClass('lit');
				}
			});
		}

		orbs = _.shuffle(orbs);
	};

	function Orb(x, y) {
		this.x = x;
		this.y = y;
	};

	function shakeOrb(elm) {
		$(elm).addClass('shimmy');

		setTimeout(function () {
			$(elm).removeClass('shimmy');
		}, 400);
	};

	function levelUp() {
		setTimeout(function () {
			num_orbs++;
			level++;
			$('.board').html('');
			$('.level').text('Level: ' + level);

			lit = [];
			orbs = [];

			setOrbs(num_orbs);
		}, 800);
	}

	setOrbs(num_orbs);

	$('.close').on('click', function () {
		$('.modal').fadeOut('fast');
	});

	$('body').disableSelection();
	
});

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};



