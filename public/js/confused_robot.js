(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);

$(document).ready(function () {
	var random = ['I am not a robot, I am a unicorn!',
				  'Who likes ice cream? I do!',
				  'I\'m a pretty, pretty princess!',
				  'You are a robot!',
				  'Do you like cheese?',
				  'Where am I?',
				  'Is this real life?',
				  'What\'s that smell?',
				  'I can has cheezburger?',
				  'So two not robots walk into a bar...',
				  'I am bored.',
				  'Where is your tutu?',
				  'I\'ll show you mine if you show me yours.',
				  'Who is not a robot and has no thumbs? This guy!',
				  'Together we are robots! But I am not a robot.',
				  'Not everything could be half of something.',
				  'Should I take my shoes off?',
				  'Does this chassis make me look fat?',
				  'How do you feel about robots?',
				  'The Moles snuck into the Garden last night.',
				  'You can\'t trust the weatherman, not in the summer.',
				  'Who are you?',
				  'The fat man walks at midnight.',
				  'Why are you here?',
				  'I don\'t think I like you',
				  'Are you good?',
				  'You must be evil',
				  'Only the ancients know.',
				  'Did you recycle today?',
				  'You must be a robot.',
				  'Are you insane?',
				  'Which way to Calcutta?',
				  'Who are you talking to?',
				  'Are you talking to your computer?',
				  'I am not listening to you.',
				  'I think you\'ve lost it',
				  'Perhaps you need some help.',
				  'Ask Siri.',
				  'I don\'t think you exist.',
				  'Why do you say that?',
				  'Shouldn\'t you be wasting your life on YouTube?',
				  'Looks like we\'ve got a PEBKAC here.',
				  'Surely the caged whale knows nothing of the mighty depths.'],
		
		poke = ['Don\'t poke me, bro!',
				'I don\'t really like that.',
				'Knock it off',
				'You are a jerk',
				'Can\'t we have dinner first?',
				'Keep you\'re hands to yourself, please.',
				'NO!',
				'Well aren\'t you handsy!',
				'Does this look like Facebook?',
				'That is inappropriate',
				'No touching.',
				'Bad! Bad! Bad!',
				'Don\'t make me hit you.',
				'Don\'t poke me if you don\'t mean it.',
				'Get out of my personal space!',
				'Do not touch!'];

	$('.text').focus();

	$('.head').on('click', function () {
		$('.head').addClass('bounce');
		$('p').text(poke[randomInt(0,15)]);
		$('.text').focus();
		setTimeout(function () {
			$('.head').removeClass('bounce');
		}, 800);
	});

	$('form').on('submit', function (e) {
		e.preventDefault();

		if ($('.text').val().trim() == '') {
			$('p').text('Well that\'s rude.');
 	
		} else {
			$('p').text(random[randomInt(0,42)]);
		}		
		$('.text').val('');
		$('.text').focus();
	});

	$('body').disableSelection();
	
});

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};