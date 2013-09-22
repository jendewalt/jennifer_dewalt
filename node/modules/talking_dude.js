var sanitizer = require('sanitizer');
var _ = require("underscore");
var participants = [];
var fs = require('fs');

function talking_dude_io(socket, io, dude) {}

function talking_dude_post(request, response, io) {
	var message = sanitizer.sanitize(request.body.message.slice(0, 255));

	if(_.isUndefined(message) || _.isEmpty(message.trim())) {
		return response.json(400, {error: "Message is invalid"});
	}

	io.of('/talking_dude').emit("incomingMessage", {message: message});

	response.json(200, {message: "Message received"});

	fs.writeFile('./talking_dude_message.txt', message);
}

exports.talking_dude_io = talking_dude_io;
exports.talking_dude_post = talking_dude_post;