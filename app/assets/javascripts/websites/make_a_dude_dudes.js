function makeADude() {
	$('#make_a_dude_dude_name').on('keyup', function () {
		$('.dude_name').text($(this).val());
	});	

	$('#make_a_dude_dude_message').on('keyup', function () {
		$('.dude_message').text($(this).val());
	});	

	$('.color').on('change', function () {
		console.log('hi')
		$('.head').css('backgroundColor', '#' + this.color);
	});

	$('input').on('keypress', function (e) {
		if (e.which == 13) {
			e.preventDefault();		
		}
	});
}