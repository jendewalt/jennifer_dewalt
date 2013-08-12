function needDrink() {
	var map;
	var service;
	var infowindow;
	var bar_results;

	navigator.geolocation.getCurrentPosition(getResults, handleError);

	$('.btn').on('click', function () {
		if (bar_results.length > 0) {
			showABar();
		} else {
			$('#bar_result').text('No more search results');
		}
	});
	
	function getResults(position) {
		var location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

		map = new google.maps.Map(document.getElementById('map'), {
	    	mapTypeId: google.maps.MapTypeId.ROADMAP,
	    	center: location,
	    	zoom: 15
	    });

	    var request = {
	    	location: location,
	    	radius: '500',
	    	types: ['bar', 'night_club'],
	    	openNow: true,
	    	radius: 700
	    };

	    infowindow = new google.maps.InfoWindow();
	    service = new google.maps.places.PlacesService(map);
  		service.nearbySearch(request, callback);
	}

	function callback(results, status) {
		bar_results = results;
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			showABar();
		} else {
			$('.inner_modal').fadeOut(300, function () {
				$('.inner_modal').html('<h1>Sorry. No results found.</h1><h2>Looks like you\'re on your own. Good luck thirsty one!</h2>').fadeIn(300);
			});
		}
	}

	function showABar() {
		if (bar_results.length == 0) {
			$('.inner_modal').fadeOut(300, function () {
				$('.inner_modal').html('<h1>Sorry. No results found.</h1><h2>Looks like you\'re on your own. Good luck thirsty one!</h2>').fadeIn(300);
			});
		} else {
			var bar = bar_results[randomInt(0, bar_results.length - 1)];
			var barLoc = bar.geometry.location;
			var marker = new google.maps.Marker({
				map: map,
				position: barLoc
			});

			google.maps.event.addListener(marker, 'click', function () {
				var content = bar.name + '<br>' + bar.vicinity
				infowindow.setContent(content);
				infowindow.open(map, this);
			});

			$('#bar_result').text(bar.name + ' is open for drinks!');

			bar_results = _.reject(bar_results, function (bar_result) {
				if (bar_result == bar) {
					return true;
				}
			});

			$('.modal').fadeOut(500);
		}
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
}