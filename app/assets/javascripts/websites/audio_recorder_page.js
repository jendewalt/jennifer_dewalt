function audioRecorder() {
	var audio_context;
	var recorder;
	var title = 'my_recording.wav'

	init();

	$('#start').on('click', function (e) {
		startRecording();
		updateTitle();
	});

	$('#stop').on('click', function (e) {
		stopRecording();
	});

	function init() {
		try {
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
			window.URL = window.URL || window.webkitURL;

			audio_context = new AudioContext;

			if (navigator.getUserMedia) {
				navigator.getUserMedia({ audio: true }, startUserMedia, function (e) {
					alert('This app requires access to your microphone.');
				});
			} else {
				showReplacementPage();
			}
		} catch (e) {
			showReplacementPage();
		}
	}

	function updateTitle() {
		var new_title = $.trim($('#title_input').val());

		if (new_title) {
			title = new_title + '.wav';
		}
	}

	function showReplacementPage() {
		$('#container').html('');
		$('#replacement_container').show();
	}

	function startUserMedia(stream) {
		var input = audio_context.createMediaStreamSource(stream);

		input.connect(audio_context.destination);

		recorder = new Recorder(input);

		$('#start').attr('disabled', false);
	}

	function startRecording() {
		recorder && recorder.record();
		$('#start').attr('disabled', true);
		$('#stop').attr('disabled', false);

		$('.rec_light_bulb').addClass('recording');
	}

	function stopRecording() {
		recorder && recorder.stop();
		$('#stop').attr('disabled', true);
		$('#start').attr('disabled', false);
		$('.rec_light_bulb').removeClass('recording');

		createDownloadLink();
	}

	function createDownloadLink() {
		recorder && recorder.exportWAV(function (blob) {
			var url = URL.createObjectURL(blob);
			var li = document.createElement('li');
			var audio = document.createElement('audio');
			var sound_title = document.createElement('p');
			var anchor = document.createElement('a');
			var list = document.getElementById('recordings_list');

			audio.controls = true;
			audio.src = url;
			sound_title.innerHTML = title;
			anchor.href = url;
			anchor.className = 'btn';
			anchor.download = title;
			anchor.innerHTML = 'Download';
			li.appendChild(audio);
			li.appendChild(sound_title);
			li.appendChild(anchor);
			list.appendChild(li);
		});

		recorder.clear();
	}
}










