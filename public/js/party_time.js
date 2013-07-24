$(document).ready(function () {
	$('form').on('submit', function (event) {
		event.preventDefault();

		var months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
		var year
		var month
		var day
		var birthday

		if ( $('#bday').val() == 0 ) {
			$('.party').text('No Birthday? No Parties for You!');
		} else { 

			var birthday  = $('#bday').val();
				if (birthday.indexOf("/") >= 0) {
					birthday = birthday.split('/');   //[ month, day, year]
					var year  = birthday[2];
					var month = (birthday[0])-1;
					var day   = birthday[1];
					
				} else {
					birthday = birthday.split('-');   //[ year, month, day ]
					var year  = birthday[0];
					var month = (birthday[1])-1;
					var day   = birthday[2];
					
				} 

			var birthtime = $('#btime').val().split(':');

			var hour  = birthtime[0];
			var min   = birthtime[1];
			var bday  = new Date(year, month, day);
			var btime = new Date(year, month, day, hour, min);
			var today = new Date();
			var todayStr = today.toDateString();

			if (birthtime == 0) {
				btime = bday;
			}

			var age   = today.getFullYear() - year;

			if (today.getMonth() < month || (today.getMonth() == month && today.getDate() < day)) {
				age--;
			}

			// var age           = getAge();
			var ageInDays     = Math.floor((today - bday) / (24 * 60 * 60 * 1000));
			var ageInMins     = Math.floor((today - btime) / ( 60 * 1000));
			var tenKDay       = (new Date(bday.getTime() + 86400000 * 10000));
			var twentyKDay    = (new Date(bday.getTime() + 86400000 * 20000));
			var fiveHundkHour = (new Date(bday.getTime() + 1800000000000));
			var millionMin    = (new Date(bday.getTime() + 60000000000));
			var tenMillionMin  = (new Date(bday.getTime() + 600000000000));
			var fiftyMillionMin = (new Date(bday.getTime() + 3000000000000));
			var onBillionSec = (new Date(bday.getTime() + 1000000000000));

			if (today.getMonth() == bday.getMonth() && today.getDate() == bday.getDate()) {
				$('.party').text("Today's your birthday?! PARTY TIME!");
			} else if (todayStr == (tenKDay.toDateString() || twentyKDay.toDateString() || fiveHundkHour.toDateString() || millionMin.toDateString() || tenMillionMin() || fiftyMillionMin() ) ) {
				$('.party').text("Looks Like We've Got a Party Here!");
				
			} else {
				$('.party').text("Boo! No Parties Today.");				
			}

			$(".bdays.date").text("Your birthday is " + months[month] + ' ' + day);

			if (age == 1) {
				$(".bdays.age.years").text("You're " + age + ' year old');
			} else {
				$(".bdays.age.years").text("You're " + age + ' years old');
			}

			if (ageInDays == 1) {
				$(".bdays.age.days").text("You're " + ageInDays + ' day old');
			} else {
				$(".bdays.age.days").text("You're " + ageInDays + ' days old');
			}

			if (ageInMins == 1){
				$(".bdays.age.mins").text("You're " + ageInMins + ' minute old');
			} else {
				$(".bdays.age.mins").text("You're " + ageInMins + ' minutes old');
			}

			if (today <= tenKDay) {
				$(".bdays.10k").text("Your 10,000th day is " + tenKDay.toDateString());
			} else {
				$(".bdays.10k").text("Your 10,000th day was " + tenKDay.toDateString());
			}

			if (today <= twentyKDay) {
				$(".bdays.20k").text("Your 20,000th day is " + twentyKDay.toDateString());
			} else {
				$(".bdays.20k").text("Your 20,000th day was " + twentyKDay.toDateString());
			}

			if (today <= fiveHundkHour) {
				$(".bdays.500k").text("Your 500,000th hour is " + fiveHundkHour.toDateString());			
			} else {
				$(".bdays.500k").text("Your 500,000th hour was " + fiveHundkHour.toDateString());						
			}

			if (today <= millionMin) {
				$(".bdays.1mil").text("Your one millionth minute is " + millionMin.toDateString());			
			} else {
				$(".bdays.1mil").text("Your one millionth minute was " + millionMin.toDateString());			
			}

			if (today <= tenMillionMin) {
				$(".bdays.10mil").text("Your ten millionth minute is " + tenMillionMin.toDateString());
			} else {
				$(".bdays.10mil").text("Your ten millionth minute was " + tenMillionMin.toDateString());			
			}

			if (today <= fiftyMillionMin) {
				$(".bdays.50mil").text("Your fifty millionth minute is " + fiftyMillionMin.toDateString());
			} else {
				$(".bdays.50mil").text("Your fifty millionth minute was " + fiftyMillionMin.toDateString());			
			}

			if (today <= onBillionSec) {
				$(".bdays.1bil").text("Your one billionth second is " + onBillionSec.toDateString());
			} else {
				$(".bdays.1bil").text("Your one billionth second was " + onBillionSec.toDateString());			
			}


			function getAge() {
				var age   = today.getFullYear() - year;

				if (today.getMonth() < month || (today.getMonth() == month && today.getDate() < day)) {
					age--;
				}
				return age;
			};
		}
	});
});

