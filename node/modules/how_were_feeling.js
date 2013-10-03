var sanitizer = require('sanitizer');
var _ = require("underscore");
var twitter = require('ntwitter');
var cronJob = require('cron').CronJob;
var fs = require('fs');
var util = require('util');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var emotionKeywords = ['#amazed', '#angry', '#annoyed', '#awesome', '#awkward', '#bored', 
					   '#calm', '#confused', '#delighted', '#depressed', '#elated', 
					   '#excited', '#happy', '#helpless', '#hopeful', '#hurt', '#jealous', 
					   '#joyful', '#lonely', '#love', '#neat', '#nervous', 
					   '#proud', '#relaxed', '#sad', '#scared', '#sexy', '#sleepy', 
					   '#sorry', '#sweet', '#thrilled', '#upset' ];
var emotionList = {
	total: 0,
	keywords: {}
};

_.each(emotionKeywords, function (keyword) {
	emotionList.keywords[keyword] = 0;
});

function createStream(t) {
	t.stream('statuses/filter', { track: emotionKeywords }, function (stream) {
		stream.on('data', function (tweet) {
			if (tweet.text !== undefined) {
				var text = tweet.text.toLowerCase();
				var match = _.find(emotionKeywords, function (keyword) {
					return text.indexOf(keyword.toLowerCase()) !== -1;	
				});
				
				if (match) {
					emotionList.keywords[match] += 1;				
					emotionList.total += 1;
					eventEmitter.emit('update');
				}
			}
		});
	});	
}

fs.readFile('../../../shared/config/twitter.json', function (err, data) {
	var t;
	if (!err) {
		var auth = JSON.parse(data);
		t = new twitter(auth);

		if (t) {
			createStream(t);
		} else {
			t = new twitter(auth);
			if (t) {
				createStream(t);
			}
		}		
	}
});

new cronJob('0 0 0 * * *', function () {
    emotionList.total = 0;

    _.each(emotionKeywords, function(keyword) { 
    	emotionList.keywords[keyword] = 0; 
    });
}, null, true);

function how_were_feeling_get(request, response) {
	response.render("how_were_feeling/index", { data: emotionList });
}

function how_were_feeling_io(socket, io, feeling) {
	feeling.emit('data', { data: emotionList });
	
	function sendOutData () {
		feeling.emit('data', { data: emotionList });		
	}

	eventEmitter.once('update', sendOutData);
	
	socket.on('disconnect', function () {
		eventEmitter.removeListener('update', sendOutData);
	});
}

function how_were_feeling_post(request, response, io) {}


exports.how_were_feeling_io = how_were_feeling_io;
exports.how_were_feeling_get = how_were_feeling_get;