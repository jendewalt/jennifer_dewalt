function liquorLikes() {
	$('.liquor').on('click', function (e) {
		if (e.target.className == 'like_btn') {
			var $like_count = $(this).find('.like_count span');
			$like_count.html(Number($like_count.html()) + 1);
			$(e.target).attr('disabled', 'disabled').html('Liked!');
			if (Number($like_count.html()) == 1) {
				$(this).find('.people').html('person');
			} else {
				$(this).find('.people').html('people');				
			}

			$.ajax({
				type: 'POST',
				url: '/liquor_likes/likes',
				data: {
					liquor_id: e.target.id
				},
				error: function (xhr) {
					if (xhr.status == 401) {
						window.location = '/users/sign_in';
					}
				}
			});
		}
	});
};