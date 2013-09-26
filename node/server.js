var express = require("express");
var app = express();
var http = require("http");
var server = http.createServer(app);
var io = require('socket.io').listen(server, {resource: '/node/socket.io'});
var fs = require('fs');
var chatty_room = require('./modules/chatty_room.js');
var talking_dude = require('./modules/talking_dude.js');
var buggy = require('./modules/buggy.js');
var color_jam = require('./modules/color_jam.js');
var one_drawing = require('./modules/one_drawing.js');
var how_were_feeling = require('./modules/how_were_feeling.js');
var all_draw = require('./modules/all_draw.js');

app.set('ipaddr', "127.0.0.1");
app.set("port", 8888);
app.set("views", __dirname + "/views");
app.set('view engine', "ejs");
app.use(express.static("public", __dirname + "/public"));
app.use(express.bodyParser());

var chat = io.of('/node/chatty_room').on('connection', function (socket) {
	chatty_room.chatty_room_io(socket, io, chat);
});

var dude = io.of('/node/talking_dude').on('connection', function (socket) {
	talking_dude.talking_dude_io(socket, io, dude);
});

var bug = io.of('/node/buggy').on('connection', function (socket) {
	buggy.buggy_io(socket, io, bug);
});

var jam = io.of('/node/color_jam').on('connection', function (socket) {
	color_jam.color_jam_io(socket, io, jam);
});

var drawing = io.of('/node/one_drawing').on('connection', function (socket) {
	one_drawing.one_drawing_io(socket, io, drawing);
});

var feeling = io.of('/node/how_were_feeling').on('connection', function (socket) {
	how_were_feeling.how_were_feeling_io(socket, io, feeling);
});

var canvas = io.of('/node/all_draw').on('connection', function (socket) {
	all_draw.all_draw_io(socket, io, canvas);
});

// CHATTY ROOM

app.get('/node/chatty_room', function (request, response) {
	response.render("chatty_room/index");
});

app.post('/node/chatty_room/message', function (request, response) {
	chatty_room.chatty_room_post(request, response, io);
});

// TALKING DUDE

app.get('/node/talking_dude', function (request, response) {
	fs.exists('./talking_dude_message.txt', function (exists) { 
		if (exists) {
    		fs.readFile('./talking_dude_message.txt', function (err, data) {
    			if (err) {
    				app.locals.talking_dude_message = "Hello! I'm Little Dude!";
    			} else {
    				app.locals.talking_dude_message = data;
    			}
				response.render("talking_dude/index");
    		});
		} else {
    		app.locals.talking_dude_message = "Hello! I'm Little Dude!";
			response.render("talking_dude/index");
		}
    });
});

app.post('/node/talking_dude/message', function (request, response) {
	talking_dude.talking_dude_post(request, response, io);
});

// BUGGY

app.get('/node/buggy', function (request, response) {
	response.render("buggy/index");
});

app.post('/node/buggy/message', function (request, response) {
	buggy.buggy_post(request, response, io);
});

// COLOR JAM

app.get('/node/color_jam', function (request, response) {
	response.render("color_jam/index");
});

// ONE DRAWING

app.get('/node/one_drawing', function (request, response) {
	fs.exists('./one_drawing_url.txt', function (exists) { 
		if (exists) {
    		fs.readFile('./one_drawing_url.txt', function (err, data) {
    			if (err) {
    				app.locals.one_drawing_url = '';
    			} else {
    				app.locals.one_drawing_url = data;
    			}
				response.render("one_drawing/index");
    		});
		} else {
    		app.locals.one_drawing_url = '';
			response.render("one_drawing/index");
		}
	});
});

app.post('/node/one_drawing/url', function (request, response) {
	one_drawing.one_drawing_post(request, response, io);
});

// HOW WE'RE FEELING

app.get('/node/how_were_feeling', function (request, response) {
	how_were_feeling.how_were_feeling_get(request, response)
});

// ALL DRAW

app.get('/node/all_draw', function (request, response) {
	response.render("all_draw/index");
});


// ----------------------------------------------------

server.listen(app.get("port"), app.get('ipaddr'), function () {
	console.log("Server up and running on " + app.get("ipaddr") + ":" + app.get("port"));
});
