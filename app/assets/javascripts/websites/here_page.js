function herePage() {
	navigator.geolocation.getCurrentPosition(requestLocalImages, handleError);

	function requestLocalImages(position) {
		$('#loading').fadeIn(300);
		$.ajax({
			type: 'POST',
			url: '/here/page',
			dataType: "json",
			data: {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			},
			complete: function (data) {
				loadPhotos(data.responseText)
			},
			error: function () {
				$('#error p').html('Looks like there was a problem finding your location. <br> Maybe <a href="/here/page">try again</a>?');
				$('#error').show();
			}
		});
	}

	function handleError(err) {
		$('#start').hide();
		if (err.code == 1) {
			$('#error p').html('This website requires location services. <br> Please allow geolocation and <a href="/here/page">reload</a> to continue.');
		} else {
			$('#error p').html('Looks like there was a problem finding your location. <br> Maybe <a href="/here/page">try again</a>?');			
		}
		$('#error').show();
	}

	function loadPhotos(response) {
		var images = $.parseJSON(response)

		if (images.length < 1) {
			$('#info, #loading').hide();
			$('#error p').text('Oh dear, this is unfortunate. We can\'t seem to find any Instagram photos near you.')
			$('#error').fadeIn();
		} else {
			_.each(images, function (img) {
				$('<img />', {
					src: img.img_url
				}).appendTo('#img_container');
			});

			showPhotos();
		}
	}

	function showPhotos() {
		$('#info, #loading').fadeOut(200, function () {
			$('#here').fadeIn(800, function () {
				setTimeout(function () {
					$('.modal').fadeOut(1000);
				}, 1200);
			});
		});
	}
}