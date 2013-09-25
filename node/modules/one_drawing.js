var sanitizer = require('sanitizer');
var _ = require("underscore");
var cur_drawing = {};
var fs = require('fs');

function one_drawing_io(socket, io, one_drawing) {
	
}

function one_drawing_post(request, response, io) {
	var url = sanitizer.sanitize(request.body.url);

	if(_.isUndefined(url) || _.isEmpty(url.trim())) {
		return response.json(400, {error: "url is invalid"});
	}

	response.json(200, {url: "url received"});

	fs.writeFile('./one_drawing_url.txt', url);
}

exports.one_drawing_io = one_drawing_io;
exports.one_drawing_post = one_drawing_post;
