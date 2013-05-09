$(document).ready(function () {
	var canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d');
	var correct = 0,
		wrong = 0,
		missed = 0;
	var h = 550,
		w = 700;
	var characters = []
	var s = 1;

	ctx.font="40px Century Gothic";
	ctx.fillStyle="#333";

	setTimeout (function () {
		$('.modal').fadeOut(1000);

		init();

		$(document).on('keypress', function (key) {
			var c = String.fromCharCode(key.charCode);
			var err = 1;

			_.each(characters, function (obj, i) {
				if (c == obj.letter) {
					correct += 1;
					updateStat('correct', correct);
					characters[i] = new Character();
					err = 0;
				} 			
			});

			if (err == 1) {
				wrong += 1;
				updateStat('wrong', wrong);
			}

			if (correct % 10 == 0) {
				s += 1;
				for (var i = 0; i < 5; i++) {
					characters.push(new Character());
				}
			}
		});

	}, 2500);

	function failModal () {
		var decimal = (correct / (correct + wrong + missed)*100);
		var percent = Math.round((decimal)*Math.pow(10,2))/Math.pow(10,2)
		$('.modal h1').text('Game Over');
		$('.modal h2').text('');
		if (wrong == 1) {
			$('#second').text('You got ' + correct + ' right with ' + wrong + ' error.');
		} else { 
			$('#second').text('You got ' + correct + ' right with ' + wrong + ' errors.');
		}
		$('#first').text(percent + '%').addClass('score');
		$('.modal').append('<a href="type_attack.html">Try Again?</a>');

		$('.modal').show();
	}

	function init() {
		for (var i = 0; i < 10; i++) {
			characters.push(new Character());
		}
		drawChars();
	};
		
	function Character() {
		this.x = Math.random() * 600 + 50;
		this.y = 40;
		this.letter = String.fromCharCode(randomInt(33, 126));
		this.speed = Math.random() * s;
	};

	function drawChars() {
		ctx.clearRect(0,0,w,h);
		_.each(characters, function (c, i) {
			ctx.fillText(c.letter, c.x, c.y);

			if (c.y + c.speed > h + 40) {
				missed += 1;
				updateStat('missed', missed);
				characters[i] = new Character();
			}
			c.y += c.speed;
		});

		if (missed >= 20) {
			ctx.clearRect(0,0,w,h);
			failModal();
		} else {
			setTimeout(drawChars, 20);
		}
	};

	function updateStat(id, stat) {
		$('#' + id).text(id + ': ' + stat);
	};

});

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};