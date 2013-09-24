var sanitizer = require('sanitizer');
var _ = require("underscore");
var participants = [];

function color_jam_io(socket, io, color_jam) {
	socket.on('newUser', function (data) {
		var id = sanitizer.sanitize(data.id);
		var x = sanitizer.sanitize(data.x);
		var y = sanitizer.sanitize(data.y);

		x = Number(x) ? x : 50;
		y = Number(y) ? y : 50;

		participants.push({id: id, x: x, y: y});
		color_jam.emit('newConnection', {participants: participants});
	});

	socket.on('tilePlay', function (data) {
		var id = sanitizer.sanitize(data.id);
		this.broadcast.emit('tilePlayed', {id: id});
	});

	socket.on('positionChange', function (data) {
		var id = sanitizer.sanitize(data.id);
		var x = sanitizer.sanitize(data.x);
		var y = sanitizer.sanitize(data.y);

		x = Number(x) ? x : 50;
		y = Number(y) ? y : 50;

		this.broadcast.emit('positionChanged', {id: id, x: x, y: y});
	});

	socket.on('disconnect', function () {
		participants = _.without(participants, _.findWhere(participants, {id: socket.id}));
		color_jam.emit('userDisconnected', {id: socket.id, sender:"system"});
	});
}

exports.color_jam_io = color_jam_io;
