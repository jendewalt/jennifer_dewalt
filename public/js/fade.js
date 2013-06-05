(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);

$(document).ready(function () {
	var colors = [[324,72,48], [161,83,58]],
		orig_colors = [],
		cur_i = 0,
		tar_i = 1;

	$('#0 .color').val('#d4228d');
	$('#1 .color').val('#3bedb5');

	$('#0').css('backgroundColor', '#d4228d');
	$('#1').css('backgroundColor', '#3bedb5');

	$('.color').on('change', function () {
		var parent = this.parentNode.id,
			h = this.color.hsv[0]*60,
			s = this.color.hsv[1],
			v = this.color.hsv[2];

		converted_color = hsv2hsl(h, s, v); 

		$('#' + parent).css('backgroundColor', formatHSL(converted_color[0], converted_color[1], converted_color[2]));

		colors[parent] = converted_color;
	});

	$('form').on('submit', function (e) {
		e.preventDefault();

		changeColor();
	});

	function changeColor() {
		if (colors[cur_i][0] != colors[tar_i][0]) {
			colors[cur_i][0] += (colors[cur_i][0] < colors[tar_i][0] ? 1 : -1);
		}
		if (colors[cur_i][1] != colors[tar_i][1]) {
			colors[cur_i][1] += (colors[cur_i][1] < colors[tar_i][1] ? 1 : -1);
		}
		if (colors[cur_i][2] != colors[tar_i][2]) {
			colors[cur_i][2] += (colors[cur_i][2] < colors[tar_i][2] ? 1 : -1);
		} 
		
		if (colors[cur_i][0] == colors[tar_i][0] && colors[cur_i][1] == colors[tar_i][1] && colors[cur_i][2] == colors[tar_i][2]) {
			$('form').animate({
				top: 190
			}, 500);
		}

		setTimeout(function () {
			$('body').css('backgroundColor', formatHSL(colors[cur_i][0], colors[cur_i][1], colors[cur_i][2]));
			changeColor();
		}, 200);
	};

	function hsv2hsl(hue,sat,val){
	    return [ 
	        Math.round(hue),

	        Math.round((sat * val/((hue = (2 - sat) * val) < 1 ? hue: 2 - hue)) * 100), 
			
	        Math.round(hue/2 * 100)
	    ];
	};

	function formatHSL(h, s, l) {
		return 'hsl(' + h + ', ' + s + '%, ' + l + '%)' ;
	};

	
	$('body').disableSelection();
	
});