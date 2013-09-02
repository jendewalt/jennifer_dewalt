function whatDay() {
	var date = new Date()
		date.setHours(0,0,0,0);
	var today = {
		month: date.getMonth(),
		date: date.getDate(),
		year: date.getFullYear()
	};
	var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	var text = '';

	$('form .month').val(today.month + 1);
	$('form .date').val(today.date);
	$('form .year').val(today.year);

	$('#day_container').text(months[today.month] + ' ' + today.date + ', ' + today.year + ' is a ' + days[date.getDay()]);

	getWikiEvents(months[today.month] + "%20" + today.date);

	$('form').on('submit', function (e) {
		$('#result').hide();
		e.preventDefault();
		var req_date = {
			month: Number($.trim($('form .month').val())) - 1,
			date: Number($.trim($('form .date').val())),
			year: Number($.trim($('form .year').val()))			
		}
		
		if (isNaN(req_date.month) || isNaN(req_date.date) || isNaN(req_date.year)) {
			req_date.month = today.month;
			req_date.date = today.date;
			req_date.year = today.year;
		}

		var new_date = new Date(req_date.year, req_date.month, req_date.date);
		var is_was = new_date < date ? 'was' : 'is';
		var text = months[new_date.getMonth()] + ' ' + new_date.getDate() + ', ' + new_date.getFullYear() + ' ' + is_was + ' a ' + days[new_date.getDay()]

		$('#day_container').text(text);
		$('form .month').val(new_date.getMonth() + 1);
		$('form .date').val(new_date.getDate());
		$('form .year').val(new_date.getFullYear());

		getWikiEvents(months[new_date.getMonth()] + "%20" + new_date.getDate());
	});

	function getWikiEvents(page) {
		$.getJSON("http://en.wikipedia.org//w/api.php?action=parse&format=json&page=" + page + "&prop=text&section=1&callback=?", function (data) { 
			wikipediaPageResult(data) 
		});
	} 

	function wikipediaPageResult(response) {
		if (response.parse) {
			var text = response.parse.text['*'].split('<ul>');
			text = text[1].split('</ul>')[0];
			$('#events_container').html(text);
		}

		$('#result').fadeIn(300);
	}
}
