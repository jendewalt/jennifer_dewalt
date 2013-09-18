function googleFontsBrowser () {
	var url = 'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyDgafgp1DZT6I464W9r4FDiD25HfC3a1zc';
	var api_url_prefix = 'https://fonts.googleapis.com/css?family=';
	var family_list = [];
	var fonts = [];
	var font_input = $('#font_input');
	var autocomplete = $('#autocomplete');

	$.ajax({
		url: url,
		type: "GET",
		dataType: 'json',
		success: function (data) {
			extractFonts(data);
		},
		error: function (xhr, status) {
			alert('There was a problem retrieving the fonts.');
		}
	});

	font_input.on('keyup', function () {
		getFontList($(this).val());
	}).on('focus', function () {
		autocomplete.show();
	});

	$('form').on('submit', function (e) {
		e.preventDefault();
		applyFont(font_input.val());
	});

	function extractFonts(data) {
		_.each(data.items, function (font_data) {
			font = {
				family: font_data.family,
				subsets: font_data.subsets,
				variants: font_data.variants
			};

			family_list.push(font.family);
			fonts.push(font);
		});
	}

	function getFontList(input) {
		length = input.length;
		autocomplete.show();
		autocomplete.html('');

		if (input.length) {
			_.each(family_list, function (family) {
				if (family.slice(0, length).toLowerCase() == input.toLowerCase()) {
					$('<li>', {
						text: family
					}).on('click', function() {
						font_input.val(family);
						applyFont(family);
					}).appendTo(autocomplete);
				}
			});
		}
	}

	function applyFont(req_font) {
		req_font = $.trim(req_font);
		autocomplete.hide();

		var formatted_font = _.find(family_list, function (family) {
			return family.toLowerCase() == req_font.toLowerCase();
		});

		if (formatted_font) {
			var font = _.findWhere(fonts,  { family: formatted_font });
			var api_url = api_url_prefix + font.family.replace(/ /g, '+') + ':' + font.variants.join() + '&subset=' + font.subsets.join();

			$('.google_font').remove();
			$(font_input).attr('placeholder', font.family).val('');
			$('.sample').css('font-family', font.family);
			$('#api_tag').text('<link href="' + api_url + '" rel="stylesheet" type="text/css">')
			$('head').append('<link href="' + api_url + '" rel="stylesheet" type="text/css" class="google_font">');
		}
	}
}