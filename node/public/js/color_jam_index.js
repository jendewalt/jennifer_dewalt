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
	var color_jam = io.connect(serverBaseUrl + '/node/color_jam', {resource: 'node/socket.io'});
	var sessionId = '';
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var height = 550;
	var width = 800;
	var player_height = 380;
	var player_width = 620;
	var tiles = [];
	var cursors = [];
	var myCursor = {}
	var sounds = [ 	{ name: 'ab1', color: '255, 0, 50' },
				   	{ name: 'bb1', color: '255, 96, 0' },
					{ name: 'c1', color: '255, 152, 0' },
					{ name: 'db1', color: '255, 251, 0' },
					{ name: 'eb1', color: '247, 241, 101' },
					{ name: 'f1', color: '0, 255, 99' },
					{ name: 'g1', color: '100, 255, 0' },
					{ name: 'ab2', color: '0, 255, 159' },
					{ name: 'bb2', color: '0, 238, 255' },
					{ name: 'c2', color: '0, 153, 255' },
					{ name: 'db2', color: '0, 64, 255' },
					{ name: 'eb2', color: '183, 0, 255' },
					{ name: 'f2', color: '215, 135, 239' },
					{ name: 'g2', color: '252, 104, 104' },
					{ name: 'ab3', color: '255, 0, 122' }];

	var timeout;
	var throttle = _.throttle(function (x, y) {
						updatePosition(x, y);
					}, 80);

	canvas.height = height;
	canvas.width = width;

	$('body').disableSelection();

	init();
	paintScreen();

	$('canvas').on('click', function (e) {
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;
		checkTiles(x, y);
	});

	$('canvas').on('mousemove', function (e) {
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;

		myCursor.x = x;
		myCursor.y = y;

		throttle(x, y);
	});


	color_jam.on('connect', function () {
		sessionId = color_jam.socket.sessionid;
		myCursor = new Cursor(width/2, height/2, sessionId, '#101013');
		cursors.push(myCursor);

		color_jam.emit('newUser', myCursor);
	});

	color_jam.on('newConnection', function (data) {
		updateParticipants(data.participants);
	});

	color_jam.on('userDisconnected', function (data) {
		cursors = _.reject(cursors, function (cursor) {
			return data.id == cursor.id;
		});
	});

	color_jam.on('tilePlayed', function (data) {
		var tile = _.find(tiles, function (tile) {
			return data.id == tile.id;
		});
		tile.play();
	});

	color_jam.on('positionChanged', function (data) {
		var cursor = _.find(cursors, function (cursor) {
			return data.id == cursor.id;
		});

		if (cursor) {
			cursor.x = data.x;
			cursor.y = data.y;			
		}
	});

	color_jam.on('error', function (reason) {
	});

	function paintScreen() {
		ctx.clearRect(0,0,canvas.width, canvas.height);

		_.each(tiles, function (tile) {
			tile.draw();
		});
		_.each(cursors, function (cursor) {
			cursor.draw();
		});

		setTimeout(paintScreen, 30);
	}

	function init() {
		var offsetTop = (height - player_height) / 2;
		var offsetLeft = (width - player_width) / 2;
		var radius = 50;
		var margin = 20;
		var x = offsetLeft + radius + margin;
		var y = offsetTop + radius + margin;

		for (var i = 0; i < sounds.length; i++) {
			tiles.push(new Tile(x, y, i, sounds[i].color, sounds[i].name, radius));

			x += radius * 2 + margin;

			if (x >= offsetLeft + (radius * 2 * 5) + margin * 6) {
				y += radius * 2 + margin;
				x =  offsetLeft + radius + margin;
			}
		}
	}

	function Tile(x, y, id, color, sound, radius) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
		this.playing = false;
		this.sound = new Howl ({
			urls: ["/audio/" + sound + '.mp3', "/audio/" + sound + '.ogg']
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
			ctx.fillStyle = 'rgba(' + this.color + ', 0.7)';
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
			ctx.fill();
			ctx.closePath();
		} 

		this.play = function () {
			var tile = this;
			tile.playing = true;
			tile.sound.play();

			setTimeout(function () {
				tile.playing = false
			}, 160);
		}
	}

	function Cursor(x, y, id, color) {
		this.x = x;
		this.y = y;
		this.id = id;
		this.color = color ? color : '#32323d';

		this.draw = function () {
			ctx.shadowBlur = 0;
			
			ctx.save();
			ctx.beginPath();
			ctx.fillStyle = this.color;
			ctx.strokeStyle = '#fff';
			ctx.translate(this.x, this.y);
			ctx.rotate(-0.33);
	  		ctx.moveTo(0, 0);
	        ctx.lineTo(0 - 10, 0 + 25);
	        ctx.lineTo(0, 0 + 20);
	        ctx.lineTo(0 + 10, 0 + 25);
	        ctx.lineTo(0, 0);
			ctx.fill();
			ctx.stroke();
			ctx.rotate(0.33);
			ctx.translate(-this.x, -this.y);
			ctx.closePath();
			ctx.restore();
		}
	}

	function checkTiles(x, y) {
		_.each(tiles, function (tile) {
			var d = getPointsOnCircle(tile.x, tile.y, x, y);

			if (tile.radius >= d) {
				tile.play();
				color_jam.emit('tilePlay', {id: tile.id});
			}
		});
	}

	function updateParticipants(participants) {
		_.each(participants, function (participant) {
			var match = _.findWhere(cursors, {id: participant.id});

			var x = Number(participant.x) ? Number(participant.x) : canvas.width / 2;
			var y = Number(participant.y) ? Number(participant.y) : canvas.height / 2;

			if (!match) {
				cursors.push(new Cursor (x, y, participant.id));
			}
		});
	}

	function updatePosition(x, y) {
		color_jam.emit('positionChange', myCursor);
	}

	function getPointsOnCircle(cx, cy, px, py) {
		return Math.sqrt(Math.pow(px - cx, 2) + Math.pow(py - cy, 2));
	}
});
