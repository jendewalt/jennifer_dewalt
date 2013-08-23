function tweetTime() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var radius = 7;
	var padded_height = 400;
	var height = padded_height + radius * 2 + 30;
	var width = 720 + radius * 2;
	var markers = [];
	var drawing;

	canvas.width = width;
	canvas.height = height;

	$('#username_input').focus();

	$('form').on('submit', function (e) {
		e.preventDefault();
		var username = $('#username_input').val();
		clearTimeout(drawing);

		$('#container h1').animate({opacity: 0}, 200, function () {
			$('form').animate({top: 0}, 400);
			$('#container').remove();
		});

		$.ajax({
			type: 'POST',
			url: '/tweet_time/page',
			dataType: "json",
			data: {
				username: username
			},
			complete: function (data) {
				startPlot(data.responseText);
			},
			error: function (xhr, status, error) {
				console.log(error)
				alert('Sorry, there seems to have been a problem with your search.');
			}
		});
	});

	$('body').on('click', function (e) {
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;

		_.each(markers, function (marker) {
			if (intersects(x, y, marker.x, marker.y, marker.radius)) {
				$('.tweet').text(marker.tweet);
			}
		});
	});

	function startPlot(response) {
		var tweets = $.parseJSON(response);

		if (tweets.length > 0) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			markers = [];

			$('body').css({'background-color': '#222'});
			$('#canvas_container').fadeIn(400, function () {
				makeMarkers(tweets);
			});		
		} else {
			alert('This person doesn\'t have any tweets!');
		}
	}

	function drawTimeScale() {
		var times = ['4 am', '8 am', '12 pm', '4 pm', '8 pm'];
		var spacing = canvas.width / 6;
		var pos = spacing;

		_.each(times, function (time, i) {
			ctx.beginPath();
			ctx.fillStyle = '#ff9800';

			ctx.font = '16px Arial Rounded MT Bold';
			ctx.textAlign = 'center';
			ctx.fillText(time, pos, canvas.height - 5);
			ctx.closePath();
			pos += spacing;
		});
	}

	function makeMarkers(tweets) {
		drawTimeScale();

		_.each(tweets, function (tweet) {
			markers.push(new Marker(tweet));
		});

		drawMarker(markers[0], 0, radius);
	}

	function Marker(tweet) {
		this.tweet = tweet.text;
		this.time = new Date(tweet.time);
		this.hours = new Date(tweet.time).getHours();
		this.mins = new Date(tweet.time).getMinutes();
		this.color = 'rgba(0, 183, 252, 0.7)';
		this.shadow = 'rgba(110, 215, 255, 0.15)';
		this.radius = radius;
	}

	function drawMarker(marker, i, y) {
		var spacing = padded_height / (markers.length + 1);
		var j = i + 1;

		if (markers.length >= j) {
			marker.x = (marker.hours * 60 + marker.mins) / 2 + marker.radius;
			marker.y = y;

			ctx.beginPath();
			ctx.fillStyle = marker.shadow;
			ctx.arc(marker.x, marker.y, marker.radius, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();

			ctx.beginPath();
			ctx.fillStyle = marker.color;
			ctx.arc(marker.x, marker.y, marker.radius / 1.5, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();

			drawing = setTimeout(function () {
				drawMarker(markers[j], j, y + spacing);
			}, 150);			
		}
	}

	function intersects(x, y, cx, cy, r) {
	    var dx = x - cx;
	    var dy = y - cy;
	    return dx * dx + dy * dy <= r * r;
	}
}