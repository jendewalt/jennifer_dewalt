function imageEditor() {
	var canvas = $('canvas')[0];
	var ctx = canvas.getContext('2d');
	var width = window.innerWidth - 160;
	var height = window.innerHeight - 100;
	var img = document.createElement('img');
	var hiddenCanvas = document.createElement('canvas');
    var hidden_ctx = hiddenCanvas.getContext('2d');
    var canvas_clear = true;
    var body = $('body')[0];

	canvas.width = width;
	canvas.height = height;

	img.addEventListener('load', function () {
		clearCanvas();
		drawImportedImage();
	}, false);

	body.addEventListener('dragover', function (e) {
		$('.modal').fadeOut(300);
		e.preventDefault();
	}, false);

	body.addEventListener('drop', function (e) {
		var files = e.dataTransfer.files;

		if (files.length > 0) {
			var file = files[0];
			if(typeof FileReader !== 'undefined' && file.type.indexOf('image') != -1) {
				var reader = new FileReader();
				reader.onload = function (e) {
					img.src = e.target.result;
					drawImportedImage();
				}
				reader.readAsDataURL(file); 
			}
		}
		e.preventDefault();
	}, false);

	$('#image_loader').on('change', function (e) {
		$('.modal').fadeOut(300);
		var reader = new FileReader();
  		reader.onload = function(event){
	        img.src = event.target.result;
	        drawImportedImage();
	    }
	    reader.readAsDataURL(e.target.files[0]);
	});

	$('#grayscale').on('click', function () {
		grayscaleFilter();
	});

	$('#vintage').on('click', function () {
		vintageFilter();
	});

	$('.bright').on('click', function () {
		var adjustment = $(this).data('value');
		brightnessFilter(adjustment * 3);
	});

	$('.rgba').on('click', function () {
		var adjustment = $(this).data('value');
		var color = $(this).data('color');
		rgbaFilter(color, adjustment * 3);
	});

	$('.resize').on('change', function () {
		var scale = $(this).val();

		if ($.isNumeric(scale)) {
			hidden_ctx.clearRect(0,0, hiddenCanvas.width, hiddenCanvas.height);
			hiddenCanvas.width = canvas.width;
			hiddenCanvas.height = canvas.height;
			hidden_ctx.drawImage(canvas, 0, 0);

			clearCanvas();
			canvas.height *= scale;
			canvas.width *= scale;
			ctx.drawImage(hiddenCanvas, 0, 0, canvas.width, canvas.height);
		} else {
			alert('Resize percentage must be a decimal number.');
		}
		$(this).val('');
	});

	$('#save').on('click', function () {
		var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
		window.location.href = image;
	});

	$('#reset').on('click', function () {
		clearCanvas();
		if (!canvas_clear) {
			drawImportedImage();
		}
	});

	$('#clear').on('click', function () {
		clearCanvas();
		canvas.width = width;
		canvas.height = height;
		canvas_clear = true;
		$('.modal').show();
	});

	$('body').disableSelection();

	function clearCanvas() {
		ctx.clearRect(0,0,canvas.width, canvas.height);
	}

	function grayscaleFilter() {
		var image_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
		var data = image_data.data;

		for (var i = 0; i < data.length; i += 4) {
			var brightness = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];

			data[i] = brightness;
    		data[i+1] = brightness;
    		data[i+2] = brightness;
		}
		ctx.putImageData(image_data, 0, 0);
	}

	function vintageFilter() {
		var image_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
		var data = image_data.data;

		for (var i = 0; i < data.length; i += 4) {
			data[i] = 0.393 * data[i] + 0.769 * data[i+1] + 0.189 * data[i+2];
    		data[i+1] = 0.349 * data[i] + 0.686 * data[i+1] + 0.168 * data[i+2];
    		data[i+2] = 0.272 * data[i] + 0.534 * data[i+1] + 0.131 * data[i+2];
		}
		ctx.putImageData(image_data, 0, 0);
	}

	function brightnessFilter(adjustment) {
		var image_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
		var data = image_data.data;

		for (var i = 0; i < data.length; i += 4) {
			data[i] += adjustment;
    		data[i+1] += adjustment;
    		data[i+2] += adjustment;
		}
		ctx.putImageData(image_data, 0, 0);
	}

	function rgbaFilter(color, adjustment) {
		var image_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
		var data = image_data.data;

		for (var i = 0; i < data.length; i += 4) {
			if (color == 'red') {
				data[i] += adjustment;
			} else if (color == 'green'){
    			data[i+1] += adjustment;
			} else if (color == 'blue') {
    			data[i+2] += adjustment;
			} else if (color == 'alpha') {
				data[i+3] += adjustment;
			}
		}
		ctx.putImageData(image_data, 0, 0);
	}

	function drawImportedImage() {
		canvas_clear = false;
		canvas.width = img.width;
		canvas.height = img.height;
		ctx.drawImage(img, 0, 0);
	}
}