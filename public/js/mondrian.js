$(document).ready(function () {

	var paint = "white"

	$(".color").on("click", function () {
		paint = $(this).css('background-color');
	})

	$('.row').on('click', function () {

		$(this).css("background-color", paint );
	});

});