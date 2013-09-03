$(document).on('ready', function () {
	var serverBaseUrl = document.domain;
	var socket = io.connect(serverBaseUrl, {resource: 'chatty_room/socket.io'});
	var sessionId = '';

	$('form').on('submit', function (e) {
		e.preventDefault();
		var message = $.trim($('#outgoing_message').val());
		var name = $.trim($('#name').val());

		if (message.length > 0) {
			sendMessage(name, message);
		}
		$('#outgoing_message').val('');
	});

	$('#name').on('blur', function () {
		socket.emit('nameChange', {
			id: sessionId,
			name: $('#name').val()
		});
	});

	socket.on('connect', function () {
		sessionId = socket.socket.sessionid;
		socket.emit('newUser', {
			id: sessionId, name: $('#name').val()
		});
	});

	socket.on('newConnection', function (data) {
		updateParticipants(data.participants);
	});

	socket.on('userDisconnected', function (data) {
		$('#' + data.id).remove();
	});

	socket.on('nameChanged', function (data) {
		$('#' + data.id).html(data.name + ' ' + (data.id === sessionId ? '(You)' : ''));
	});

	socket.on('incomingMessage', function (data) {
		var message = data.message;
		var name = data.name;
		$('<li>').html('<h3>' + name + '</h3>' + message).prependTo('#messages');
	});

	socket.on('error', function (reason) {
		alert('Unable to connect: ' + reason );
	});

	function updateParticipants(participants) {
		$('#participants').html('');
		_.each(participants, function (participant) {
			$('<li>', {
				id: participant.id
			}).html(participant.name + ' ' + (participant.id === sessionId ? '(You)' : '')).appendTo('#participants');
		});
	}

	function sendMessage(name, message) {
		$.post('/chatty_room/message', {
			name: name,
			message: message
		});
	}
});
