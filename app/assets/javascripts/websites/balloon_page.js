function balloon() {
	var width = window.innerWidth;
	var height = window.innerHeight;
	var acceleration = -2.5;
	var damper = 0.6;
	var friction = 0.06;

	var stage = new Kinetic.Stage({
		container: 'container',
		width: width,
		height: height
	});

	var layer = new Kinetic.Layer();
	var image = new Image();
	
	image.onload = function() {
		var balloon_w = image.width;
		var balloon_h = image.height;
        var balloon = new Kinetic.Image({
          x: width / 4,
          y: height / 2,
          image: image,
          width: balloon_w,
          height: balloon_h,
          draggable: true
        });

        balloon.vx = 2;
        balloon.vy = 0;
	
		balloon.createImageHitRegion(function () {
        	layer.draw();
        });

        layer.add(balloon);
        stage.add(layer);

        balloon.on("dragstart", function(){
            balloon.vx = 0;
            balloon.vy = 0;
        });

        balloon.on("mouseover", function(){
            document.body.style.cursor = "pointer";
        });

        balloon.on("mouseout", function(){
            document.body.style.cursor = "default";
        });

        var date = new Date();
        var time = date.getTime();
        animate(time, balloon);
    };

    function animate(last_time, balloon) {
    	var date = new Date();
        var time = date.getTime();
        var delta_time = time - last_time;

        layer.draw();

        evolveBall(delta_time, balloon);

        requestAnimFrame(function () {
        	animate(time, balloon);
        });
    }

    function evolveBall(delta_time, balloon) {
    	var balloon_x = balloon.getX();
    	var balloon_y = balloon.getY();
    	var mouse = stage.getMousePosition();

    	if (balloon.isDragging()) {
    		if (mouse) {
    			var mouse_y = mouse.y;
    			var mouse_x = mouse.x;

    			balloon.vx = friction * (mouse_x - balloon.last_mouse_x);
    			balloon.vy = friction * (mouse_y - balloon.last_mouse_y);
    			balloon.last_mouse_x = mouse_x;
    			balloon.last_mouse_y = mouse_y;
    		}
    	} else {
    		balloon.vy += acceleration * delta_time / 1000;
    		balloon.setX(balloon_x + balloon.vx);
    		balloon.setY(balloon_y + balloon.vy);

    		if (balloon_x < 0) {
    			balloon.setX(0);
    			balloon.vx *= -1;
    			balloon.vx *= damper;
    		}
    		if (balloon_x > width - balloon.getWidth()) {
    			balloon.setX(width - balloon.getWidth());
    			balloon.vx *= -1;
    			balloon.vx *= damper;
    		}

    		if (balloon_y < 0) {
    			balloon.setY(0);
    			balloon.vy *= -1;
    			balloon.vy *= damper;
    			balloon.vx *= damper / 1.3;
    		}

    		if (balloon_y > height - balloon.getHeight()) {
    			balloon.setY(height - balloon.getHeight());
    			balloon.vy *= -1;
    			balloon.vy *= damper;
    		}
    	}
    }

    image.src = '/assets/blue_balloon.png';
}