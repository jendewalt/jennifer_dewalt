$(document).on('ready', function () {
	var serverBaseUrl = document.domain;
	var chatty_room = io.connect(serverBaseUrl + '/node/chatty_room', {resource: 'node/socket.io'});
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
		chatty_room.emit('nameChange', {
			id: sessionId,
			name: $('#name').val()
		});
	});

	chatty_room.on('connect', function () {
		sessionId = chatty_room.socket.sessionid;
		chatty_room.emit('newUser', {
			id: sessionId, name: $('#name').val()
		});
	});

	chatty_room.on('newConnection', function (data) {
		updateParticipants(data.participants);
	});

	chatty_room.on('userDisconnected', function (data) {
		$('#' + data.id).remove();
	});

	chatty_room.on('nameChanged', function (data) {
		$('#' + data.id).html(data.name + ' ' + (data.id === sessionId ? '(You)' : ''));
	});

	chatty_room.on('incomingMessage', function (data) {
		var message = data.message;
		var name = data.name;
		$('<li>').html('<h3>' + name + '</h3>' + message).prependTo('#messages');
	});

	chatty_room.on('error', function (reason) {
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
		$.post('/node/chatty_room/message', {
			name: name,
			message: message
		});
	}
});
