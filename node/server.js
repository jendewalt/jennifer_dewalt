var express = require("express");
var app = express();
var http = require("http");
var server = http.createServer(app);
var io = require('socket.io');
var chatty_room_io = io.listen(server, {resource: '/chatty_room/socket.io'});
var chatty_room = require('./modules/chatty_room.js');

app.set('ipaddr', "127.0.0.1");
app.set("port", 8888);
app.set("views", __dirname + "/views");
app.set('view engine', "ejs");
app.use(express.static("public", __dirname + "/public"));
app.use(express.bodyParser());

app.get('/chatty_room', function (request, response) {
	response.render("chatty_room/index");
});

app.post('/chatty_room/message', function (request, response) {
	chatty_room.chatty_room_post(request, response, chatty_room_io);
});

chatty_room_io.on('connection', function (socket) {
	chatty_room.chatty_room_io(socket, chatty_room_io);
});

server.listen(app.get("port"), app.get('ipaddr'), function () {
	console.log("Server up and running on " + app.get("ipaddr") + ":" + app.get("port"));
});
