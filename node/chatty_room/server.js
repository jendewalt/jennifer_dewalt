var express = require("express");
var app = express();
var http = require("http");
var server = http.createServer(app);
var io = require("socket.io").listen(server, {resource: '/chatty_room/socket.io'});
var _ = require("underscore");
var sanitizer = require('sanitizer');

var participants = [];

app.set('ipaddr', "127.0.0.1");
app.set("port", 8888);
app.set("views", __dirname + "/views");
app.set('view engine', "ejs");
app.use(express.static("public", __dirname + "/public"));
app.use(express.bodyParser());

app.get('/chatty_room', function (request, response) {
	response.render("index");
});

app.post('/chatty_room/message', function (request, response) {
	var message = sanitizer.sanitize(request.body.message);

	if(_.isUndefined(message) || _.isEmpty(message.trim())) {
		return response.json(400, {error: "Message is invalid"});
	}

	var name = sanitizer.sanitize(request.body.name);

	io.sockets.emit("incomingMessage", {message: message, name: name});

	response.json(200, {message: "Message received"});
});

io.on('connection', function (socket) {
	socket.on('newUser', function (data) {
		var id = sanitizer.sanitize(data.id);
		var name = sanitizer.sanitize(data.name);

		participants.push({id: id, name: name});
		io.sockets.emit('newConnection', {participants: participants});
	});

	socket.on('nameChange', function (data) {
		var id = sanitizer.sanitize(data.id);
		var name = sanitizer.sanitize(data.name);

		_.findWhere(participants, {id: socket.id}).name = name;
		io.sockets.emit('nameChanged', {id: id, name: name});
	});

	socket.on('disconnect', function () {
		participants = _.without(participants, _.findWhere(participants, {id: socket.id}));
		io.sockets.emit('userDisconnected', {id: socket.id, sender:"system"});
	});
});

server.listen(app.get("port"), app.get('ipaddr'), function () {
	console.log("Server up and running on" + app.get("ipaddr") + ":" + app.get("port"));
});
