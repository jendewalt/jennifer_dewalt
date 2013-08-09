function catWall() {
	var cats = ['INscMGmhmX4', '0M7ibPk37_U', 'R7ssVT6T3mQ', '2CNd6OGdMO8', 'bzvUyu3zOmE', 'pwHy4gMO6sU', 'fzzjgBAaWZw', 'C_S5cXbXe-4', 'hPzNl6NKAG0', 'REQRHdMRimw', '0Bmhjf0rKe8', 'SaOqf2d-y30'];

	var tag = document.createElement('script');
	tag.src = "http://www.youtube.com/player_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	var player;

	window.onYouTubePlayerAPIReady = function() {
		// onYouTubePlayerAPIReady needs to be global. If statement to specify Cat Wall specific code
		if (window.location.pathname == '/cat_wall/page') {

			_.each(cats, function (videoId, i) {
				$('<div />', {
					id: 'player' + i,
					class: 'video'
				}).appendTo('#video_container');

				player = new YT.Player('player' + i, {
					playerVars: { 
						'autohide': 1,
						'wmode': 'opaque', 
						'controls': 0,
				    	'playlist': videoId,
						'loop': 1
					},
				    videoId: videoId,
				    events: {
				    	'onReady': onPlayerReady
				    }
				});
			});
		}
	}

	// 4. The API will call this function when the video player is ready.
	function onPlayerReady(event) {
		event.target.mute();
		event.target.playVideo();
	}
}