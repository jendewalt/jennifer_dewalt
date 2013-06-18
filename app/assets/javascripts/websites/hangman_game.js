function hangmanGame() {
	var canvas = $('canvas')[0],
		ctx = canvas.getContext('2d'),
		height = 300,
		width = 700,
		letters = ("abcdefghijklmnopqrstuvwxyz").split(""),
		word = getWord(),
		bad_guesses = 0,
		good_guesses = 0,
		running = true;

		canvas.height = height;
		canvas.width = width;

	function drawGallows() {
		ctx.strokeStyle = "#7f8c8d";
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.moveTo(250, 300);
		ctx.lineTo(250, 50);
		ctx.lineTo(350, 50);
		ctx.stroke();
		ctx.closePath();
	};

	function drawHead() {
		ctx.fillStyle = "#fff";
		ctx.strokeStyle = "#2c3e50";
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.arc(350.5, 80, 30, 0, 2 * Math.PI);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
	};
	function drawBody() {
		ctx.strokeStyle = "#2c3e50";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(350.5, 110);
		ctx.lineTo(350.5, 190);
		ctx.closePath();
		ctx.stroke();
	};
	function drawArm1() {
		ctx.strokeStyle = "#2c3e50";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(350.5, 135);
		ctx.lineTo(290, 100);
		ctx.closePath();
		ctx.stroke();
	};
	function drawArm2() {
		ctx.strokeStyle = "#2c3e50";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(350.5, 135);
		ctx.lineTo(410, 100);
		ctx.closePath();
		ctx.stroke();
	};
	function drawLeg1() {
		ctx.strokeStyle = "#2c3e50";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(350.5, 189.5);
		ctx.lineTo(385, 250);
		ctx.closePath();
		ctx.stroke();
	};
	function drawLeg2() {
		ctx.strokeStyle = "#2c3e50";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(350.5, 189.5);
		ctx.lineTo(315, 250);
		ctx.closePath();
		ctx.stroke();
	};

	function makeWordSlots() {
		var word_array = word.split('');
		_.each(word_array, function (letter, i) {
			$('<div/>', {
				class: "letter_slot",
				id: i
			}).appendTo('#word_container');			
		});
	};

	function updateWordSlot(array, letter) {
		_.each(array, function (num) {
			$('#' + num).text(letter);
			good_guesses++;
		});

		if (good_guesses == word.length && running) {
			$('.win').fadeIn(300);
		}
	};

	function makeLetterButtons() {
		_.each(letters, function(letter) {
			$('<button/>', {
				text: letter,
				id: "btn_" + letter
			}).on('click', function () {
				$(this).attr('disabled','disabled').off();

				checkGuess($(this).text());
			}).appendTo('#btn_container');
		});
	};

	function checkGuess(letter) {
		var check_word = word;
		var indices = [];
		
		while (_.indexOf(check_word, letter) != -1) {
			var i = _.lastIndexOf(check_word, letter);
			indices.push(i);
			check_word = check_word.slice(0, i);			
		}

		if (indices.length > 0) {
			updateWordSlot(indices, letter);
		} else {
			switch (bad_guesses) {
				case 0:
					drawHead();
					break;
				case 1:
					drawBody();
					break;
				case 2:
					drawArm1();
					break;
				case 3:
					drawArm2();
					break;
				case 4:
					drawLeg1();
					break;
				case 5:
					drawLeg2();
					gameOver();
					break;
			}
			bad_guesses++;
		}
	};

	function gameOver() {
		running = false;
		$('.game_over').fadeIn(500);

		_.each(word, function(letter, i) {
			if ($('#'+i).text() == '') {
				$('#'+i).addClass('fail').text(letter);
			}
		});
	};

	function init() {
		makeWordSlots();
		drawGallows();
		makeLetterButtons();
	};

	init();

	$('body').on('keypress', function (e) {
		var key = e.charCode || e.keyCode;
		if (key >= 97 && key <= 122) {
			var letter = String.fromCharCode(key);
			$('#btn_' + letter).click();
		}
	});
	
	function getWord() {
	  var a = new Array('abate','aberrant','abscond','accolade','acerbic','acumen','adulation','adulterate','aesthetic','aggrandize','alacrity','alchemy','amalgamate','ameliorate','amenable','anachronism','anomaly','approbation','archaic','arduous','ascetic','assuage','astringent','audacious','austere','avarice','aver','axiom','bolster','bombast','bombastic','bucolic','burgeon','cacophony','canon','canonical','capricious','castigation','catalyst','caustic','censure','chary','chicanery','cogent','complaisance','connoisseur','contentious','contrite','convention','convoluted','credulous','culpable','cynicism','dearth','decorum','demur','derision','desiccate','diatribe','didactic','dilettante','disabuse','discordant','discretion','disinterested','disparage','disparate','dissemble','divulge','dogmatic','ebullience','eccentric','eclectic','effrontery','elegy','eloquent','emollient','empirical','endemic','enervate','enigmatic','ennui','ephemeral','equivocate','erudite','esoteric','eulogy','evanescent','exacerbate','exculpate','exigent','exonerate','extemporaneous','facetious','fallacy','fawn','fervent','filibuster','flout','fortuitous','fulminate','furtive','garrulous','germane','glib','grandiloquence','gregarious','hackneyed','halcyon','harangue','hedonism','hegemony','heretical','hubris','hyperbole','iconoclast','idolatrous','imminent','immutable','impassive','impecunious','imperturbable','impetuous','implacable','impunity','inchoate','incipient','indifferent','inert','infelicitous','ingenuous','inimical','innocuous','insipid','intractable','intransigent','intrepid','inured','inveigle','irascible','laconic','laud','loquacious','lucid','luminous','magnanimity','malevolent','malleable','martial','maverick','mendacity','mercurial','meticulous','misanthrope','mitigate','mollify','morose','mundane','nebulous','neologism','neophyte','noxious','obdurate','obfuscate','obsequious','obstinate','obtuse','obviate','occlude','odious','onerous','opaque','opprobrium','oscillation','ostentatious','paean','parody','pedagogy','pedantic','penurious','penury','perennial','perfidy','perfunctory','pernicious','perspicacious','peruse','pervade','pervasive','phlegmatic','pine','pious','pirate','pith','pithy','placate','platitude','plethora','plummet','polemical','pragmatic','prattle','precipitate','precursor','predilection','preen','prescience','presumptuous','prevaricate','pristine','probity','proclivity','prodigal','prodigious','profligate','profuse','proliferate','prolific','propensity','prosaic','pungent','putrefy','quaff','qualm','querulous','query','quiescence','quixotic','quotidian','rancorous','rarefy','recalcitrant','recant','recondite','redoubtable','refulgent','refute','relegate','renege','repudiate','rescind','reticent','reverent','rhetoric','salubrious','sanction','satire','sedulous','shard','solicitous','solvent','soporific','sordid','sparse','specious','spendthrift','sporadic','spurious','squalid','squander','static','stoic','stupefy','stymie','subpoena','subtle','succinct','superfluous','supplant','surfeit','synthesis','tacit','tenacity','terse','tirade','torpid','torque','tortuous','tout','transient','trenchant','truculent','ubiquitous','unfeigned','untenable','urbane','vacillate','variegated','veracity','vexation','vigilant','vilify','virulent','viscous','vituperate','volatile','voracious','waver','zealous');
	  return a[parseInt(Math.random()* a.length)];
	};
};
