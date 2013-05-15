$(document).ready(function () {
	var canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d');

	(function( clock, $, undefined ) {
	    //Private Property
	    var now,
			hour,
			min,
			sec,
	    	w = canvas.width,
			h = canvas.height,
			center = w / 2;
	 
	    //Public Property
	     
	    //Public Method
	    clock.display = function () {
	    	ctx.clearRect(0,0,w,h);
	    	getTime();
	    	makeFace();
	    };
	     
	    //Private Method
	    function getTime() {
	    	now = new Date()
			hour = now.getHours(),
			min = now.getMinutes(),
			sec = now.getSeconds(),
			hour = hour >= 12 ? hour-12 : hour;
	    }

	    function makeFace() {
	    	makeHourHand();
	    	makeMinHand();
	    	makeSecHand();
	    }

	    function makeNumbers() {
	    	var theta = 0;

		    for(var i=4; i<=16; i++){
		      
		    	theta = theta + (30 * Math.PI / 180);
		     
		    	x = center + 250 * Math.cos(theta);
		    	y = center + 250 * Math.sin(theta);

		    	ctx.font = "16px 'Futura'";
		    	ctx.textBaseline = 'middle';
		    	ctx.textAlign = 'center'
		    	ctx.fillStyle = '#A8A7B0';

		    	if (i < 13) {
		      		ctx.fillText(i, x, y);
		      	} else if (i >= 13) {
		      		ctx.fillText(i - 12, x, y);
		      	}
		    }
	    }

	    function makeMarks(dist) {
	    	var theta = 0;

		    for(var i=0; i<60; i++){
		      
		      theta = theta + (6 * Math.PI / 180);
		     
		      x = center + dist * Math.cos(theta);
		      y = center + dist * Math.sin(theta);
		      
		      ctx.beginPath();
		      ctx.fillStyle = '#A8A7B0';
		      ctx.arc(x, y, 1, 0, Math.PI * 2, true);
		      ctx.fill();
		      ctx.closePath();
		    }
		}

	    function makeSecHand() {
	    	makeMarks(100);
	    	var theta = (6 * Math.PI / 180);
	    	var x = center + 100 * Math.cos(sec * theta - Math.PI/2);
	    	var y = center + 100 * Math.sin(sec * theta - Math.PI/2);

	    	ctx.fillStyle = '#28ca9c'; 
	    	ctx.beginPath();  
	    	ctx.arc(x, y, 5, 0, 2 * Math.PI);
	    	ctx.fill();
	    }

	    function makeMinHand() {
	    	makeMarks(180);
	    	var theta = (6 * Math.PI / 180);
	    	var x = center + 180 * Math.cos((min + (sec/60)) * theta - Math.PI/2);
	    	var y = center + 180 * Math.sin((min + (sec/60)) * theta - Math.PI/2);

			ctx.fillStyle = '#28ca9c'; 
	    	ctx.beginPath();  
	    	ctx.arc(x, y, 10, 0, 2 * Math.PI);
	    	ctx.fill();

	    }

	    function makeHourHand() { 
	    	makeNumbers();
	    	var theta = (30 * Math.PI / 180);
	    	var x = center + 250 * Math.cos((hour + (min/60) + (sec/3600)) * theta - Math.PI/2);
	    	var y = center + 250 * Math.sin((hour + (min/60) + (sec/3600)) * theta - Math.PI/2);

	    	ctx.fillStyle = '#28ca9c'; 
	    	ctx.beginPath();  
	    	ctx.arc(x, y, 20, 0, 2 * Math.PI);
	    	ctx.fill();
	    }
	       
	}( window.clock = window.clock || {}, jQuery ));	
	

	clock.display();
	
	setInterval(clock.display, 500);


});