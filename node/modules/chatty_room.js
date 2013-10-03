var sanitizer = require('sanitizer');
var _ = require("underscore");
var participants = [];

function chatty_room_io(socket, io, chat) {
	socket.on('newUser', function (data) {

		var id = sanitizer.sanitize(data.id);
		var name = sanitizer.sanitize(data.name);

		participants.push({id: id, name: name});
		this.broadcast.emit('newConnection', {participants: participants});
		this.emit('newConnection', {participants: participants});
	});

	socket.on('nameChange', function (data) {
		var id = sanitizer.sanitize(data.id);
		var name = sanitizer.sanitize(data.name);

		var participant = _.findWhere(participants, {id: socket.id});

		if (participant) {
			participant.name = name;
			this.broadcast.emit('nameChanged', {id: id, name: name});
			this.emit('nameChanged', {id: id, name: name});
		}
	});

	socket.on('disconnect', function () {
		participants = _.without(participants, _.findWhere(participants, {id: socket.id}));
		this.broadcast.emit('userDisconnected', {id: socket.id, sender:"system"});
	});
}

function chatty_room_post(request, response, io) {
	var message = sanitizer.sanitize(request.body.message);

	if(_.isUndefined(message) || _.isEmpty(message.trim())) {
		return response.json(400, {error: "Message is invalid"});
	}

	var name = sanitizer.sanitize(request.body.name);

	io.of('/node/chatty_room').emit("incomingMessage", {message: message, name: name});

	response.json(200, {message: "Message received"});
}

exports.chatty_room_io = chatty_room_io;
exports.chatty_room_post = chatty_room_post;