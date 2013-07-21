function downTheWeight() {
	var height_range = _.range(54, 85);
	var male_stats = {};
	var female_stats = {};

	_.each(height_range, function (height, i) {
		male_stats[String(height)] = 55.7 + i * 4.7;

		female_stats[String(height)] = 55.7 + i * 3.9;
	});

	$('form').on('submit', function (e) {
		e.preventDefault();

		$('input').blur();

		calculateWeights();
	});

	$('.print').on('click', function () {
		window.print();
	});

	$('#reset').on('click', function () {
		$('#chart_container').hide();
		$('.modal').fadeIn(300);
		$('tbody').remove();
	});

	function calculateWeights() {
		var w0 = $('#current_weight').val().replace(' ', '');
		var wf = $('#goal_weight').val().replace(' ', '');
		var delta_t = $('#diet_length').val().replace(' ', '');
		var height = $('#height').val();
		var gender_stats = $('input:radio:checked').val()== 'male' ? male_stats : female_stats;
		var w_min = gender_stats[height];

		if (w0 <= 0 || wf <= 0 || delta_t <= 0 || 
			isNaN(w0) || isNaN(wf) || isNaN(delta_t)) {
			alert('All fields must be filled in with values greater than 0.');
		} else {
			var A = (w0 - w_min);
			var lambda = (-1/delta_t) * Math.log((wf - w_min) / (w0 - w_min));
			var days = _.range(0, Number(delta_t) + 1);

			var weights = _.map(days, function (t) {
				return (A * Math.exp(-lambda * t) + w_min).toFixed(2);
			});	

			if (weights[0] == 'NaN') {
				alert('You\'re goal weight is too low. Please enter a higher number for your goal weight.');
			} else {
				createChart(weights);		
			}
		}
	};

	function createChart(weights) {
		var lbs_lost = 0;
		var last_weight = weights[0];
		var today = new Date();

		_.each(weights, function (weight, i) {
			var date = getNextDay(today, i);
			lbs_lost += last_weight - weight;

			$('<tr />').append('<td>' + date + '</td>')
					   .append('<td>' + weight + '</td>')
					   .append('<td>' + lbs_lost.toFixed(2) + '</td>')
					   .appendTo('#weight_chart');

			last_weight = weight;
		});

		$('#chart_container').fadeIn(300);
		$('.modal').fadeOut(300);
	};

	function getNextDay(start_date, days) {
		new_date = new Date(start_date.getTime() + days*24*60*60*1000);
		return (new_date.getMonth() + 1) + '/' + new_date.getDate() + '/' + new_date.getFullYear()
	};

};