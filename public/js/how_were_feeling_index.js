$(document).on('ready', function () {
	var serverBaseUrl = document.domain;
	var how_were_feeling = io.connect(serverBaseUrl + '/node/how_were_feeling', {resource: 'node/socket.io'});
	var sessionId = '';
	var total = $('#total').data('total');
	var average = 0;
	var keywords = {'#amazed': { color: '#49c59f', score: 1 },
					'#angry': { color: '#ec000e', score: 0 },
					'#annoyed': { color: '#f36a06', score: 0 },
					'#awesome': { color: '#ea007f', score: 1 },
					'#awkward': { color: '#39be48', score: 0 },
					'#bored': { color: '#dcd7cf', score: 0 },
					'#calm': { color: '#3e9ac5', score: 1 },
					'#confused': { color: '#857158', score: 0 },
					'#delighted': { color: '#b2db3f', score: 1 },
					'#depressed': { color: '#4b5a63', score: 0 },
					'#elated': { color: '#f57b43', score: 1 },
					'#excited': { color: '#fdc72b', score: 1 },
					'#grumpy': { color: '#5aa88f', score: 0 },
					'#happy': { color: '#f03a57', score: 1 },
					'#hopeful': { color: '#2fb5dd', score: 1 },
					'#hurt': { color: '#9d002e', score: 0 },
					'#jealous': { color: '#007a42', score: 0 },
					'#joyful': { color: '#ffdd60', score: 1 },
					'#like': { color: '#fbb5bf', score: 1 },
					'#lonely': { color: '#4b768a', score: 0 },
					'#neat': { color: '#ed3913', score: 1 },
					'#nervous': { color: '#899a19', score: 0 },
					'#proud': { color: '#7a2985', score: 1 },
					'#relaxed': { color: '#9ac4e0', score: 1 },
					'#sad': { color: '#006a7d', score: 0 },
					'#scared': { color: '#55473b', score: 0 },
					'#sexy': { color: '#f02b63', score: 1 },
					'#sleepy': { color: '#7c63a3', score: 0 },
					'#sorry': { color: '#8d9fc8', score: 0 },
					'#sweet': { color: '#f23b7a', score: 1 },
					'#thrilled': { color: '#ecf150', score: 1 },
					'#upset' : { color: '#3d5460', score: 0 }
				};

	_.each($('.circle'), function (circle) {
		var count = $(circle).data('count');
		var keyword = $(circle).data('keyword');
		average += keywords[keyword].score * count;
		$(circle).css({
			'background-color': keywords[keyword].color
		});
	});

	average = average / total * 100;

	$('#average_positive').text('Positivity Rating: ' + Math.round(average) + '%');

	$('li').on('mouseenter', function () {
		var count = $(this).find('.circle').data('count');
		$(this).find('p').text(count);
	});
	$('li').on('mouseleave', function () {
		var keyword = $(this).find('.circle').data('keyword');
		$(this).find('p').text(keyword);
	});

	how_were_feeling.on('data', function (data) {
		if (data.data) {
			data = data.data;
			var total = data.total;
			average = 0;
			for (var key in data.keywords) {
				var circle = $('.circle[data-keyword="' + key + '"]');
				var old_total = circle.data('count');
				var new_total = data.keywords[key];

				average += keywords[key].score * new_total;

				if (old_total < new_total) {
					flashCircle(circle);
				}

				$(circle).data('count', new_total);
			}

			average = average / total * 100;

			$('#average_positive').text('Positivity Rating: ' + Math.round(average) + '%');
			$('#total').text('Total Tweets: ' + total);
			$('#last_update').text('Last Update: ' + new Date().toTimeString());
		}
	});

	function flashCircle(circle) {
		circle.removeClass('glow');
		circle.addClass('glow');

		setTimeout(function () {
			circle.removeClass('glow');
		}, 500);
	}
});
