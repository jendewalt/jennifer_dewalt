$(document).ready(function () {
	var numberOfCards = _.range(1000);

	_.each(numberOfCards, function(position) {
		$('<div>', {
			id: 'card' + position,
			class: 'card'
		}).on('click', function (event) {
			$(this).off('click');
			cascade(event, position);	
		}).appendTo('#container');
	});

	$('#container').append('<br class="clear">');

	function cascade(event, position) {
		var pos = position;
		
		flip(pos);

		setTimeout(function () {
				$('#card' + (pos + 1)).trigger('click');
				$('#card' + (pos - 1)).trigger('click');
				$('#card' + (pos - 40)).trigger('click');
				$('#card' + (pos + 40)).trigger('click');
		}, 50);

		setTimeout(function () {
			$('#card' + pos).on('click', function (event) {
				$(this).off('click');
				cascade(event, position);
			});
		}, 800);
	};

	function flip(id) {
		var cardId = '#card'+id
			$(cardId).addClass('wave');
		
		setTimeout(function () {
			$(cardId).removeClass('wave');
		}, 400);
	}
});
