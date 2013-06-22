function textScroller() {
	var canvas = $('canvas')[0],
		ctx = canvas.getContext('2d'),
		h = 60,
		w = window.innerWidth,
		phrases = [];

	canvas.height = h;
	canvas.width = w;

	function Phrase(phrase, x, y, vx, color, direction) {
		this.phrase = phrase;
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.color = color;
		this.opacity = Math.random();
		this.direction = direction;

		this.move = function () {
			if(this.direction == 'right' & this.x > w) {
				this.x = 0 - this.phrase.length * 30;
			} 
			if(this.direction == 'left' & this.x < 0 - this.phrase.length * 30) {
				this.x = w;
			} 

			this.x+= this.vx;

			ctx.font = '50px Courier New';
			ctx.fillStyle = 'rgba('+ this.color + ', ' + this.opacity + ')';
			ctx.fillText(this.phrase, this.x, this.y);

		};
	};
	
	function makePhrase(phrase) {
		var vx = randomFloat(-5, 5),
			direction,
			x;


		if (vx < 1.5 && vx > 0) {
			vx += 1.5;
		} else if (vx > -1.5 && vx < 0) {
			vx -= 1.5;
		}

		if (vx >= 0){
			direction = 'right';
			x = phrase.length * 30 * -1;
		} else {
			direction = 'left';
			x = w;
		}
		console.log(x)
		phrases.push(new Phrase(phrase, x, 50, vx, randomColorRGB(), direction))
	}

	function paintScreen() {
		ctx.clearRect(0,0,w,h);
		_.each(phrases, function (phrase) {
			phrase.move();
		});

		setTimeout(paintScreen, 50);
	};

	paintScreen();

	$('input[type=text]').focus();

	$('form').on('submit', function (e) {
		e.preventDefault();

		var phrase = $(this).find('#phrase_text').val();

		$(this).find('#phrase_text').val('');

		makePhrase(phrase);
	});

	var form_state = true;

	$('.close').on('click', function () {
		if (form_state) {
			$('form').animate({top: '-100px'}, 500);
			$('.close').html('&#9660').css('color', '#222');
			form_state = !form_state
		} else {
			$('form').animate({top: '0'}, 500);
			$('.close').html('&#9650').css('color', '#666');
			form_state = !form_state
		}
	})

};













