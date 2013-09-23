var sanitizer = require('sanitizer');
var _ = require("underscore");
var participants = [];

function buggy_io(socket, io, buggy) {
	socket.on('newUser', function (data) {
		var id = sanitizer.sanitize(data.id);
		var x = sanitizer.sanitize(data.x);
		var y = sanitizer.sanitize(data.y);

		x = Number(x) ? x : 50;
		y = Number(y) ? y : 50;

		participants.push({id: id, x: x, y: y});
		buggy.emit('newConnection', {participants: participants});
	});

	socket.on('attributeChange', function (data) {
		var id = sanitizer.sanitize(data.id);
		var x = sanitizer.sanitize(data.x);
		var y = sanitizer.sanitize(data.y);
		var color = sanitizer.sanitize(data.color);

		x = Number(x) ? x : 50;
		y = Number(y) ? y : 50;

		var bug = _.findWhere(participants, {id: socket.id});
		bug.x = x;
		bug.y = y;
		bug.color = color
		buggy.emit('attributeChanged', {id: id, x: x, y: y, color: color});
	});

	socket.on('disconnect', function () {
		participants = _.without(participants, _.findWhere(participants, {id: socket.id}));
		buggy.emit('userDisconnected', {id: socket.id, sender:"system"});
	});
}

function buggy_post(request, response, io) {}

exports.buggy_io = buggy_io;
exports.buggy_post = buggy_post;