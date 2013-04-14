$(document).ready(function () {

	var rock = "images/rock.png"
	var paper = "images/paper.png"
	var scissors = "images/scissors.png"
	var hands = [rock, paper, scissors]

	$('.button').on('click', function () {
		var userChoice = this.id;
		var compChoice = hands[Math.floor(Math.random()*3)];


		$('#right_hand').attr('src', "images/right_fist.png");
		$('#left_hand').attr('src', "images/left_fist.png");
		$('.hand_container').addClass('shake');
		$('#score_container').text('3');
		
		countDown();

		setTimeout(function() {

			$('.hand_container').removeClass('shake');

			$('#score_container').text('Shoot!');
			
			if (userChoice == "rock") {
				userChoice = rock; 
				$('#right_hand').attr('src', rock);
			};
			if (userChoice == "paper") {
				userChoice = paper;
				$('#right_hand').attr('src', paper);
			};
			if (userChoice == "scissors") {
				userChoice = scissors;
				$('#right_hand').attr('src', scissors);
			};

			$('#left_hand').attr('src', compChoice);

			setTimeout(function() {
				if ( userChoice == compChoice ) {
					$('#score_container').text('Tie!');
				} else if ( userChoice == rock && compChoice == scissors || userChoice == paper && compChoice == rock || userChoice == scissors && compChoice == paper ) {
					$('#score_container').text('You Win!');
				} else {
					$('#score_container').text('You Lose!');
				};

			}, 400)


		}, 1500);

	});

	function countDown() {
		var i = 3;

		var timerId = setInterval(function() {
			i--
			$('#score_container').text(i);

			if (i == 1) {
				clearInterval(timerId);
			}

		}, 500);
	}
});