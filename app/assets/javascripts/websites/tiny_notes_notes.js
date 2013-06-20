function tinyNotes() {
	$('form').focus();

	$('form').on('submit', function (e) {
		if ($('input[type=text]').val().trim() == '') {
			e.preventDefault();
			alert('This is Tiny Notes, not Non-Existent Notes!');
			$('input[type=text]').focus();
		}
		
		if ($('input[type=text]').val().length > 255) {
			e.preventDefault();
			alert('This is Tiny Notes, not Insanely Long Notes! Keep it to 255 characters or less.');
			$('input[type=text]').focus();
		}
	});
}