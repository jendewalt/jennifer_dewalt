function kingOfComments() {
	$('.comment_entry').focus();

	$('#comment_entry_form').on('submit', function (e) {
		if ($('.name_entry').val().length > 30) {
			e.preventDefault();

			$('#enter_name').val('');
			alert('Name limit is 30 characters');
		
		} else if ($('.comment_entry').val().trim() == '') {
			e.preventDefault();

			$('.comment_entry').val('');
			alert('You really have nothing to say except nothing?');
			
		} else {
			$('.comment_entry').val($('.comment_entry').val().trim());
			$('.name_entry').val($('.name_entry').val().trim());
		}
	});

	$('.voter').on('keypress', function (e) {
		if (e.which == 13) {
			e.preventDefault();
		}
	});

};