$(document).ready(function () {
	var d = new Date()
		day = d.getDate()
		msg = ["Sunday Funday!",
			   "Back to the grind!",
			   "Oh. It's Tuesday.",
			   "Boom! Wednesday!",
			   "Thirsty Thursday, yo!",
			   "It's Friday! We should be kickin' it!",
			   "Paaarrrtttyyy!"]

	$('#' + day).attr('id', 'today');
	$("#message").text(msg[day]);
	
});