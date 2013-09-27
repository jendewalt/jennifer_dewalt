var sanitizer = require('sanitizer');
var _ = require("underscore");
var Canvas = require('canvas');
var canvas = new Canvas(900, 600);
var ctx = canvas.getContext('2d');
var fs = require('fs');

function all_draw_io(socket, io, canvas) {
	socket.on('newPoints', function (data) {
		sanitizer.sanitize(data)
		this.broadcast.emit('newPoints', data);
		drawPoints(data.points, data.color, data.size, data.opacity);
	});
}

function drawPoints(points, color, size, opacity) {
	ctx.save();
	ctx.beginPath();
	ctx.globalAlpha = opacity;

	if (points.length == 1) {
		ctx.arc(points[0].x, points[0].y, size/ 2, 0, Math.PI * 2);
		ctx.fillStyle = color;
		ctx.fill();
	} else {
		ctx.moveTo(points[0].x, points[0].y);
		for (i = 1; i < points.length - 2; i++) {
			var new_x = (points[i].x + points[i + 1].x) / 2;
			var new_y = (points[i].y + points[i + 1].y) / 2;
			ctx.quadraticCurveTo(points[i].x, points[i].y, new_x, new_y);
			ctx.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
		}
		ctx.strokeStyle = color;
		ctx.lineWidth = size;
    	ctx.lineCap = 'round';
		ctx.stroke();			
	}
	
	ctx.closePath();
	ctx.restore();
	
	var url = canvas.toDataURL();
	fs.writeFile('./all_draw_url.txt', url);
}

exports.all_draw_io = all_draw_io;
