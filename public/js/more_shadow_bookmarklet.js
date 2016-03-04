(function () {
	if (!($ = window.jQuery)) {
	    script = document.createElement( 'script' );
	    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';
	    script.onload = addMoreShadow;
	    document.body.appendChild(script);
	}
	else {
	    addMoreShadow();
	}

	function addMoreShadow() {
		showShadowNotice();

		$('*').css({
			'box-shadow': 'rgba(0,0,0,0.3) 0 0 0 0',
			'text-shadow': 'rgba(0,0,0,0.5) 0 0 0'
		});

		$('*').on('click', function (e) {
			e.stopPropagation();

			var cur_box_shadow = $(this).css('box-shadow').split('px');
			var box_blur = cur_box_shadow[cur_box_shadow.length - 3];
			var box_spread = cur_box_shadow[cur_box_shadow.length - 2];

			var cur_text_shadow = $(this).css('text-shadow').split('px');
			var text_blur = 2;
			var text_vertical = cur_text_shadow[cur_text_shadow.length - 3];

			$(this).css({
				'box-shadow': 'rgba(0, 0, 0, 0.3) 0px 0px ' + (parseInt(box_blur) + 1) + 'px ' + (parseInt(box_spread) + 1) + 'px',
				'text-shadow': 'rgba(0, 0, 0, 0.5) 0px ' + (parseInt(text_vertical) + 1) + 'px ' + (parseInt(text_blur) + 1) + 'px'
			});
		});
	}

	function showShadowNotice() {
		notice_html = '<h1>More Drop Shadow Enabled!</h1><p>Click any element to add more drop shadow.</p>';

		notice_style = '#more_drop_shadow_please {position: fixed; top: 0; width: 100%; padding: 20px; text-align: center; z-index: 1000000; background-color: rgba(255,255,255,0.9); color: #444;} #more_drop_shadow_please h1 {font-size: 16px; line-height: 22px;} p {font-size: 13px; line-height: 20px;}';

		$('<style />').html(notice_style).appendTo('body');

	    $('<div />', {
	    	id: 'more_drop_shadow_please'
	    }).append(notice_html).appendTo('body');

	    setTimeout(function () {
	    	$('#more_drop_shadow_please').fadeOut(500, function () {
	    		$(this).remove();
	    	});

	    }, 2500);
	}
}());
