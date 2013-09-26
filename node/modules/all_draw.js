var sanitizer = require('sanitizer');
var _ = require("underscore");
var cur_drawing = {};
var fs = require('fs');

function all_draw_io(socket, io, canvas) {
	socket.on('newPoints', function (data) {
		console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
		console.log(data);

		this.broadcast.emit('newPoints', data);
	});
}


exports.all_draw_io = all_draw_io;
