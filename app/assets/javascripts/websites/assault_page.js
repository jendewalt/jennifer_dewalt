function assault() {
	var salt = $('#salt');
	var battery = $('#battery');
	var grains = 0;
	var timeout;

	salt.shaking = false;

	salt.on('click', function () {
		if (!salt.shaking) {
			salt.shaking = true;
			rotateImg(0, 180, salt, startShakeSalt);			
		} else {
			salt.shaking = false;
			stopShakeSalt();			
		}
	});

	battery.on('click', function () {
		battery.addClass('battery_shake');
		fireUpBattery(0);
	});

	function rotateImg(start, finish, elm, callback) {
		$({deg: start}).animate({deg: finish}, {
	        duration: 800,
	        step: function(now) {
	            elm.css({
	                transform: 'rotate(' + now + 'deg)'
	            }); 

	            if (now == finish && callback) {
	            	callback();
	            }           
	        }
	    });
	}

	function startShakeSalt() {
	 	salt.addClass('salt_shake');
	 	makeSaltGrains();
	}

	function stopShakeSalt() {
		salt.shaking = false;
	 	salt.removeClass('salt_shake');
		rotateImg(180, 0, salt);
	 	clearTimeout(timeout);
	 	$('#grains').html('');
	 	grains = 0;
	}

	function makeSaltGrains() {
		$('<div>', {
			class: 'grain'
		}).css({
			left: randomInt(130, 170)
		}).animate({
			bottom: -200,
			opacity: 0
		}).appendTo('#grains');

		grains += 1;

		if (salt.shaking && grains < 300) {
			timeout = setTimeout(makeSaltGrains, 15);
		} else {
			stopShakeSalt();
			clearTimeout(timeout);
		} 
	}

	function fireUpBattery(times) {
		var color = randomColorRGB();
		$('body').css('background-color', 'rgb(' + color + ')');

		$('#lightning').css({
			top: randomInt(-400, 200),
			left: randomInt(-300, 300),
		}).show();

		if (times < 12) {
			setTimeout(function () {
				fireUpBattery(times += 1);
			}, 30);
		} else {
			$('body').css('background-color', '#cc0000');
			battery.removeClass('battery_shake');
			$('#lightning').hide();
		}
	}
}