(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);

$(document).ready(function () {
	var canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d'),
		h = window.innerHeight - 112,
		w = window.innerWidth - 40;

		canvas.height = h;
		canvas.width = w;

	(function( pen, $, undefined ) {
	    //Private Property
	 
	    //Public Property
	    pen.x = 390;
	    pen.y = 265;
	    pen.size = 10;
	    pen.color = '#000';
	    marks = [];

	     
	    //Public Method
	    pen.move = function() {
	        penTipMove();
	    };
	    pen.draw = function() {
	    	drawMarks();
	    };
	     
	    //Private Method
	    function penTipMove() {
	    	ctx.clearRect(0, 0, w, h);
	    	
	    	_.each(marks, function (m) {
	    		ctx.fillStyle = m.color;
	    		ctx.fillRect(m.x, m.y, m.size, m.size);
	    	});

	    	if (pen.color == '#ffffff') {
		      ctx.beginPath();
		      ctx.rect(pen.x, pen.y, pen.size, pen.size);
		      ctx.fillStyle = pen.color;
		      ctx.fill();
		      ctx.lineWidth = 1;
		      ctx.strokeStyle = 'black';
		      ctx.stroke();
	    	} else {
	    		ctx.fillStyle = pen.color;
	    		ctx.fillRect(pen.x, pen.y, pen.size, pen.size);
	    	}
	    };

	    function Mark() {
	    	this.x = pen.x;
	    	this.y = pen.y;
	    	this.size = pen.size;
	    	this.color = pen.color;
	    };

	    function drawMarks() {
	    	penTipMove();
	    	marks.push(new Mark());
	    };
	}( window.pen = window.pen || {}, jQuery ));

	$('canvas').disableSelection();

	$('#canvas').on('mousemove', function (e) {
		getPenPosition(e);
		pen.move();
	});

	$('#canvas').on('mousedown', function (e) {
		getPenPosition(e);
		pen.draw();	

		$('#canvas').on('mousemove', function (e) {
			getPenPosition(e);
			pen.draw();			
		});

		$('canvas').on('mouseup', function (e) {
			$('#canvas').off('mousemove', pen.draw());
			
			$('#canvas').on('mousemove', function (e) {
				getPenPosition(e);
				pen.move();
			});
		});
	});

	$('.color').on('change', function () {
		var newColor = $('.color').val();
		pen.color = '#' + newColor.toLowerCase();
	});
	$('.size').on('change', function () {
		var size = $('.size').val();

		if (!($.isNumeric(size))){
			alert('Size must be a number')
		} else {
			pen.size = size;
		}
	});
	$('.eraser').on('click', function () {
		pen.color = '#ffffff'
	});
	$('.erase_all').on('click', function () {
		if (confirm('Are you sure you want to erase everything?')){
			ctx.clearRect(0, 0, w, h);
			marks = [];
		} else {
			return;
		}
	})


	function getPenPosition(e) {
		pen.x = e.pageX - canvas.offsetLeft;
		pen.y = e.pageY - canvas.offsetTop;
	}
});











