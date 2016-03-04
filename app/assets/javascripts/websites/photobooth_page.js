function photobooth() {
	var vid_canvas = $('#video_capture')[0];
	var vid_ctx = vid_canvas.getContext('2d');

	var final_canvas = $('#final_canvas')[0];
	var final_ctx = final_canvas.getContext('2d');

	var width = 600;
	var height = 400;

	var cur_y = 0;
	var num_photos = 0;
	var count = 3;
	var scale_factor = 0.35;

	window.URL = window.URL || window.webkitURL;
	navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
	                      	  navigator.mozGetUserMedia || navigator.msGetUserMedia;

	var video = $('video')[0];

	$('.start_btn').on('click', function () {
		$('.start').hide();
		$('#countdown_container').show();
		$('.access').show();
		startVideo();
	});

	$('#save').on('click', function () {
		var image = final_canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
		window.location.href = image;
	});

	$('#reset').on('click', function () {
		cur_y = 0;
		num_photos = 0;
		count = 3;
		$('#photo_container').hide();
		$('#container').show();
		$('#countdown_container').show();
		updateVidCanvas();
		countdown();
	});

	function startVideo() {
		var onDenial = function(e) {
			alert('Sorry. This website requires camera access.');
		};

		if (navigator.getUserMedia) {
		  navigator.getUserMedia({audio: false, video: true}, function(stream) {
		    video.src = window.URL.createObjectURL(stream);
		    video.play();
		    updateVidCanvas();
		    $('.access').hide();
		    countdown();
		  }, onDenial);
		}
	}

	function updateVidCanvas() {
		processVideoFrame();

		if (num_photos < 4) {
			requestAnimFrame(updateVidCanvas);
		}
	}

	function processVideoFrame() {
		if (vid_ctx && video.videoWidth > 0 && video.videoHeight > 0) {
			if (vid_canvas.width != video.videoWidth * scale_factor) {
				vid_canvas.width= video.videoWidth * scale_factor;
				final_canvas.width = video.videoWidth * scale_factor;
			}
			if (vid_canvas.height != video.videoHeight * scale_factor) {
				vid_canvas.height = video.videoHeight * scale_factor;
				final_canvas.height = video.videoHeight * scale_factor * 4;
			}
		}
		vid_ctx.drawImage(video, 0, 0, vid_canvas.width, vid_canvas.height);
	}

	function countdown() {
		if (count >= 0) {
			$('#countdown').text(count);
			setTimeout(countdown, 1000);
		} else {
			$('#countdown_container').hide();
			takeSnapshots();
		}
		count -= 1;
	}

	function takeSnapshots() {
		flash();
		var url = vid_canvas.toDataURL();
		var image = new Image();

		image.onload = function () {
			final_ctx.drawImage(image, 0, cur_y);
			cur_y += image.height;
			num_photos += 1;
		};
		image.src = url;

		if (num_photos < 3) {
			setTimeout(takeSnapshots, 3000);
		} else {
			showPhotoStrip();
		}
	}

	function showPhotoStrip() {
		$('#container').hide();
		$('#photo_container').fadeIn(400);
	}

	function flash() {
		$('#flash').fadeIn(20);

		setTimeout(function () {
			$('#flash').fadeOut(20);
		}, 50);
	}
}
