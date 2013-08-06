function shareASecret() {
	var last_secret = '';

	$('.secret_input').focus();

	$('form').on('submit', function (e) {
		e.preventDefault();
		var secret = $('.secret_input').val().replace(/^\s+|\s+$/g, '');

		if (secret.length < 10 || secret.length > 255) {
			alert("Your secret is either too long or too short. Write in a secret between 10 and 255 characters.");
		} else if (secret == last_secret) {
			alert("You can't think of another secret? I'm sure you have at least a few more secrets to share.");
		} else {
			last_secret = secret;
			$('.secret_input').val('');
			
		    $.ajax({
				type: 'POST',
				dataType: "json",
				url: "/share_a_secret/secrets",
				data: {
					new_secret: secret
				},
				complete: function(data){
		        	insertResponse(data.responseText);
		        }
			});	
		}
	});

	function insertResponse(response) {
		$('#retrieved_secret_text').hide().text(response).fadeIn(500);
	}
};