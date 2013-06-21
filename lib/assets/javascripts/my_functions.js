
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

function randomFloat(min, max) {
	return Math.random() * (max - min + 1) + min;
}
