(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);

$(document).ready(function () {
	var curNum = '',
		exp = '',
		ans;

	$('.close').on('click', function () {
		$('#zero').hide();
	});

	$('.num').on('click', function (e) { 
		updateNum(this.id);
	});

	$('.operator').on('click', function () {
		updateExp(this.id);
	});

	$('.run').on('click', function () {
		evalExp();
	});

	$('#c').on('click', function () {
		curNum = '';
		displayNum(curNum);
	});

	$('#clear_all').on('click', function () {
		curNum = '';
		exp = '';
		displayNum(curNum);
	});

	$(document).on('keypress', function (e) {
		e.preventDefault();
		key = e.keyCode;
			console.log(key)

		if (key == 46 || (key >= 48 && key <=57)) {
			updateNum(String.fromCharCode(key));
		}

		if (key == 42 || key == 43 || key == 45 || key ==47) {
			updateExp(String.fromCharCode(key));
		}

		if (key == 13) {
			evalExp();
		}
	});

	$('#display').on('keyup', function (e) {
		e.preventDefault();
		key = e.keyCode;
		console.log(key + ' up');

		if (key == 46 || key == 8) {
			curNum = '';
			exp = $('#display').val();
			console.log(exp)
		}

	});

	function updateNum(num) {
		if (num == '.') {
			if (curNum.indexOf('.') !== -1) {
				console.log('err')
			} else {
				curNum += num;
			}
		} else if (num == 'negative') {
			if (curNum.indexOf('-') !== -1) {
				curNum = curNum.substr(1);
			} else {
				curNum = (0 - curNum).toString();
			}
		} else {
			curNum += num;
		}

		displayNum();
	};

	function updateExp(operator) {
		exp = exp + curNum + operator;
		curNum = '';

		displayNum();
	};

	function displayNum() {
		$('#display').val(exp + curNum);
	};

	function evalExp() {
		updateExp('');

		var test = parseFloat(exp.substr(exp.length-1));

		if (isNaN(test)) {
			alert('Looks like there\'s a problem.');
		} else {
			ans = eval(exp);

			if (ans == Infinity || ans == -Infinity) {
				$('#zero').show();
				curNum = '';
				ans = '';
			} else {
				$('#display').val(ans);
				curNum = ans;
			}
			
			exp ='';
		}
	};

	
	$('body').disableSelection();
	
});