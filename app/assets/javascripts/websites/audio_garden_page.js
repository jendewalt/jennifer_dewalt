function audioGarden() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var height = window.innerHeight;
	var width = window.innerWidth;
	var notes = [];
	var beats = [];
	var stationary = true;
	var sound_names = [ { name: 'ukulele_gsharp1', color: '255, 158, 0' },
						{ name: 'ukulele_b2', color: '255, 251, 0' },
						{ name: 'ukulele_asharp2', color: '2178, 255, 0' },
						{ name: 'ukulele_a2', color: '0, 255, 46' },
						{ name: 'ukulele_dsharp1', color: '96, 13, 122' },
						{ name: 'ukulele_d1', color: '0, 255, 159' },
						{ name: 'ukulele_e1', color: '0, 238, 255' },
						{ name: 'ukulele_csharp1', color: '0, 153, 255' },
						{ name: 'ukulele_c2', color: '14, 0, 255' },
						{ name: 'ukulele_f1', color: '99, 0, 255' },
						{ name: 'ukulele_g1', color: '179, 0, 255' },
						{ name: 'ukulele_fsharp1', color: '255, 0, 162' },
						{ name: 'ukulele_c1', color: '255, 0, 50' }];

	canvas.height = height;
	canvas.width = width;

	function Beat() {
		this.x = canvas.width / 2;
		this.y = canvas.height / 2;
		this.radius = 0;
		this.playing = false;

		this.draw = function () {
			if (this.playing) {
				this.opacity = 1;
				ctx.shadowBlur = 30;
				ctx.shadowColor = 'rgba(' + this.playing + ', 1)';
				ctx.strokeStyle = 'rgba(' + this.playing + ', 1)';
			} else {
				this.opacity = 0.5;
				ctx.shadowBlur = 0;
				ctx.shadowColor = 'none';
				ctx.strokeStyle = 'rgba(255,255,255,0.5)';
			}
			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			ctx.stroke();
			ctx.closePath();

			this.radius += 1;

			var d = getPointsOnCircle(this.x, this.y, canvas.width, canvas.height);
			if (d < this.radius) {
				this.radius = 0;
			}		
		}

		beats.push(this);
	}

	function Note(x, y, radius, sound) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = sound.color;
		this.opacity = 0.5;
		this.playing = false;
		this.sound = new Howl ({
			urls: ["/assets/" + sound.name + '.mp3', "/assets/" + sound.name + '.ogg'],
			volume: 0.5
		});

		this.draw = function () {
			if (this.playing) {
				ctx.shadowBlur = 14;
				ctx.shadowColor = 'rgba(' + this.color + ', 1)';
				this.opacity = 1;
			} else {
				ctx.shadowBlur = 0;
				ctx.shadowColor = 'none';
				this.opacity = 0.5;
			}
			ctx.beginPath();
			ctx.fillStyle = 'rgba(' + this.color + ',' + this.opacity + ')';
			ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();

			checkBeats(this);
		};

		this.drag = function (x, y) {
			this.x = x;
			this.y = y;
		};

		function checkBeats(note) {
			_.each(beats, function(beat) {
				var d = getPointsOnCircle(beat.x, beat.y, note.x, note.y);
				if (Math.round(d) == beat.radius) {
					note.sound.play();
					note.playing = true;
					beat.playing = note.color;

					setTimeout(function () {
						note.playing = false;
						beat.playing = false;
					}, 160);
				}
			});
		}
	}

	function paintScreen() {
		ctx.clearRect(0,0,canvas.width,canvas.height);
		_.each(beats, function (beat) {
			beat.draw();
		});

		_.each(notes, function (note) {
			note.draw();
		});
		setTimeout(paintScreen, 10);
	}

	function getPointsOnCircle(cx, cy, px, py) {
		return Math.sqrt(Math.pow(px - cx, 2) + Math.pow(py - cy, 2));
	}

	$('canvas').on('mousedown', function (e) {
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;

		var grabbed_note = _.find(notes, function (note) {
			var d = getPointsOnCircle(note.x, note.y, x, y);
			return d < note.radius;
		});
		stationary = true;

		if (grabbed_note) {
			stationary = false;

			if (e.shiftKey) {
				console.log('hi')
				notes = _.reject(notes, function (note) {
					var d = getPointsOnCircle(note.x, note.y, x, y);
					console.log(d < note.radius);
					return d < note.radius;
				});
			} else {
				$('canvas').on('mousemove', function (e) {
					var x = e.pageX - canvas.offsetLeft;
					var y = e.pageY - canvas.offsetTop;

					grabbed_note.drag(x, y);
				});

				$('canvas').on('mouseup', function () {
					$('canvas').off('mousemove');
				});
			}
		}

	});

	$('canvas').on('click', function (e) {
		if (stationary) {
			var x = e.pageX - canvas.offsetLeft;
			var y = e.pageY - canvas.offsetTop;

			var sound = sound_names[randomInt(0, sound_names.length - 1)];

			notes.push(new Note(x, y, 15, sound));

		}
	});

	$('canvas').on('contextmenu', function (e) {
		e.preventDefault();
		new Beat();
	});

	$('.reset').on('click', function () {
		beats = [];
		notes = [];
		new Beat();
	});

	$('body').disableSelection();

	paintScreen();
	new Beat();
}