(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };

    $.fn.preload = function() {
	    this.each(function(){
	        $('<images/>')[0].src = this;
	    });
	}
})(jQuery);

$(document).ready(function () {
	var numCards = _.range(30),
		cards = [],
		images = ['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg', 'e.jpg', 'f.jpg', 
				  'g.jpg', 'h.jpg', 'i.jpg', 'j.jpg', 'k.jpg', 'l.jpg', 
				  'm.jpg', 'n.jpg', 'o.jpg', ],
		matched = [],
		showing = [],
		attempts = 0;

	function Card(id) {
		this.img;
		this.id = id;
		this.class = 'card back';
	};

	function makeCards() {
		_.each(cards, function (card) {
			$('<img>', {
				class: card.class,
				id: card.id,
				src: 'images/back.jpg'
			}).on('click', function () {
				showing.push(cards[card.id]);
				flipCard(this);
			}).appendTo('#card_container');
		});
	};

	function flipCard(card) {
		$('#'+card.id).attr('src', 'images/' + cards[card.id].img);
		$(card).off('click');

		if (showing.length == 2) {
			$('#block').show();
			checkCards();
		}
	};

	function checkCards() {
		attempts++;

		if (showing[0].img == showing[1].img) {
			_.each(showing, function (card) {
				matched.push(card);
			});
			$('#block').hide();
			showing = [];
		} else {
			setTimeout(function () {
				_.each(showing, function (card) {	
					$('#'+card.id).on('click', function () {
						showing.push(cards[card.id]);
						flipCard(this);
					}).attr('src', 'images/back.jpg');
				});
				$('#block').hide();
				showing = [];
			}, 400);
		}

		updateStats();

		if (matched.length == images.length) {
			var accuracy =  Math.round(((matched.length / 2) / attempts)*100).toFixed(2);
			$('#end h2:nth-child(2)').text('Matches: ' + matched.length / 2);
			$('#end h2:nth-child(3)').text('Attempts: ' + attempts);
			$('#end h2:nth-child(4)').text('Accuracy: ' + accuracy + '%')
			
			if (accuracy >= 80) {
				$('#end h1').text('Nice Work!');
			} else {
				$('#end h1').text('Better Keep Practicing');				
			}

			$('.modal').fadeIn(200);
		}
	}

	function updateStats() {
		$('#attempts').text('Attempts: ' + attempts);
		$('#matches').text('Matches: ' + matched.length/2);

	}

	function init() {
		images = images.concat(images);

		_.each(numCards, function (i) {
			cards.push(new Card(i));
		});

		_.each(_.shuffle(images), function (img, i) {
			cards[i].img = img;
		});

		makeCards();
	}
	
	$(images).preload();

	init();

	$('.close').on('click', function () {
		$('#end').hide();
	});
	
	$('body').disableSelection();
});
