function quickCompliments() {
	var colors = ['#EC8E8E', '#FFAC52', '#A39F7F', '#95AA7A', 
				  '#3A9C0C', '#70A584', '#27B48D', '#27B4B4', 
				  '#85A4AD', '#34AED1', '#3397E5', '#7381B9',
				  '#6D6B81', '#8966A8', '#CB5BD5', '#E05EC1', 
				  '#D1396A', '#F5286A', '#E72D35'];

	$('body').css('background-color', colors[randomInt(0, colors.length - 1)]);
}