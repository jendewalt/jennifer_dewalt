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

	$('#display').focus();

	$('.close').on('click', function () {
		$('#zero').hide();
	});

	$('.num').on('click', function () { 
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

	function determineType(key) {
		if (key == '*' || key == '-' || key == '+' || key == '/') {
			updateExp(key);
		} else if (key == 'enter') {
			evalExp();
		} else if (key != 'delete') {
			updateNum(key);
		}
	};

	var key_map = {
		'13': 'enter',
		'48': '0',
		'49': '1',
		'50': '2',
		'51': '3',
		'52': '4',
		'53': '5',
		'54': '6',
		'55': '7',
		'56': '8',
		'57': '9',
		'106': '*',
		'107': '+',
		'109': '-',
		'111': '/',
		'110': '.',
		'96': '0',
		'97': '1',
		'98': '2',
		'99': '3',
		'100': '4',
		'101': '5',
		'102': '6',
		'103': '7',
		'104': '8',
		'105': '9',
		'61': '+',
		'187': '+',
		'173': '-',
		'189': '-',
		'191': '/',
		'190': '.',
	}

	$('#display').on('keydown', function (e) {
		e.preventDefault();
	});


	$('#display').on('keyup', function (e) {
		e.preventDefault();
		key = e.which;
		if (e.which == 8 || e.which == 46) {
			key = 'delete';
			curNum = '';
			exp = $('#display').val();
			exp = exp.substring(0, exp.length - 1);
			$('#display').val(exp);

		} else {
			key = key_map[String(key)]
		}

		if (key === '8') {
			key = e.shiftKey ? '*' : 8;
		}

		if (key) {
			determineType(key);	
		}
	});

	function updateNum(num) {
		if (num == '.') {
			if (curNum.indexOf('.') !== -1) {
				;
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
			ans = eval(exp) * 1e6
			ans = Math.round(ans, 6);
			ans = ans/1e6;

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