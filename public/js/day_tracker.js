$(document).ready(function () {
	var d = new Date();
	var	day = d.getDay();
	var	msg = ["Sunday Funday!",
			   "Back to the grind!",
			   "Oh. It's Tuesday.",
			   "Boom! Wednesday!",
			   "Thirsty Thursday, yo!",
			   "It's Friday! We should be kickin' it!",
			   "Paaarrrtttyyy!"]

	$('#' + day).attr('id', 'today');
	$("#message").text(msg[day]);
	
});