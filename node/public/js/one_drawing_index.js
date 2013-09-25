(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);

$(document).on('ready', function () {
	var serverBaseUrl = document.domain;
	var one_drawing = io.connect(serverBaseUrl + '/node/one_drawing', {resource: 'node/socket.io'});
	var sessionId = '';
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var cur_color = '#000';
	var cur_size = 8;
	var hiddenCanvas = document.createElement('canvas');
    var hidden_ctx = hiddenCanvas.getContext('2d');
	var points = [];
	var height = 600;
	var width = 800;
	var image = new Image();
	var url_data = $(canvas).data('url');
	var mouse = {};

	canvas.tool = 'brush';
	hiddenCanvas.height = canvas.height = height;
	hiddenCanvas.width = canvas.width = width;

	$('body').disableSelection();

	trackCursor();

	image.onload = function () {
		ctx.drawImage(image, 0, 0);
		hidden_ctx.drawImage(image, 0, 0);
	};

	$(canvas).on('mousedown', function (e) {
		if (canvas.tool != 'eyedropper') {
			points.push({
				x: e.pageX - canvas.offsetLeft,
				y: e.pageY - canvas.offsetTop
			});
			this.drawing = true;
			drawPoints();			
		}
	});

	$(canvas).on('click', function (e) {
		mouse.x = e.pageX - canvas.offsetLeft;
		mouse.y = e.pageY - canvas.offsetTop;
		if (canvas.tool == 'eyedropper') {
			getCanvasColor();
		}
	});

	$(canvas).on('mousemove', function (e) {
		mouse.x = e.pageX - canvas.offsetLeft;
		mouse.y = e.pageY - canvas.offsetTop;

		if (this.drawing && canvas.tool != 'eyedropper') {
			points.push({
				x: mouse.x,
				y: mouse.y
			});

			drawPoints();
		}
	});

	$(canvas).on('mouseup', function (e) {
		points = [];
		hidden_ctx.clearRect(0, 0, canvas.width, canvas.height);
		hidden_ctx.drawImage(canvas, 0, 0);
		this.drawing = false;
	});

	$('.small.btn').on('click', function () {
		$('.small.btn').removeAttr('disabled')
		$(this).attr('disabled', 'disabled');
	});

	$('.small.btn.brush').on('click', function () {
		$(canvas).css('cursor', 'none');
		cur_color = '#' + $('.color').val();
		canvas.tool = 'brush';
	});

	$('.small.btn.erase').on('click', function () {
		$(canvas).css('cursor', 'pointer');
		cur_color = '#FFFFFF';
		canvas.tool = 'eraser';
	});

	$('.small.btn.eyedrop').on('click', function () {
		ctx.clearRect(0,0,canvas.width, canvas.height);
		ctx.drawImage(hiddenCanvas, 0, 0);
		$(canvas).css('cursor', 'crosshair');
		canvas.tool = 'eyedropper';
	});

	$('.color').on('change', function () {
		cur_color = '#' + this.color;
	});

	$('.size').on('change', function () {
		var size = $('.size').val();

		if (!($.isNumeric(size))){
			alert('Size must be a number')
		} else {
			cur_size = size;
		}
	});

	$('.save').on('click', function () {
		var url = canvas.toDataURL();
		if (url.length > 0) {
			$.post('/node/one_drawing/url', {
				url: url
			});
		}

		$('#saved_msg').fadeIn(200, function () {
			setTimeout(function () {
				$('#saved_msg').fadeOut(800);
			}, 2000);
		});

	});

	function drawPoints() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(hiddenCanvas, 0, 0);

		ctx.beginPath();

		if (points.length == 1) {
			ctx.arc(points[0].x, points[0].y, cur_size/ 2, 0, Math.PI * 2);
			ctx.fillStyle = cur_color;
			ctx.fill();
		} else {
			ctx.moveTo(points[0].x, points[0].y);
			for (i = 1; i < points.length - 2; i++) {
				var new_x = (points[i].x + points[i + 1].x) / 2;
				var new_y = (points[i].y + points[i + 1].y) / 2;
				ctx.quadraticCurveTo(points[i].x, points[i].y, new_x, new_y);
				ctx.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
			}
			ctx.strokeStyle = cur_color;
			ctx.lineWidth = cur_size;
	    	ctx.lineCap = 'round';
			ctx.stroke();			
		}
		
		ctx.closePath();
	}

	function trackCursor() {
		if ((!canvas.drawing && canvas.tool != 'eyedropper')) {
			ctx.clearRect(0,0,canvas.width, canvas.height);
			ctx.beginPath();
			ctx.drawImage(hiddenCanvas, 0, 0);
			ctx.arc(mouse.x, mouse.y, cur_size / 2, 0, Math.PI * 2);
			ctx.fillStyle = cur_color;
			ctx.fill();

			if (cur_color == '#FFFFFF') {
				ctx.strokeStyle = '#000000';
				ctx.lineWidth = 1;
				ctx.stroke();
			}
			ctx.closePath();
		}


		setTimeout(trackCursor, 40);
	}

	function getCanvasColor() {
		var imageData = ctx.getImageData(mouse.x, mouse.y, 1, 1);
		var color = imageData.data;

		$('.color')[0].color.fromString(rgbComponentToHex(color[0]) + rgbComponentToHex(color[1]) + rgbComponentToHex(color[2]));
	}

	function rgbComponentToHex(c) {
    	var hex = c.toString(16);
    	return hex.length == 1 ? "0" + hex : hex;
    }

	image.src = url_data;
});
