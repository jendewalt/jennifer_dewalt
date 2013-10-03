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
	var all_draw = io.connect(serverBaseUrl + '/node/all_draw', {resource: 'node/socket.io'});
	var sessionId = '';
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var cur_color = '#000';
	var cur_size = 8;
	var cur_opacity = 1;
	var hiddenCanvas = document.createElement('canvas');
    var hidden_ctx = hiddenCanvas.getContext('2d');
	var points = [];
	var height = 600;
	var width = 900;
	var image = new Image();
	var img_url = $(canvas).data('url');
	var mouse = {};

	canvas.tool = 'brush';
	canvas.tracking = true;

	hiddenCanvas.height = canvas.height = height;
	hiddenCanvas.width = canvas.width = width;

	$('body').disableSelection();

	if (img_url.length) {
		image.onload = function () {
			ctx.drawImage(image, 0, 0);
			hidden_ctx.drawImage(image, 0, 0);

			initCanvas();
		};
	} else {
		initCanvas();
	}

	all_draw.on('newPoints', function (data) {
		drawPoints(data.points, data.color, data.size, data.opacity);
		hidden_ctx.clearRect(0, 0, canvas.width, canvas.height);
		hidden_ctx.drawImage(canvas, 0, 0);
	});


	function initCanvas() {
		trackCursor();

		$(canvas).on('mousedown', function (e) {
			if (canvas.tracking) {
				points.push({
					x: e.pageX - canvas.offsetLeft,
					y: e.pageY - canvas.offsetTop
				});
				this.drawing = true;
				drawPoints(points, cur_color, cur_size, cur_opacity);
			}	
		});

		$(canvas).on('click', function (e) {
			mouse.x = e.pageX - canvas.offsetLeft;
			mouse.y = e.pageY - canvas.offsetTop;
			if (!canvas.tracking) {
				getCanvasColor();
			}
		});
		
		$(canvas).on('mousemove', function (e) {
			mouse.x = e.pageX - canvas.offsetLeft;
			mouse.y = e.pageY - canvas.offsetTop;

			if (this.drawing && canvas.tracking) {
				points.push({
					x: mouse.x,
					y: mouse.y
				});			
				
				drawPoints(points, cur_color, cur_size, cur_opacity);
			}
		});

		$(canvas).on('mouseup', function (e) {
			if (canvas.tracking) {
				all_draw.emit('newPoints', {
					points: points,
					color: cur_color,
					size: cur_size,
					opacity: cur_opacity 
				});

				points = [];
				hidden_ctx.clearRect(0, 0, canvas.width, canvas.height);
				hidden_ctx.drawImage(canvas, 0, 0);
				this.drawing = false;
			}
		});

		$('.small.btn').on('click', function () {
			$('.small.btn').removeAttr('disabled')
			$(this).attr('disabled', 'disabled');
		});

		$('.small.btn.brush').on('click', function () {
			$(canvas).css('cursor', 'none');
			cur_color = '#' + $('.color').val();
			canvas.tool = 'brush';
			canvas.tracking = true;
		});

		$('.small.btn.erase').on('click', function () {
			$(canvas).css('cursor', 'pointer');
			cur_color = '#FFFFFF';
			canvas.tool = 'eraser';
			canvas.tracking = true;
		});

		$('.small.btn.eyedrop').on('click', function () {
			ctx.clearRect(0,0,canvas.width, canvas.height);
			ctx.drawImage(hiddenCanvas, 0, 0);
			$(canvas).css('cursor', 'crosshair');
			canvas.tool = 'eyedropper';
			canvas.tracking = false;
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

		$('.opacity').on('change', function () {
			var opacity = $('.opacity').val();
			if (!($.isNumeric(opacity))){
				alert('Opacity must be a number between 0 and 1');
			} else {
				cur_opacity = opacity >= 0 && opacity <= 1 ? opacity : 1;
			}
			$('.opacity').val(cur_opacity);
		});
	}

	function drawPoints(points, color, size, opacity) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(hiddenCanvas, 0, 0);
		ctx.save();
		ctx.beginPath();
		ctx.globalAlpha = opacity;

		if (points.length == 1) {
			ctx.arc(points[0].x, points[0].y, size/ 2, 0, Math.PI * 2);
			ctx.fillStyle = color;
			ctx.fill();
		} else {
			ctx.moveTo(points[0].x, points[0].y);
			for (var i = 1; i < points.length - 2; i++) {
				var new_x = (points[i].x + points[i + 1].x) / 2;
				var new_y = (points[i].y + points[i + 1].y) / 2;
				ctx.quadraticCurveTo(points[i].x, points[i].y, new_x, new_y);
				ctx.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
			}
			ctx.strokeStyle = color;
			ctx.lineWidth = size;
	    	ctx.lineCap = 'round';
			ctx.stroke();			
		}		
		ctx.closePath();
		ctx.restore();
	}

	function trackCursor() {
		if (!canvas.drawing && canvas.tracking) {
			ctx.clearRect(0,0,canvas.width, canvas.height);
			ctx.beginPath();
			ctx.drawImage(hiddenCanvas, 0, 0);
			ctx.save();
			ctx.globalAlpha = cur_opacity;
			ctx.arc(mouse.x, mouse.y, cur_size / 2, 0, Math.PI * 2);
			ctx.fillStyle = cur_color;
			ctx.fill();

			if (cur_color == '#FFFFFF') {
				ctx.strokeStyle = '#000000';
				ctx.lineWidth = 1;
				ctx.stroke();
			}

			ctx.closePath();
			ctx.restore();
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

	image.src = img_url;
});
