function picturePen() {

	if ($('#new_container').length) {
		var canvas = $('canvas')[0];
		var ctx = canvas.getContext('2d');
		var img = document.createElement('img');
		var width = 500;
		var height = 400;
		var cur_color = '#000';
		var cur_size = 5;
		var hiddenCanvas = document.createElement('canvas');
	    var hidden_ctx = hiddenCanvas.getContext('2d');
		var points = [];
		var max_image_size = 600;

		canvas.width = width;
		canvas.height = height;
		hiddenCanvas.height = height;
	    hiddenCanvas.width = width;

		var has_text = true;
		var clearCanvas = function () {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			hidden_ctx.clearRect(0, 0, canvas.width, canvas.height);
			canvas.drawing = false;
			points = [];
			
			if (has_text) {
				has_text = false;
			}
		};

		var setCanvas = function () {
			var img_h = img.height;
			var img_w = img.width;
			var scale = 1;
			clearCanvas();

			if (img.width > max_image_size) {
				scale = max_image_size / img.width;
			} else if (img.width > max_image_size) {
				scale = max_image_size / img.height;
			}

			img_h *= scale;
			img_w *= scale;

			hiddenCanvas.width = canvas.width = img_w; 
			hiddenCanvas.height = canvas.height = img_h;
			$('canvas').css('cursor', 'crosshair');
			hidden_ctx.drawImage(img, 0, 0, img_w, img_h);
			ctx.drawImage(img, 0, 0, img_w, img_h);
		}

		ctx.font = '16px Geneva';
		ctx.textAlign = 'center';
		ctx.fillStyle = '#999';

		ctx.fillText("Drag an image from your", width / 2, height / 2 - 60);
		ctx.fillText("computer into this box.", width / 2, height / 2 - 35);

		img.addEventListener('load', function (e) {
			setCanvas();
		}, false);

		canvas.addEventListener('dragover', function (e) {
			e.preventDefault();
		}, false);

		canvas.addEventListener('drop', function (e) {
			var files = e.dataTransfer.files;

			if (files.length > 0) {
				var file = files[0];
				if(typeof FileReader !== 'undefined' && file.type.indexOf('image') != -1) {
					var reader = new FileReader();
					reader.onload = function (e) {
						var old_src = img.src;
						img.src = e.target.result;
						
						if (old_src == img.src) {
							setCanvas();
						}
					}
					reader.readAsDataURL(file);
				}
			}
			e.preventDefault();
		}, false);

		
		$(canvas).on('mousedown', function (e) {
			points.push({
				x: e.pageX - canvas.offsetLeft,
				y: e.pageY - canvas.offsetTop
			});
			this.drawing = true;
		});

		$(canvas).on('mousemove', function (e) {
			mouse_x = e.pageX - canvas.offsetLeft;
			mouse_y = e.pageY - canvas.offsetTop;

			if (this.drawing) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(hiddenCanvas, 0, 0);
				points.push({
					x: mouse_x,
					y: mouse_y
				});

				drawPoints();
			}
		});

		$(canvas).on('mouseup', function (e) {
			this.drawing = false;
			$('canvas').css('cursor', 'default');
			points = [];
			hidden_ctx.clearRect(0, 0, canvas.width, canvas.height);
			hidden_ctx.drawImage(canvas, 0, 0);
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

		$('#clear_all').on('click', function () {
			clearCanvas();
		});

		$('#clear_pen').on('click', function () {
			setCanvas();
		});

		$('#download').on('click', function () {
			var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
			window.location.href = image;
		});

		$('#save').on('click', function () {
			if (img.src) {
				saveNewPortrait();
			}
		});

		$('body').disableSelection();


		function drawPoints() {
			ctx.beginPath();
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

		function saveNewPortrait() {
			var file = dataURLtoBlob(canvas.toDataURL());
			var form_data = new FormData();

			form_data.append('image', file);

			$.ajax({
				url: "/picture_pen/pictures",
				type: "POST",
				data: form_data,
				processData: false,
				contentType: false,
				success: function (data) {
					window.location = '/picture_pen/pictures/' + data
				},
				error: function (xhr, status) {
					alert('There was a problem with your request. Please try again.');
				}
			});
		}

		function dataURLtoBlob(dataURL) {
			var binary = atob(dataURL.split(',')[1]);
			var array = [];

			for(var i = 0; i < binary.length; i++) {
				array.push(binary.charCodeAt(i));
			}
			return new Blob([new Uint8Array(array)], {type: 'image/png'});
		}
		
	}
}