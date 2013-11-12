function otherSide() {
	var geocoder = new google.maps.Geocoder();
	var input_map;
	var other_map;
	var markers = [];
	var map_zoom = 3;
	var first = true;

	$('#address_input').focus();

	$('form').on('submit', function (e) {
		e.preventDefault();
		var address = $('#address_input').val().replace(/^\s+|\s+$/g, '');

		if (address == '') {
			alert('Please enter a valid address or zipcode.');
		} else {
			$('#address_input').val('').attr('placeholder', address).focus();
			clearMarkers(address);			
		}
	});

	function getLocations(address) {
		geocoder.geocode( {'address': address}, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var input_location = results[0].geometry.location;
				var lat = input_location.lat();
				var lng = input_location.lng();

				// var lat = results[0].geometry.location.lb;
				// var lng = results[0].geometry.location.mb;

				// var input_location = new google.maps.LatLng(lat, lng);
				// var other_location = new google.maps.LatLng(lat * -1, lng > 0 ? (180 - lng) * -1 : 180 - Math.abs(lng));
				var other_location = new google.maps.LatLng(lat * -1, lng > 0 ? (180 - lng) * -1 : 180 - Math.abs(lng));

				if (first) {
					var inputMapOptions = {
						zoom: map_zoom,
						center: input_location,
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};
					var otherMapOptions = {
						zoom: map_zoom,
						center: other_location,
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};
					input_map = new google.maps.Map($('#input_map')[0], inputMapOptions);
					other_map = new google.maps.Map($('#other_map')[0], otherMapOptions);
				}

				setNewMarker(input_location, input_map);
				setNewMarker(other_location, other_map);
			} else {
				alert('We could not find any results. Please check your input and try again.');
			}
		});
	}

	function setNewMarker(location, map) {
		map.setCenter(location);
		map.setZoom = map_zoom;
		var marker = new google.maps.Marker({
			map: map,
			position: location
		});
		markers.push(marker);

		if (first) {
			showMaps();
			first = false;
		}
	}

	function clearMarkers(address) {
		_.each(markers, function (marker) {
			marker.setMap(null);
		});
		markers = [];

		getLocations(address);
	}

	function showMaps() {
		$('#headlines').animate({'opacity': 0}, 200, function () {
			$('#headlines').remove();
			$('header').animate({'opacity': 1}, 400);

			$('form').animate({
				'top': 60,
			}, 400, function () {
				$('#map_container').animate({'opacity': 1}, 400);
			});
		});
	}
}