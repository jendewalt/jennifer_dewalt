function elevationPage() {
	var geocoder = new google.maps.Geocoder();
	var elevator = new google.maps.ElevationService();
	var path = [];
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var width = 750;
	var height = 450;
	var sample_size = 250;
	var drawing;

	canvas.width = width;
	canvas.height = height;

	$('#start').focus();

	$('form').on('submit', function (e) {
		e.preventDefault();
		path = [];
		var start_loc = $('#start').val();
		var end_loc = $('#end').val();

		var locations = [
			start_loc,
			end_loc
		];

		clearTimeout(drawing);

		$('#form_container').fadeOut(300, function () {
			$('h1').remove();
			$('p').remove();
			$('.btn').css('display', 'inline-block');
			$('.input').css({
				'margin': 5
			});

			$('#start').focus();

			$('#form_container').css({
				'width': 720,
				'padding': 10
			}).fadeIn(300);

			$('#graph_container').fadeIn(300, function () {
				getLatLng(locations);
			});
		});
	});

	function getLatLng(locations) {
		_.each(locations, function (loc, i) {
			geocoder.geocode( {'address': loc}, function (results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					// var latlng = new google.maps.LatLng(results[0].geometry.location.lb, results[0].geometry.location.mb);
					var latlng = results[0].geometry.location;
					path.push(latlng);

					if (i == 0){
						$('#start').attr('placeholder', results[0].formatted_address).val('');						
					} else {
						$('#end').attr('placeholder', results[0].formatted_address).val('');						
					}

					if (path.length == 2) {
						getElevations();
					} 
				} else {
					alert("Geocode was not successful for the following reason: " + status);
				}
			});
		});
	}

	function getElevations() {
		var path_request = {
			'path': path,
			'samples': sample_size
		}

		elevator.getElevationAlongPath(path_request, plotElevation);
	}

	function plotElevation(results, status) {
		ctx.clearRect(0,0,width,height);
		if (status == google.maps.ElevationStatus.OK) {
			getAdjustedPoints(results);
		} else {
			alert("Unable to plot elevations for the following reason: " + status);
		}
	}

	function getAdjustedPoints(locations) {
		var elevations = _.map(locations, function(elev) {
			return elev.elevation;
		});

		var high = Math.max.apply( Math, elevations );
		var low = Math.min.apply( Math, elevations );

		var adj_elev = _.map(elevations, function(elev) {
			return height - ((elev - low) / (high - low) * height);
		});

		$('#min').text('Min Elevation: ' + low.toFixed(2) + ' m');
		$('#max').text('Max Elevation: ' + high.toFixed(2) + ' m');

		drawPlotLine(0, adj_elev, 1);
	}

	function drawPlotLine(x, elevations, i) {
		var spacing = width / sample_size;

		if (elevations.length >= i + 1) {
			ctx.beginPath();
			ctx.lineWidth = 3;
			ctx.strokeStyle = '#fff';
			ctx.moveTo(x, elevations[i - 1])
			x += spacing;
			ctx.lineTo(x, elevations[i]);
			ctx.lineJoin = 'miter';
			ctx.stroke();
			ctx.closePath();

			drawing = setTimeout(function () {
				drawPlotLine(x, elevations, i+1);
			}, 50);
		}
	}
}
