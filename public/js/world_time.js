$(document).ready(function () {
	var canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d'),
		w = 1000,
		h = 300,
		num_clocks = 4,
		clock_to_adjust,
		centers = [{x: w/8, y: h/2}, {x: w/8*3, y: h/2},
				   {x: w/8*5, y: h/2}, {x: w/8*7, y: h/2}]
		clocks = [];

	    canvas.width = w,
		canvas.height = h;

	init();

	function init() {
		for (i = 0; i < num_clocks; i++) {
			clocks.push(new Clock(centers[i].x, centers[i].y));
		}
		drawClocks();
	};

	function drawClocks() {
		ctx.clearRect(0,0,w,h);

		_.each(clocks, function (c) {
			makeClock(c);
		});

		setTimeout(drawClocks, 500);
	};

	function Clock(x, y) {
		this.hour;
		this.min;
		this.sec;
		this.offset_hours = 0;
		this.offset_mins = 0;
		this.color;
		this.x = x;
		this.y = y;
		this.r = 100;
	};

	function makeClock(clock){
    	getTime(clock);
    	makeFace(clock);
    	makeHourHand(clock);
    	makeMinHand(clock);
    	makeSecHand(clock);
	};

	function getTime(c) {
		var now = new Date(),
		hour = now.getHours() + c.offset_hours;

		c.min = now.getMinutes() + c.offset_mins,
		c.sec = now.getSeconds();

		if (hour >= 12) {
			c.hour = hour - 12;
			c.color = "#312c36";
		} else {
			c.hour = hour;
			c.color = "#4b4352";
		}
	}

	function makeFace(c) {
		ctx.beginPath();
		ctx.lineWidth = 25;
		ctx.strokeStyle = '#d3d1d5';
		ctx.arc(c.x, c.y, c.r, 0, 2*Math.PI);
		ctx.stroke();
		ctx.closePath();

		ctx.beginPath();
		ctx.arc(c.x, c.y, c.r, 0, 2*Math.PI);
		ctx.fillStyle = c.color;
		ctx.lineWidth = 20;
		ctx.strokeStyle = '#17151a';
		ctx.stroke();
		ctx.fill()
		ctx.closePath();

		makeNumbers(c);
		makeSecMarks(c);
	}

	function makeNumbers(c) {
		var theta = 0,
			x, y;

		for(var i=4; i<=16; i++){
			theta = theta + (30 * Math.PI / 180);

			x = c.x + c.r*0.75 * Math.cos(theta);
		    y = c.y + c.r*0.75 * Math.sin(theta);

		    ctx.font = "18px Futura";
	    	ctx.textBaseline = 'middle';
	    	ctx.textAlign = 'center'
	    	ctx.fillStyle = '#fff';

	    	if (i < 13) {
	      		ctx.fillText(i, x, y);
	      	} else if (i >= 13) {
	      		ctx.fillText(i - 12, x, y);
	      	}
	    }
	}

	function makeSecMarks(c) {
    	var theta = 0,
    		x, y;

	    for(var i=0; i<60; i++){

	      theta = theta + (6 * Math.PI / 180);

	      x = c.x + (c.r*0.93) * Math.cos(theta);
	      y = c.y + (c.r*0.93) * Math.sin(theta);

	      ctx.beginPath();
	      ctx.fillStyle = '#1dc69f';
	      ctx.arc(x, y, 1, 0, Math.PI * 2, true);
	      ctx.fill();
	      ctx.closePath();
	    }
	}

	function makeHourHand(c) {
    	var theta = (30 * Math.PI / 180);
    	var x = c.x + c.r*0.45 * Math.cos((c.hour + (c.min/60) + (c.sec/3600)) * theta - Math.PI/2);
    	var y = c.y + c.r*0.45 * Math.sin((c.hour + (c.min/60) + (c.sec/3600)) * theta - Math.PI/2);

    	ctx.beginPath();
    	ctx.strokeStyle = '#1dc69f';
   		ctx.lineWidth = 3;
    	ctx.moveTo(c.x,c.y);
    	ctx.lineTo(x,y);
    	ctx.stroke();
    	ctx.closePath();
    }

    function makeMinHand(c) {
    	var theta = (6 * Math.PI / 180);
    	var x = c.x + c.r*0.84 * Math.cos((c.min + (c.sec/60)) * theta - Math.PI/2);
    	var y = c.y + c.r*0.84 * Math.sin((c.min + (c.sec/60)) * theta - Math.PI/2);

    	ctx.strokeStyle = '#1dc69f';
   		ctx.lineWidth = 3;
    	ctx.beginPath();
    	ctx.moveTo(c.x,c.y);
    	ctx.lineTo(x,y);
    	ctx.stroke();
    	ctx.closePath();
    }

    function makeSecHand(c) {
    	var theta = (6 * Math.PI / 180);
    	var x = c.x + c.r*0.84 * Math.cos(c.sec * theta - Math.PI/2);
    	var y = c.y + c.r*0.84 * Math.sin(c.sec * theta - Math.PI/2);

    	ctx.strokeStyle = '#0d5645';
   		ctx.lineWidth = 2;
    	ctx.beginPath();
    	ctx.moveTo(c.x,c.y);
    	ctx.lineTo(x,y);
    	ctx.stroke();
    	ctx.closePath();

    	ctx.beginPath();
    	ctx.fillStyle = '#d3d1d5';
    	ctx.arc(c.x, c.y, 5, 0, 2 * Math.PI);
    	ctx.fill();
    	ctx.closePath();
    }

    function checkIfError(data, num) {
    	if (data.data.error) {
			alert('There seems to be a problem with your request.');
		} else {
			adjustOffset(data.data.time_zone[0].localtime.split(' ')[1].split(':'), num);
    	}
    };

    function requestTime(obj) {
    	var query = obj.val();

		if (query == '') {
			alert('Time keeps on tickin\'...');;
		} else {
			$.ajax({
				url: 'https://api.worldweatheronline.com/free/v1/tz.ashx?q='+ query +'&format=json&key=yg8stkf5b8tpzg68ejpxnzt2',
				dataType: 'jsonp',
				success: function (data, status) {
					checkIfError(data, obj.data('clock'));
				}
			});
		}
	};

    function adjustOffset(req_time, num) {
    	var local_time = new Date();

    	clocks[num].offset_hours = req_time[0] - local_time.getHours();
    	clocks[num].offset_mins = req_time[1] - local_time.getMinutes();

    	$('.loc_input').blur();
    };

    $('.loc_input').on('focus', function () {
    	$(this).val('');
    });

	$('form').on('submit', function (e) {
		e.preventDefault();
		requestTime($(this).find('.loc_input'));
	});

	$('.close').on('click', function () {
		$('.modal').fadeOut('fast');
	})
});











