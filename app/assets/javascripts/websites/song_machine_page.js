function songMachine() {
	var canvas = $('canvas')[0],
		ctx = canvas.getContext('2d'),
		file_names = ['ab1','ab2','ab3','bb1','bb2','c1','c2','db1','db2','eb1','eb2','f1','f2','g1','g2'],
		notes = [],
		h = window.innerHeight - 40,
		w = 750;

	canvas.height = h;
	canvas.width = w;

	$('canvas').on('click', function (e) {
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;
		var sound = getSound(x);
		makeNote(x, y, sound);
	});

	paintScreen();

	function getSound(x) {
		var sound;

		if (x > 700) {
			sound = file_names[0];
		} else if (x > 650) {
			sound = file_names[1];
		} else if (x > 600) {
			sound = file_names[2];
		} else if (x > 550) {
			sound = file_names[3];
		} else if (x > 500) {
			sound = file_names[4];
		} else if (x > 450) {
			sound = file_names[5];
		} else if (x > 400) {
			sound = file_names[6];
		} else if (x > 350) {
			sound = file_names[7];
		} else if (x > 300) {
			sound = file_names[8];
		} else if (x > 250) {
			sound = file_names[9];
		} else if (x > 200) {
			sound = file_names[10];
		} else if (x > 150) {
			sound = file_names[11];
		} else if (x > 100) {
			sound = file_names[12];
		} else if (x > 50) {
			sound = file_names[13];
		} else if (x > -1) {
			sound = file_names[14];
		}

		return sound;
	}; 

	function Note(x, y, sound) {
		this.x = x;
		this.y = y;
		this.color = '36,39,51';
		this.played = false;
		this.sound = new Howl({
			urls: ["/assets/" + sound + '.mp3', "/assets/" + sound + '.ogg'],
			volume: 0.5
		});

		this.draw = function () {

			if (this.played) {
				ctx.fillStyle = 'rgba(' + this.color + ', 0.3)';
			} else {
				ctx.fillStyle = 'rgba(' + this.color + ', 1)';				
			}

			ctx.beginPath();
			ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();
		};

		this.play = function () {
			this.sound.play();
		};
	};

	function makeNote(x, y, sound) {
		notes.push(new Note(x, y, sound));
	};

	function evolveNotes() {
		_.each(notes, function (note) {
			note.y -= 5;

			if (note.y < 150 && note.played == false) {
				note.play();
				note.played = true;
			}

			if (note.y < -20){
				note.y = h + 20;				
				note.played = false;
			}
		});
	};

	function paintScreen() {
		ctx.beginPath();
		ctx.fillStyle = '#fff';
		ctx.strokeStyle = "rgba(0,0,0,0.2)";
		ctx.lineWidth = 3;
		ctx.fillRect(0,0,w,h);
		ctx.strokeRect(0,0,w,h);
		ctx.closePath();

		_.each(notes, function (note) {
			note.draw();
		});

		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = "#242733";
		ctx.fillStyle = "#242733";
		ctx.shadowOffsetY = 10;
		ctx.shadowColor="rgba(0,0,0,0.4)";
		ctx.shadowBlur = 3;
		ctx.lineWidth = 2;
		ctx.moveTo(-10, 130.5);
		ctx.lineTo(-10, 170.5);
		ctx.lineTo(20, 150.5);
		ctx.lineTo(-10, 130.5);
		ctx.moveTo(20, 150.5);
		ctx.lineTo(w - 20, 150.5);
		ctx.moveTo(w + 10, 130.5);
		ctx.lineTo(w + 10, 170.5);
		ctx.lineTo(w - 20, 150.5);
		ctx.lineTo(w + 10, 130.5);
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
		ctx.restore();


		evolveNotes();
		// setTimeout(paintScreen, 30);
		requestAnimFrame(paintScreen);
	};

	$('body').disableSelection();

};