var sanitizer = require('sanitizer');
var _ = require("underscore");
// var twitter = require('ntwitter');
var twit = require('twit');
var cronJob = require('cron').CronJob;
var fs = require('fs');
var util = require('util');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var emotionKeywords = ['#amazed', '#angry', '#annoyed', '#awesome', '#awkward', '#bored', 
					   '#calm', '#confused', '#delighted', '#depressed', '#elated', 
					   '#excited', '#happy', '#helpless', '#hopeful', '#hurt', '#jealous', 
					   '#joyful', '#lonely', '#like', '#neat', '#nervous', 
					   '#proud', '#relaxed', '#sad', '#scared', '#sexy', '#sleepy', 
					   '#sorry', '#sweet', '#thrilled', '#upset' ];
var emotionList = {
	total: 0,
	keywords: {}
};

_.each(emotionKeywords, function (keyword) {
	emotionList.keywords[keyword] = 0;
});

var twitter;
var stream;

fs.readFile('../config/twitter.json', function (err, data) {
	var auth = JSON.parse(data);
	twitter = new twit(auth);
	stream = twitter.stream('statuses/filter', { track: emotionKeywords })

	stream.on('tweet', function (tweet) {
	    if (tweet.text !== undefined) {
			var text = tweet.text.toLowerCase();
			var match = _.find(emotionKeywords, function (keyword) {
				return text.indexOf(keyword.toLowerCase()) !== -1;	
			});
			console.log(match);

		    if (match) {
				console.log(eventEmitter);
				emotionList.keywords[match] += 1;				
				emotionList.total += 1;
				eventEmitter.emit('update');
			}
	    }
	});

	stream.on('disconnect', function (msg) {
		fs.appendFile('../log/node_err.log', msg + "\n", function (){
			console.log(msg);
		});
	});
	stream.on('warning', function (msg) {
		fs.appendFile('../log/node_err.log', msg + "\n", function (){
			console.log(msg);
		});
	});
	stream.on('error', function (msg) {
		fs.appendFile('../log/node_err.log', msg + "\n", function (){
			console.log(msg);
		});
	});
	stream.on('reconnect', function (msg) {
		fs.appendFile('../log/node_err.log', msg + "\n", function (){
			console.log(msg);
		});
	});
	stream.on('limit', function (msg) {
		fs.appendFile('../log/node_err.log', msg + "\n", function (){
			console.log(msg);
		});
	});
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
	socket.emit('data', { data: emotionList });
	
	function sendOutData () {
		socket.emit('data', { data: emotionList });
	}

	eventEmitter.on('update', sendOutData);
	eventEmitter.on('update', function(){console.log('update')});
	
	socket.on('disconnect', function () {
		eventEmitter.removeListener('update', sendOutData);
	});
}

function how_were_feeling_post(request, response, io) {}

exports.how_were_feeling_io = how_were_feeling_io;
exports.how_were_feeling_get = how_were_feeling_get;
