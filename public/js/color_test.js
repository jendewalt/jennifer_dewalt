(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);

$(document).ready(function () {
	var tHue = Math.floor(Math.random()*360),
		tSat = Math.floor(Math.random()*100),
		tLit = Math.floor(Math.random()*100),
		curHue = 0,
		curSat = 0,
		curLit = 0,
		percentDiff,
		tries = 0,
		testColor = 'hsl('+tHue+', '+tSat+'%, '+tLit+'%)',
		satRange = ($(document).height()) - ($(window).height());

	$('body').disableSelection();		

	$('#test_sample').css('backgroundColor', testColor);

	$('#info_tab').on('click', function() {
		$('#info').show();
	});

	$('.close').on('click', function () {
		$('#info').hide();
	});

	$('#user_sample').on('mousemove', function (e) {
		var x = e.pageX - $('#user_sample').offset().left;
		var y = e.pageY - $('#user_sample').offset().top;

		curHue = Math.floor(x / 300 * 360);
		curLit = Math.floor(y / 300 * 100);

		updateSample();
	});

	$(window).scroll(function() {
     	var scrollPos = $(window).scrollTop();
     	curSat = Math.round((scrollPos/satRange)*100);
		updateSample();
 	});

 	$('#user_sample').on('click', function () {
 		var sHue = curHue,
 			sSat = curSat,
 			sLit = curLit;

 		tries++;

 		calcColorDiff(sHue, sSat, sLit);
 	});

 	function calcColorDiff(h, s, l) {
 		var	percentOffH = Math.abs((h/360) - (tHue/360)),
 			percentOffS = Math.abs((s/360) - (tSat/360)),
 			percentOffL = Math.abs((l/360) - (tLit/360));

 		displayResults(percentOffH, percentOffS, percentOffL);
 	};

 	function displayResults(ph, ps, pl) {
 		var h = (ph*100).toFixed(2),
 			s = (ps*100).toFixed(2),
 			l = (pl*100).toFixed(2);

 		if (h == 0.00 && s == 0.00 && l == 0.00) {
 			$('#win h2').text('It took you '+ tries +' tries to get the exact match.') 
 			$('#win').show();
 		} else if (h < 2.00 && s < 2.00 && l < 2.00) {
 			$('#message').text('Getting very close!');
 			$('#hue').text('Hue: '+ h + '%');
 			$('#sat').text('Saturation: '+ s + '%');
 			$('#lit').text('Lightness: '+ l + '%'); 			
 		} else {
 			$('#message').text('Nope, you\'re off by:');
 			$('#hue').text('Hue: '+ h + '%');
 			$('#sat').text('Saturation: '+ s + '%');
 			$('#lit').text('Lightness: '+ l + '%'); 
 		}
 	};

	function updateSample() {
		$('#user_sample').css('backgroundColor', 'hsl('+curHue+', '+curSat+'%, '+curLit+'%)');
	};
});


















