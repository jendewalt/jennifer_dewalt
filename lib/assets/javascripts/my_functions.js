
function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

function randomColorHex() {
	return '#' + Math.random().toString(16).slice(2, 8);
};

function randomColorRGB() {
  var r = randomInt(0, 255);
  var g = randomInt(0, 255);
  var b = randomInt(0, 255);

  return r + ', ' + g + ', ' + b;
};
function randomColorHSL() {
	var h = randomInt(0, 360);
	var s = randomInt(0, 100);
	var l = randomInt(0, 100);

	return {h: h, s: s, l: l};
};

function randomFloat(min, max) {
	return Math.random() * (max - min + 1) + min;
}

function randomNumWithGap(min1, max1, min2, max2) {
  var rand = Math.random();

  if (rand < 0.5) {
    return randomInt(min1, max1);
  } else {
    return randomInt(min2, max2);
  }
}


window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();