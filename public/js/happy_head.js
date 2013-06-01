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
				  'I can haz cheezburger?',
				  'So two not robots walk into a bar...',
				  'I am bored.',
				  'Where is your tutu?',
				  'I\'ll show you mine if you show me yours.',
				  'Who is not a robot and has no thumbs? This guy!',
				  'Are you good?',
				  'Together we are robots! I am not a robot',
				  'Not everything could be half of something'],
		
		prompt = ['Who are you?',
				  'Why are you here?',
				  'I don\'t think I like you',
				  'You must be a robot.',
				  'Are you insane?',
				  'Who are you talking to?',
				  'Are you talking to your computer?',
				  'I am not listening.',
				  'I think you\'ve lost it',
				  'Perhaps you need some help.',
				  'Ask Siri.',
				  ],
		
		poke = ['Don\'t poke me, bro!',
				'I don\'t really like that.',
				'Knock it off',
				'You are a jerk',
				'Can\'t we have dinner first?',
				'Keep you\'re hands to yourself, please.',
				'NO!',
				'Well aren\'t you handsy!',
				'Does this look like Facebook?'];

	$('.head').on('click', function () {
		$('.head').addClass('bounce');
		$('.speech').text(poke[randomInt(0,8)]);
		setTimeout(function () {
			$('.head').removeClass('bounce');
		}, 800);
	});


	
	$('body').disableSelection();
	
});

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};