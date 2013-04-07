$(document).ready(function () {
	var d = new Date();
	var	day = d.getDate();
	var	msg = ["",
			   "Back to the grind!",
			   "Oh. It's Tuesday.",
			   "Boom! Wednesday!",
			   "Thirsty Thursday, yo!",
			   "It's Friday! We should be kickin' it!",
			   "Paaarrrtttyyy!",
			   "Sunday Funday!"]

	$('#' + day).attr('id', 'today');
	$("#message").text(msg[day]);
	
});