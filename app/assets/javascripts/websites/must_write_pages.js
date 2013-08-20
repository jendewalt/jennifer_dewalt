function mustWrite() {
	if($('#show_container').length ) {
		var this_page = window.location.pathname;
		var gentle_sound = new Howl({
		  urls: ['/assets/bb2.mp3', '/assets/bb2.ogg'],
		  volume: 0.7
		});
		var aggressive_sound = new Howl({
		  urls: ['/assets/aggressive.mp3', '/assets/aggressive.ogg'],
		  loop: true
		});
		var typing = false;
		var minder = {
			time: 0,
			last_type: 0,
			reminds: 0
		};

		$('body').on('keypress', function () {
			minder.typing = true;
			minder.last_type = minder.time;
		});

		$('#show_save').on('click', function (e) {
			e.preventDefault();
			var content = $('.page_content').val();

			$.ajax({
				type: 'PUT',
				dataType: "json",
				url: this_page,
				data: {
					content: content
				}
			});	
		});

		runMinder();

		function runMinder() {
			minder.time += 0.5;
			if (minder.time > minder.last_type + 20 && minder.reminds >= 3) {
				runReminder(aggressive_sound);
			} else if (minder.time > minder.last_type + 20) {
				runReminder(gentle_sound);
			} else {
				setTimeout(runMinder, 500);				
			}
		}

		function runReminder(sound) {
			sound.play();
			minder.reminds += 1;
			minder.time = 0;
			alert('You should probably get back to writing now.');
			sound.stop();
			runMinder();
		}	
	}
}