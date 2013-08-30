function portraitPhotos() {
	if ($('#video_canvas').length) {
		var video_canvas = $('#video_canvas')[0];
		var video_ctx = video_canvas.getContext('2d');
		var image_canvas = $('#image_canvas')[0];
		var image_ctx = image_canvas.getContext('2d');
		var width = 400;
		var height = 550;
		var scale_factor = 0.35;
		var video = $('video')[0];
		var photo_taken = false;
		var base_image = new Image();
		var new_image = new Image();

		video_canvas.width = image_canvas.width = width;
		video_canvas.height = image_canvas.height = height;

		window.URL = window.URL || window.webkitURL;
		navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
	                      	      navigator.mozGetUserMedia || navigator.msGetUserMedia;

	    if (navigator.getUserMedia) {
		  	navigator.getUserMedia({audio: false, video: true}, function(stream) {
		    video.src = window.URL.createObjectURL(stream);
		    video.play();
		    $('#shoot_btn').attr('disabled', false);
		    updateVideoCanvas();
		  }, onDenial);
		} else {
			$('#no_support').show();
		}

		$('#shoot_btn').one('click', function () {
			photo_taken = true;
			$('#save_btn').attr('disabled', false);
		});

		$('#shoot_btn').on('click', function () {
			snapPhoto();
		});

		$('#save_btn').on('click', function () {
			if (photo_taken) {
				saveNewPortrait();
			}
		});

		function updateVideoCanvas() {
			if (video.videoWidth) {
				var scale = image_canvas.height / video.videoHeight;
				var vid_w = video.videoWidth * scale;
				var vid_h = video.videoHeight * scale;
				var offset = -1 * ((vid_w / 2) - (image_canvas.width / 2));
				
				video_ctx.drawImage(video, offset, 0, vid_w, vid_h);				
			}

			requestAnimFrame(updateVideoCanvas);
		}

		function snapPhoto() {
			var url = video_canvas.toDataURL();

			new_image.onload = function () {
				image_ctx.clearRect(0, 0, image_canvas.width, image_canvas.height);
				// image_ctx.drawImage(base_image, 0, 0);
				image_ctx.save();
				image_ctx.globalAlpha = 0.5;
				image_ctx.drawImage(new_image, 0, 0);
				image_ctx.restore();
			}

			new_image.src = url;
		}

		function saveNewPortrait() {
			var file = dataURLtoBlob(image_canvas.toDataURL());
			var form_data = new FormData();

			form_data.append('image', file);

			$.ajax({
				url: "/portrait/photos",
				type: "POST",
				data: form_data,
				processData: false,
				contentType: false,
				success: function (data) {
					window.location = '/portrait/photos/' + data
				},
				error: function () {
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
		
		function onDenial() {
			alert("This app requires access to your camera.");
		}

		// base_image.src = $('#data-img').data('img');
	}
}