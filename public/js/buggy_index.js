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
	var buggy = io.connect(serverBaseUrl + '/node/buggy', {resource: 'node/socket.io'});
	var sessionId = '';
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var height = window.innerHeight;
	var width = window.innerWidth;
	var bugs = [];
	var myBug = {};
	var timeout;

	canvas.height = height;
	canvas.width = width;

	$('body').disableSelection();

	$('canvas').on('mousemove', function (e) {
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;

		clearTimeout(timeout);
		myBug.emitting = true;
		myBug.xf = x;
		myBug.yf = y;

		timeout = setTimeout(function () {
			myBug.emitting = false;
		}, 300);
	});

	$('canvas').on('click', function () {
		clearTimeout(timeout);
		myBug.emitting = true;
		myBug.color = randomColorHex();

		timeout = setTimeout(function () {
			myBug.emitting = false;
		}, 300);
	});

	paintScreen();

	buggy.on('connect', function () {
		sessionId = buggy.socket.sessionid;
		myBug = new Bug(width/2, height/2, sessionId);
		bugs.push(myBug);

		buggy.emit('newUser', myBug);
		emitUpdate();
	});

	buggy.on('newConnection', function (data) {
		updateParticipants(data.participants);
	});

	buggy.on('userDisconnected', function (data) {
		bugs = _.reject(bugs, function (bug) {
			return data.id == bug.id;
		});
	});

	buggy.on('attributeChanged', function (data) {
		var bug = _.find(bugs, function (bug) {
			return data.id == bug.id;
		});
		bug.xf = data.x;
		bug.yf = data.y;
		bug.color = data.color;
	});

	buggy.on('error', function (reason) {
	});

	function updateParticipants(participants) {
		_.each(participants, function (participant) {
			var match = _.findWhere(bugs, {id: participant.id});

			var x = Number(participant.x) ? Number(participant.x) : canvas.width / 2;
			var y = Number(participant.y) ? Number(participant.y) : canvas.height / 2;

			if (!match) {
				bugs.push(new Bug(x, y, participant.id, participant.color));
			}
		});
	}

	function paintScreen() {
		ctx.clearRect(0,0,canvas.width, canvas.height);

		_.each(bugs, function (bug) {
			bug.draw();
		});

		setTimeout(paintScreen, 30);
	}

	function emitUpdate() {
		if (myBug.emitting == true) {
			buggy.emit('attributeChange', myBug);
		}
		setTimeout(emitUpdate, 200);
	}

	function Bug(x, y, id, color) {
		this.id = id;
		this.xf = x;
		this.yf = y;
		this.x = x;
		this.y = y;
		this.radius = 10;
		this.color = color ? color : '#222222';
		this.legsIn = Math.round(Math.random());

		this.draw = function () {
			var dx = this.xf - this.x;
			var dy = this.yf - this.y;

			this.x = this.x + 0.2 * dx;
			this.y = this.y + 0.2 * dy;

			var c = this.legsIn ? 1.66 : 1.87;
			ctx.fillStyle = this.color;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();

			ctx.beginPath();
			ctx.lineWidth = 3;
			ctx.moveTo(this.x, this.y);
			ctx.lineTo(this.x + this.radius * c, this.y);
			ctx.moveTo(this.x, this.y);
			ctx.lineTo(this.x - this.radius * c, this.y);

			ctx.moveTo(this.x, this.y);
			ctx.lineTo(this.x + this.radius * c, this.y + this.radius * 0.65);
			ctx.moveTo(this.x, this.y);
			ctx.lineTo(this.x - this.radius * c, this.y + this.radius * 0.65);

			ctx.moveTo(this.x, this.y);
			ctx.lineTo(this.x + this.radius * c, this.y - this.radius * 0.65);
			ctx.moveTo(this.x, this.y);
			ctx.lineTo(this.x - this.radius * c, this.y - this.radius * 0.65);
			ctx.strokeStyle = this.color;
			ctx.stroke();
			ctx.closePath();

			ctx.beginPath();
			ctx.fillStyle = 'white'
			ctx.arc(this.x + this.radius*0.4, this.y + this.radius*0.5, this.radius * 0.2, 0, 2 * Math.PI);
			ctx.arc(this.x - this.radius*0.4, this.y + this.radius*0.5, this.radius * 0.2, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();

			if ((dx < 0.2 && dy < 0.2) && (dx > -0.2 && dy > -0.2)) {
				this.legsIn = 0;

			} else {
				this.legsIn = !this.legsIn;
			}
		}
	}

	function randomColorHex() {
		return '#' + Math.random().toString(16).slice(2, 8);
	}
});
