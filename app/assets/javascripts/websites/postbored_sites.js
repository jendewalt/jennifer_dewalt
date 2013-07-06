function postbored() {
	$('.notice').fadeOut(4000);
	$('.alert').fadeOut(4000);
	$('form').focus();

	$('form').on('submit', function (e) {
		if ($('#url_form').val().trim() == '') {
			e.preventDefault();
			alert('URL cannot be blank.');
			$('#url_form').focus();
		}

		if ($('#title_form').val().trim() == '') {
			e.preventDefault();
			alert('Title cannot be blank.');
			$('#title_form').focus();
		}
		
		if ($('#title_form').val().length > 255) {
			e.preventDefault();
			alert('Let\'s not write a book here! Keep it to 255 characters or less.');
			$('#title_form').focus();
		}
	});
};