function teammates() {
	var users = [];
	
	$('form').on('submit', function (e) {
		e.preventDefault();
		var username = $.trim($('#username_input').val());
		username = username != '' ? username : 'dribbble';

		$('#form_container').fadeOut(300, function () {
			$('#start_over').fadeIn(300);
		});

		getUserData(username);
	});

	function getUserData(user) {
		var username = user.username ? user.username : user;
		var success = false;

		$.getJSON('http://api.dribbble.com/players/' + username + '/shots/following?per_page=10&callback=?', function (data) {
			var followers = data.shots;

			if (users.length == 0) {
				$.getJSON('http://api.dribbble.com/players/' + username + '/shots?per_page=1&callback=?', function (data) {
					success = true;
					formatUserData(followers, data.shots[0]);
				});
			} else {
				success = true;
				users = [];
				user.user_type = 'main';
				users.push(user);
				formatUserData(followers);
			}
		});

		setTimeout(function () {
			if (!success) {
				alert('Oops! Something went wrong. Please check your request and try again.');
				$('#form_container').show(300);
			}
		}, 5000);
	}

	function formatUserData(followers, user) {
		if (user) {
			extractUserData(user, 'main');
		}

		_.each(followers, function (follower) {
			extractUserData(follower, 'follower')
		});

		displayUsers();
	}

	function extractUserData(user, type) { 
		var user_obj = {}
		user_obj.image_url = user.image_teaser_url;
		user_obj.shot_url = user.url;
		user_obj.username = user.player.username;
		user_obj.user_url = user.player.url;
		user_obj.user_type = type;

		users.push(user_obj);
	}

	function displayUsers() {
		var num = users.length - 1;
		var angle_delta = (360 * Math.PI / 180) / num;
		var angle = 0;

		$('.plot_container').remove();

		var plot_container = $('<div>', {
				class: 'plot_container'
			});

		_.each(users, function (user) {
			var container = $('<div>', {
					class: 'user_container ' + user.user_type
				});

			var image = $('<img>', {
					class: 'image',
					src: user.image_url
				}).on('click', function () {
					$('#teams_container').fadeOut(200);
					getUserData(user);
				});

			var name = $('<a>', {
					href: user.user_url,
					class: 'username',
					target: '_blank'
				}).text(user.username);

			if (user.user_type == 'follower') {
				var x = 240 + 240 * Math.cos(angle);
				var y = 240 + 240 * Math.sin(angle);

				container.css({
					top: x,
					left: y
				});
				angle += angle_delta;
			}

			container.append(image).append(name).appendTo(plot_container);
		});

		$('#teams_container').append(plot_container);

		setTimeout(function () {
			$('#teams_container').fadeIn(500);
		}, 800);
	}
}