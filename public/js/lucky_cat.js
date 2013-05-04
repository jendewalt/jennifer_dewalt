$(document).ready(function () {
	$('.coin').draggable({
		helper: 'clone'
	});
	$('#body').droppable({
		drop: function(event, ui) {
			playSound();
		}
	});

	function playSound() {
  		document.getElementById('sound').innerHTML="<audio autoplay><source src='audio/coin.wav' type='audio/wav'></audio>";
;
	}
});