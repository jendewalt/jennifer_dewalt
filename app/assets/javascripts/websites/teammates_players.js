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

	// [Updated 03.04.2016] Dribbble changed their API so this code needed a bit of reworking to function.
	// I tried my best to keep the spirit of the original code. The bulk of the original code is commented below
	function getUserData(user) {
		var username = user.username ? user.username : user;
		var success = false;
		var access_token = '3286164f6a2e77ae32e79e2e8f03f383aa9e616914fd8697da6ce67f93b778e7';
		var followers;
		var count = 0;
		users = [];

		$.getJSON('http://api.dribbble.com/v1/users/' + username + '/followers?access_token=' + access_token + '&per_page=10&callback=?', function (data) {
			followers = data.data;

			followers.forEach(function (follower) {
				$.getJSON('http://api.dribbble.com/v1/users/' + follower.follower.username + '/shots?access_token=' + access_token + '&per_page=1&callback=?', function (data) {
					var shot = data.data[0];
					if (shot) {
						follower.shot = shot;
					} else {
						followers.splice(followers.indexOf(follower), 1);
					}
					checkSendToFormat();
				});
			});
		});

		function checkSendToFormat() {
			count += 1;
			if (count === followers.length) {
				$.getJSON('http://api.dribbble.com/v1/users/' + username + '?access_token=' + access_token + '&per_page=1&callback=?', function (data) {
					success = true;
					formatUserData(followers, data.data);
				});
			}
		}

		// $.getJSON('http://api.dribbble.com/players/' + username + '/shots/following?per_page=10&callback=?', function (data) {
		// 	var followers = data.shots;

		// 	if (users.length == 0) {
		// 		$.getJSON('http://api.dribbble.com/players/' + username + '/shots?per_page=1&callback=?', function (data) {
		// 			success = true;
		// 			formatUserData(followers, data.shots[0]);
		// 		});
		// 	} else {
		// 		success = true;
		// 		users = [];
		// 		user.user_type = 'main';
		// 		users.push(user);
		// 		formatUserData(followers);
		// 	}
		// });

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

		if (type == 'main') {
			user_obj.image_url = user.avatar_url;
			user_obj.shot_url = user.html_url;
			user_obj.username = user.username;
			user_obj.user_url = user.html_url;
			user_obj.user_type = type;
		} else {
			user_obj.image_url = user.shot.images.teaser;
			user_obj.shot_url = user.shot.html_url;
			user_obj.username = user.follower.username;
			user_obj.user_url = user.follower.html_url;
			user_obj.user_type = type;
		}

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
