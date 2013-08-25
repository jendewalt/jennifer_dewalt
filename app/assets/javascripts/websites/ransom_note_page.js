function ransomNote() {
	$('#note_text').focus();

	$('form').on('submit', function (e) {
		e.preventDefault();
		var note = $('#note_text').val().split('');

		$('.loading_container').show();
		$('#note_container').hide();

		$.ajax({
			type: 'POST',
			url: '/ransom_note/page',
			dataType: "json",
			data: {
				note: note
			},
			complete: function (data) {
				loadPhotos(data.responseText);
			},
			error: function () {
				alert('There was a problem!');
			}
		});
	});

	function loadPhotos(response) {
		var urls = $.parseJSON(response);
		$('#note_container').html('');

		var begin = true;
		var html = '';
		_.each(urls, function (url) {
			style = 'style="transform: rotate(' + randomInt(-10, 10) + 'deg); -ms-transform: rotate(' + randomInt(-10, 10) + 'deg); -webkit-transform: rotate(' + randomInt(-10, 10) + 'deg);"';

			if (begin) {
				begin = false;
				html += '<div class="word">' + '<img src="' + url + '" class="char"' + ' ' + style + '>'
			} else if (url == '/assets/ransom_space.png') {
				begin = true;
				html += '<img src="' + url + '" class="char"' + ' ' + style + '></div>'
			} else {
				html += '<img src="' + url + '" class="char"' + ' ' + style + '>'
			}
		});

		_.each($('.char'), function (image) {
			
			image.css({
				'transform': 'rotate(' + randomInt(-10, 10) + 'deg)',
				'-ms-transform': 'rotate(' + randomInt(-10, 10) + 'deg)',
				'-webkit-transform': 'rotate(' + randomInt(-10, 10) + 'deg)',
			});
		});

		$('.loading_container').hide();
		$('#note_container').html(html + '</div><br class="clear">').show();
	}
}