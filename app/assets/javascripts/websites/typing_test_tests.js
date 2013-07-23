function typingTest() {
	var p0 = "<p>Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal.</p><br><p>Now we are engaged in a great civil war, testing whether that nation, or any nation so conceived and so dedicated, can long endure. We are met on a great battlefield of that war. We have come to dedicate a portion of that field, as a final resting place for those who here gave their lives that that nation might live. It is altogether fitting and proper that we should do this.</p><br><p>But, in a larger sense, we cannot dedicate -- we cannot consecrate -- we cannot hallow -- this ground. The brave men, living and dead, who struggled here, have consecrated it, far above our poor power to add or detract. The world will little note, nor long remember what we say here, but it can never forget what they did here. It is for us the living, rather, to be dedicated here to the unfinished work which they who fought here have thus far so nobly advanced. It is rather for us to be here dedicated to the great task remaining before us -- that from these honored dead we take increased devotion to that cause for which they gave the last full measure of devotion -- that we here highly resolve that these dead shall not have died in vain -- that this nation, under God, shall have a new birth of freedom -- and that government of the people, by the people, for the people, shall not perish from the earth.</p>",
		
		p1 = "<p>Fans, for the past two weeks you have been reading about a bad break I got. Yet today I consider myself the luckiest man on the face of the earth. I have been in ballparks for seventeen years and have never received anything but kindness and encouragement from you fans.</p><br><p>Look at these grand men. Which of you wouldn't consider it the highlight of his career to associate with them for even one day?</p><br><p>Sure, I'm lucky. Who wouldn't consider it an honor to have known Jacob Ruppert -- also the builder of baseball's greatest empire, Ed Barrow -- to have spent the next nine years with that wonderful little fellow Miller Huggins -- then to have spent the next nine years with that outstanding leader, that smart student of psychology -- the best manager in baseball today, Joe McCarthy!</p><br><p>Sure, I'm lucky. When the New York Giants, a team you would give your right arm to beat, and vice versa, sends you a gift, that's something! When everybody down to the groundskeepers and those boys in white coats remember you with trophies, that's something.</p><br><p>When you have a wonderful mother-in-law who takes sides with you in squabbles against her own daughter, that's something. When you have a father and mother who work all their lives so that you can have an education and build your body, it's a blessing! When you have a wife who has been a tower of strength and shown more courage than you dreamed existed, that's the finest I know.</p><br><p>So I close in saying that I might have had a tough break -- but I have an awful lot to live for!</p>",

		p2 = "<p>We observe today not a victory of party, but a celebration of freedom -- symbolizing an end, as well as a beginning -- signifying renewal, as well as change. For I have sworn before you and Almighty God the same solemn oath our forebears prescribed nearly a century and three-quarters ago.</p><br><p>The world is very different now. For man holds in his mortal hands the power to abolish all forms of human poverty and all forms of human life. And yet the same revolutionary beliefs for which our forebears fought are still at issue around the globe -- the belief that the rights of man come not from the generosity of the state, but from the hand of God.</p><br><p>We dare not forget today that we are the heirs of that first revolution. Let the word go forth from this time and place, to friend and foe alike, that the torch has been passed to a new generation of Americans -- born in this century, tempered by war, disciplined by a hard and bitter peace, proud of our ancient heritage, and unwilling to witness or permit the slow undoing of those human rights to which this nation has always been committed, and to which we are committed today at home and around the world.</p><br><p>Let every nation know, whether it wishes us well or ill, that we shall pay any price, bear any burden, meet any hardship, support any friend, oppose any foe, to assure the survival and the success of liberty.</p><br><p>This much we pledge -- and more.</p>",

		p3 = "<p>We've grown used to wonders in this century. It's hard to dazzle us. But for 25 years the United States space program has been doing just that. We've grown used to the idea of space, and perhaps we forget that we've only just begun. We're still pioneers. They, the members of the Challenger crew, were pioneers.</p><br><p>And I want to say something to the school children of America who were watching the live coverage of the shuttle's takeoff. I know it is hard to understand, but sometimes painful things like this happen. It's all part of the process of exploration and discovery. It's all part of taking a chance and expanding man's horizons. The future doesn't belong to the fainthearted; it belongs to the brave. The Challenger crew was pulling us into the future, and we'll continue to follow them...</p><br><p>The crew of the space shuttle Challenger honoured us by the manner in which they lived their lives. We will never forget them, nor the last time we saw them, this morning, as they prepared for the journey and waved goodbye and 'slipped the surly bonds of earth' to 'touch the face of God.'</p>",

		p4 = "<p>Now it is the time to act on behalf of women everywhere. If we take bold steps to better the lives of women, we will be taking bold steps to better the lives of children and families too. Families rely on mothers and wives for emotional support and care. Families rely on women for labor in the home. And increasingly, everywhere, families rely on women for income needed to raise healthy children and care for other relatives.</p><br><p>As long as discrimination and inequities remain so commonplace everywhere in the world, as long as girls and women are valued less, fed less, fed last, overworked, underpaid, not schooled, subjected to violence in and outside their homes -- the potential of the human family to create a peaceful, prosperous world will not be realized.</p><br><p>Let -- Let this conference be our -- and the world’s -- call to action. Let us heed that call so we can create a world in which every woman is treated with respect and dignity, every boy and girl is loved and cared for equally, and every family has the hope of a strong and stable future. That is the work before you. That is the work before all of us who have a vision of the world we want to see -- for our children and our grandchildren.</p>";

	var passages = [p0, p1, p2, p3, p4],
		elapsed,
		clock,
		cur_passage = passages[randomInt(0,4)];

	$('textarea').blur();

	$('button.start').on('click', function () {
		$('textarea').focus();
		$('#text_passage').html(cur_passage);
		$('.modal.start').fadeOut(300);
		
		$('textarea').one('input', function () {
			timer();
		});
	});

	$('.end p').on('click', function () {
		$('.modal.end').fadeOut(300);
	});

	function timer() {
		var start = new Date().getTime(),
			elapsed = 0;

		clock = setInterval(function () {
			var time = new Date().getTime() - start;

			elapsed = Math.floor(time / 1000);
			formatTime(60 - elapsed);

			if (elapsed == 60) {
				clearInterval(clock);
				checkTest($('textarea').val(), cur_passage);
			}

		}, 500);
	};

	function formatTime(seconds) {
		var min = Math.floor(seconds / 60), 
			sec = seconds % 60;

		if (sec < 10) {
			sec = '0' + sec;
		}
		if (min < 10) {
			min = '0' + min;
		}

		cur_time = min + ':' + sec;
		$('.timer').text(cur_time);
	};

	function checkTest(test, passage) {
		var occurrences = {},
			total_score = 0;

		passage = passage.replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/<br>/g, ' ').split(' ');
		test = test.replace(/\r?\n|\r/g, ' ').replace(/  /g, ' ').split(' ');

		_.each(passage, function (word) {
			occurrences[word] = occurrences[word] ? occurrences[word] + 1 : 1;
		});

		_.each(test, function (word) {
			if (occurrences[word] && occurrences[word] > 0) {
				total_score += 1;
				occurrences[word] = occurrences[word] - 1;
			}
		});

		returnResult(total_score);
	};

	function returnResult(words) {
		$('.end .wpm').text('Words per minute: ' + words);
		$('.end').fadeIn(300);
	};


}