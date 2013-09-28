var sanitizer = require('sanitizer');
var _ = require("underscore");
var participants = [];
var fs = require('fs');

function hello_world_io(socket, io, dude) {}

function hello_world_post(request, response, io) {
	var message = sanitizer.sanitize(request.body.message.slice(0, 255));

	if(_.isUndefined(message) || _.isEmpty(message.trim())) {
		return response.json(400, {error: "Message is invalid"});
	}

	io.of('/node/hello_world').emit("incomingMessage", {message: message});

	response.json(200, {message: "Message received"});
}

exports.hello_world_io = hello_world_io;
exports.hello_world_post = hello_world_post;