$(document).ready(function (){
	$('textarea').focus();

	if (navigator.userAgent.indexOf('Mobile') !=-1) {
		$('#start').text('Tap "Start" to start typing and see a visual representation of how long your email is!')
		$('#prompt_container').append('<button>Start</button>');
		$('button').on('click', function () {
			$('#prompt_container').fadeOut('slow');
			$('textarea').focus();
			$('textarea').css('text-align', 'left');
		})
	}

	$('body').on('click', function () {
		$('textarea').focus();
	});

	$('textarea').one('keypress', function () {
		$('#prompt_container').fadeOut('slow');
		$('#info_container').fadeIn('slow');
	});

	$('textarea').on('keyup', function () {
		var text = $('textarea').val();
		var size = 130*(Math.pow(Math.pow(1/13, (1/250)), text.length));

		$('textarea').css('font-size', size + 'px');
		$('#char_count').text('Character Count: ' + text.length)

		if (text.length >= 150) {
			$('#info_container').css('background-color', '#f2ad00');
		} 
		if (text.length >= 200) {
			$('#info_container').css('background-color', '#ed6700');
		} 
		if (text.length >= 250) {
			$('#info_container').css('background-color', '#ba000d');
		} 
		if (text.length < 150) {
			$('#info_container').css('background-color', '#42863e');
		}
	});
});


