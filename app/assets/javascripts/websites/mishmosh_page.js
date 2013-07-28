function mishmosh() {
	var width = window.innerWidth;
	var height = window.innerHeight;
	var container = document.getElementById('container');
	var mouse = {}

	var stage = new Kinetic.Stage({
        container: 'container',
        width: width,
        height: height
    });
	var layer = new Kinetic.Layer();

	$(document).on('mousemove', function (e) {
		mouse.x = e.pageX;
		mouse.y = e.pageY;
	});

	container.addEventListener('dragover', function (e) {
		e.preventDefault();
		$('.modal').fadeOut(400);
	}, false);

	container.addEventListener('drop', function (e) {
		var files = e.dataTransfer.files;
		var image = new Image();
		var mouse_x = e.pageX - container.offsetLeft;
		var mouse_y = e.pageY - container.offsetTop;

		if (files.length > 0) {
			var file = files[0];
			if (typeof FileReader !== 'undefined' && file.type.indexOf('image') != -1) {
				var reader = new FileReader();
				reader.onload = function (e) {

					image.onload = function() {
						var img_w = image.width * 0.5;
						var img_h = image.height * 0.5;

				        var picture = new Kinetic.Image({
				          x: mouse_x,
				          y: mouse_y,
				          image: image,
				          width: img_w,
				          height: img_h,
				          draggable: true,
				        });

				        picture.setOffset(img_w / 2, img_h / 2);

				        picture.on('dblclick', function (e) {
				        		picture.remove();
				        		layer.draw();				        		
				        });

				        picture.on('mousedown', function (e) {
				 

				           	if (e.altKey) {
				           		picture.on('mousemove', function (e) {
					           		var delta_x = this.attrs.x - mouse.x;
					           		var delta_y = this.attrs.y - mouse.y;

					           		var angle = Math.atan2(delta_x, delta_y)

				        			picture.setRotation(-angle - Math.PI / 2);
				        			layer.draw();
				           		});
				        	}
				        	if (e.shiftKey) {
				        		var delta_x = (this.attrs.x - mouse.x);
					           	var delta_y = (this.attrs.y - mouse.y);
					           	var original_dist = Math.sqrt(delta_x * delta_x + delta_y * delta_y);
					           	var original_scale = picture.getScale().x;

				        		picture.on('mousemove', function (e) {
									delta_x = (this.attrs.x - mouse.x);
					           		delta_y = (this.attrs.y - mouse.y);
					           		var new_dist = Math.sqrt(delta_x * delta_x + delta_y * delta_y);
					           		var new_scale = picture.getScale().x;	
					           		
					           		picture.setScale(original_scale * new_dist / original_dist);
					           		layer.draw();
				        		});
				        	}
				        });

				        $('body').on('mouseup', function () {
				        	picture.off('mousemove');
				        });

				        $('body').on('keydown', function (e) {
				        	picture.setDraggable(false);
				        });

				        $('body').on('keyup', function (e) {
				        	picture.setDraggable(true);
				        	picture.off('mousemove');
				        });

				        layer.add(picture);
				        stage.add(layer);
		      		};
					image.src = e.target.result;
				}
				reader.readAsDataURL(file);
			}
		}
		e.preventDefault();
	}, false);


	$('#save').on('click', function () {
		var canvas = $('canvas')[0];
		var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
		window.location.href = image;
	});
}