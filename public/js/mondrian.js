$(document).ready(function () {

	var paint = "white"

	$(".color").on("click", function () {
		paint = $(this).css('background-color');
		console.log(paint);
	})

	$('.row').on('click', function () {

		$(this).css("background-color", paint );
	});

});