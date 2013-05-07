$(document).ready(function () {
	(function( dude, $, undefined ) {
	    //Private Property
	    
	    var health = 10;
	    var love = 10;
	    var happiness = 10;
	 
	    //Public Property
	    
	     
	    //Public Method
	    dude.feed = function() {
	        health += randomInt(2,4);

	        $('.mouth').addClass('feed');

	        setTimeout(function () {
	        	$('.mouth').removeClass('feed');
	        }, 1000);

	        decrementVitalSigns('feed');
	    };

	    dude.hug = function() {
	        love += randomInt(2,4);

	        $('.head').addClass('hug');

	        setTimeout(function () {
	        	$('.head').removeClass('hug');
	        }, 700);

	       	decrementVitalSigns('hug');
	    };

	    dude.play = function() {
	        happiness += randomInt(2,4);

	        $('#dude_container').addClass('play');

	        setTimeout(function () {
	        	$('#dude_container').removeClass('play');
	        }, 1000);

	        decrementVitalSigns('play');
	    };
	     
	    //Private Method
	    function decrementVitalSigns(action) {
	    	if (action == 'feed') {
		    	love -= randomInt(1,2);
		    	happiness -= randomInt(1,2);
	    	} else if (action == 'hug') {
	    		health -= randomInt(1,2);	    	
		    	happiness -= randomInt(0,2);	    		
	    	} else {
	    		health -= randomInt(1,2);	    	
		    	love -= randomInt(1,2);	
	    	}

	    	updateStats();
	    	styleDude();

	    	if (health <= 0 || love <= 0 || happiness <= 0) {
	    		$('#module').show();
	    	}	    	
	    };

	    function styleDude() {
	    	if (health >= 23) {
	    		$('.head').css({top: 50, left:50, height:350, width:415});
	    	} else if (health >= 18) {
	    		$('.head').css({top: 100, left:100, height:250, width:300});
	    	} else if (health >= 12) {
	    		$('.head').css({top: 125, left:130, height:200, width:240});
	    	} else {
	    		$('.head').css({top: 150, left:160, height:150, width:180});
	    	}

	    	if ((love < 6 )|| (happiness < 6) || (health < 6)) {
	    		$('.mouth').addClass('frown');
	    		$('.mouth').removeClass('smile');
	    		$('.mouth').removeClass('joy');
	    	} else if (happiness >= 14) {
	    		$('.mouth').addClass('joy');
	    		$('.mouth').removeClass('smile');
	    	} else if (happiness < 14 && happiness >= 6) {
	    		$('.mouth').addClass('smile');
	    		$('.mouth').removeClass('joy');
	    		$('.mouth').removeClass('frown');
	    	} 

	    	if (love >= 23) {
	    		$('.head').css({backgroundColor: '#d6003d'});
	    	} else if (love >=18) {
	    		$('.head').css({backgroundColor: '#ff749c'});
	    	} else if (love >= 14) {
	    		$('.head').css({backgroundColor: '#ff749c'});	    		
	    	} else if (love < 14 && love >= 6) {
	    		$('.head').css({backgroundColor: '#FFFFFA'});	    			    		
	    	} else {
	    		$('.head').css({backgroundColor: '#d8e6d4'});	    			    			    		
	    	}
	    }

	    function updateStats() {
	    	if (health <= 0 || love <= 0 || happiness <= 0) {
	    		$('#health').text('Health: XXX');
	    		$('#love').text('Love: XXX');
	    		$('#happiness').text('Happiness: XXX');
	    	} else {
		    	$('#health').text('Health: ' + health);
		    	$('#love').text('Love: ' + love);
		    	$('#happiness').text('Happiness: ' + happiness);	    		
	    	}
	    }

	}( window.dude = window.dude || {}, jQuery ));

	$('.btn_feed').on('click', dude.feed);
	$('.btn_hug').on('click', dude.hug);
	$('.btn_play').on('click', dude.play);

});


function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};
