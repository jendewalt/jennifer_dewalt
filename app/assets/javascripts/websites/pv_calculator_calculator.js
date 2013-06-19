function pvCalculator() {
	var revenue_field = '<tr class="year_rev"><td class="label">Yearly Revenue:</td><td><input type="text" class="revenue"></td></tr>'

	$('.tab').on('click', function () {
		$('.tab').removeClass('active');
		$(this).addClass('active');

		$('.calc_container').hide();
		$('#' + this.id + '_calc').show();
	});

	$('#basic_years_btn').on('click', function (e) {
		e.preventDefault();
		var num_years = $('#basic_years').val();
		if (!$.isNumeric(num_years)) {
			$('#basic_years').val('10');
			num_years = 10;
		}
		
		addRevenueFields(num_years);
	});

	$('#basic_calc form').on('change', function (e) {
		e.preventDefault();
		calculateBasic();		
	});

	$('#basic_calc form').on('submit', function (e) {
		e.preventDefault();
		calculateBasic();		
	});

	$('#compounding_calc form').on('submit', function (e) {
		e.preventDefault();
		calculateCompound();						
	});

	$('#compounding_calc form').on('change', function (e) {
		e.preventDefault();
		calculateCompound();						
	});

	$('#offset_calc form').on('submit', function (e) {
		e.preventDefault();
		calculateOffset();					
	});

	$('#offset_calc form').on('change', function (e) {
		e.preventDefault();
		calculateOffset();					
	});

	function calculateOffset() {
		var r = parseFloat($('#offset_calc .int_rate').val()),
			y = parseFloat($('#offset_calc .num_years').val()),
			x = parseFloat($('#offset_calc .num_years_no_rev').val()),
			c = parseFloat($('#offset_calc .revenue').val()),
			g = parseFloat($('#offset_calc .growth').val()),
			t = y - x,
			answer = 0;

		answer = (c / (r - g)) - (c / (r - g) * Math.pow((1 + g), t) / Math.pow((1 + r), t)) / Math.pow((1+r), x);

		updateAnswer(answer, '#offset_calc');
	};

	function calculateCompound() {
		var r = parseFloat($('#compounding_calc .int_rate').val()),
			t = parseFloat($('#compounding_calc .num_years').val()),
			c = parseFloat($('#compounding_calc .revenue').val()),
			g = parseFloat($('#compounding_calc .growth').val()),
			answer = 0;

		answer = (c / (r - g)) - (c / (r - g)) * (Math.pow((1 + g), t) / Math.pow((1 + r), t));

		updateAnswer(answer, '#compounding_calc');
	};

	function calculateBasic() {
		var r = parseFloat($('#basic_calc .int_rate').val()),
			revs = $('.year_rev input'),
			answer = 0;

		_.each(revs, function (rev, i) {
			var c = $(rev).val();

			answer = answer + (c / (Math.pow((1 + r), i+1)));
		});

		updateAnswer(answer, '#basic_calc');
	};

	function updateAnswer(ans, id) {
		if ($.isNumeric(ans)) {
			$(id + ' .answer').text(ans.toFixed(2));
		} else {
			$(id + ' .answer').text('00.00');			
		}
			$(id + ' .answer_container').show();		
	};

	function addRevenueFields(num) {
		var existing_fields = $('.year_rev').length;
		var diff = existing_fields - num;

		if (diff > 0) {
			$('#basic_calc').find('.year_rev:nth-last-child(-n+' + diff + ')').remove();	
		} else if (diff < 0) {
			_.each(_.range(diff * -1), function (i) {
				$(revenue_field).appendTo('#basic_calc table');
			});	
		}
	};
};