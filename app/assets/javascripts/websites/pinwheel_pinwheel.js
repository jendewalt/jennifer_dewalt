function pinwheel() {
	var canvas = $('canvas')[0],
		ctx = canvas.getContext('2d'),
		h = 500,
		w = 500,
		animation,
		top_petal_color = '#b15be3',
		top_petal_color_top = '#a33ede',
		right_petal_color = '#44e886',
		right_petal_color_top = '#1bde69',
		bottom_petal_color = '#fc8f29',
		bottom_petal_color_top = '#ef7503',
		left_petal_color = '#3c99f0',
		left_petal_color_top = '#1280e7';

	canvas.height = h;
	canvas.width = w;

	window.requestAnimFrame = (function(){
	  return  window.requestAnimationFrame       ||
	          window.webkitRequestAnimationFrame ||
	          window.mozRequestAnimationFrame    ||
	          function( callback ){
	            window.setTimeout(callback, 1000 / 60);
	          };
	})();

	(function( pinwheel, $, undefined ) {
	    //Private Property
	 	var cur_rotation = 0.3;

	    //Public Property
	    pinwheel.rotation_speed = 0;
	     
	    //Public Method
	    pinwheel.draw = function() {
	        // Rear Petals

			// Top Petal
			ctx.beginPath();
	        ctx.fillStyle = top_petal_color;
			ctx.moveTo(250, 200);
			ctx.lineTo(250, 0);
			ctx.lineTo(350, 100);
			ctx.lineTo(250, 200);
			ctx.fill();
			ctx.closePath();

			// Right Petal
			ctx.beginPath();
	        ctx.fillStyle = right_petal_color;
			ctx.lineTo(450, 200);
			ctx.lineTo(350, 300);
			ctx.lineTo(250, 200);
			ctx.fill();
			ctx.closePath();

			// Bottom Petal
			ctx.beginPath();
			ctx.fillStyle = bottom_petal_color;
			ctx.lineTo(250, 400);
			ctx.lineTo(150, 300);
			ctx.lineTo(250, 200);
			ctx.fill();
			ctx.closePath();

			// Left Petal
			ctx.beginPath();
			ctx.fillStyle = left_petal_color;
			ctx.lineTo(50, 200);
			ctx.lineTo(150, 100);
			ctx.lineTo(250, 200);
			ctx.fill();
			ctx.closePath();

			ctx.shadowColor = 'rgba(0,0,0,0.3)';
		    ctx.shadowBlur = 5;
		    ctx.shadowOffsetX = 2;
		    ctx.shadowOffsetY = 2;

			// Front Petals
			
			// Top Right
			ctx.beginPath();
	        ctx.fillStyle = top_petal_color_top;
			ctx.moveTo(250, 200);
			ctx.lineTo(350, 100);
			ctx.lineTo(350, 200);
			ctx.lineTo(250, 200);
			ctx.fill();
			ctx.closePath();

			// Bottom Right
			
			ctx.beginPath();
	        ctx.fillStyle = right_petal_color_top;
			ctx.lineTo(350, 300);
			ctx.lineTo(250, 300);
			ctx.lineTo(250, 200);
			ctx.fill();
			ctx.closePath();

			// Bottom Left
			ctx.beginPath();
			ctx.fillStyle = bottom_petal_color_top;
			ctx.lineTo(150, 300);
			ctx.lineTo(150, 200);
			ctx.lineTo(250, 200);
			ctx.fill();
			ctx.closePath();

			// Top Left
			ctx.beginPath();
			ctx.fillStyle = left_petal_color_top;
			ctx.lineTo(150, 100);
			ctx.lineTo(250, 100);
			ctx.lineTo(250, 200);
			ctx.fill();
			ctx.closePath();

			ctx.shadowColor = 'rgba(0,0,0,0.7)';
		    ctx.shadowBlur = 3;
		    ctx.shadowOffsetX = 3;
		    ctx.shadowOffsetY = 3;

			ctx.closePath();

			// Center Pin
			ctx.fillStyle = 'white';
			ctx.lineWidth = 2;
			ctx.strokeStyle = 'rgba(0,0,0,0.2)';
			ctx.beginPath();
			ctx.arc(250, 200, 8, 0, 2 * Math.PI);
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
	    };

	    pinwheel.spin = function () {
	    	ctx.clearRect(0,0,w,h);
	    	drawStick();
	    	ctx.save();
	    	ctx.translate(250, 200);
	    	ctx.rotate(cur_rotation);
	    	ctx.translate(-250, -200);
	    	pinwheel.draw();
	    	ctx.restore();

	    	cur_rotation += 0.05 * pinwheel.rotation_speed; 
	    	pinwheel.rotation_speed *= 0.996;
	    };
	     
	    //Private Method
		    function drawStick() {
		    	ctx.fillStyle = '#946f4b';
		    	ctx.fillRect(244, 200, 12, 500);

		    	ctx.shadowColor = 'rgba(0,0,0,0.3)';
			    ctx.shadowBlur = 3;
			    ctx.shadowOffsetX = 2;
			    ctx.shadowOffsetY = 2;
		    };

	}( window.pinwheel = window.pinwheel || {}, jQuery ));

	(function animloop(){
		animation = requestAnimFrame(animloop);
	  	pinwheel.spin();
	})();

	$('canvas').on('click', function () {
		pinwheel.rotation_speed += 1.5;
	});

	$('body').disableSelection();
};