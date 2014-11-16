// [11/15/2014] I updated this app to remove the deprecated ntwitter and use twit. 
// The code has been refactored and loggers have been put in place to (hopefully) 
// keep it from crashing every few days. To see the original 180 Websites code,
// Checkout commit bc9bb05faa08fb6e49cbcfb8fceee3bb46b600cc

var _ = require('underscore');
var twit = require('twit');
var cronJob = require('cron').CronJob;
var fs = require('fs');
var emotionKeywords = ['#amazed', '#angry', '#annoyed', '#awesome', '#awkward', '#bored', 
                       '#calm', '#confused', '#delighted', '#depressed', '#elated', 
                       '#excited', '#grumpy', '#happy', '#hopeful', '#hurt', '#jealous', 
                       '#joyful', '#like', '#lonely', '#neat', '#nervous', 
                       '#proud', '#relaxed', '#sad', '#scared', '#sexy', '#sleepy', 
                       '#sorry', '#sweet', '#thrilled', '#upset' ];
var emotionList = {
    total: 0,
    keywords: {}
};

_.each(emotionKeywords, function (keyword) {
    emotionList.keywords[keyword] = 0;
});

var connected_sockets = []; 

// var auth = JSON.parse(fs.readFileSync('../config/twitter.json'));
var auth = JSON.parse(fs.readFileSync('../../../shared/config/twitter.json');
var twitter = new twit(auth);
var stream = twitter.stream('statuses/filter', { track: emotionKeywords })

stream.on('tweet', function (tweet) {
    if (!_.isUndefined(tweet.text)) {
        var text = tweet.text.toLowerCase();
        var match = _.find(emotionKeywords, function (keyword) {
            return text.indexOf(keyword.toLowerCase()) !== -1;  
        });

        if (match) {
            emotionList.keywords[match] += 1;               
            emotionList.total += 1;
            updateConnectedSockets();
        }
    }
});

stream.on('disconnect', function (msg) {
    fs.appendFile('./log/node_err.log', msg + "\n", function () {
        console.log(msg);
    });
});
stream.on('warning', function (msg) {
    fs.appendFile('./log/node_err.log', msg + "\n", function () {
        console.log(msg);
    });
});
stream.on('error', function (msg) {
    fs.appendFile('./log/node_err.log', msg + "\n", function () {
        console.log(msg);
    });
});
stream.on('reconnect', function (msg) {
    fs.appendFile('./log/node_err.log', msg + "\n", function () {
        console.log(msg);
    });
});
stream.on('limit', function (msg) {
    fs.appendFile('./log/node_err.log', msg + "\n", function () {
        console.log(msg);
    });
});

function how_were_feeling_get(request, response) {
    response.render("how_were_feeling/index", { data: emotionList });
}

function how_were_feeling_io(socket, io, feeling) {
    socket.emit('data', { data: emotionList });
    connected_sockets.push(socket);

    socket.on('disconnect', function () {
        connected_sockets = _.without(connected_sockets, _.findWhere(connected_sockets, { id: socket.id }));
    });
}

function updateConnectedSockets() {
	_.each(connected_sockets, function (socket) {
		socket.emit('data', { data: emotionList });
	});
}

exports.how_were_feeling_get = how_were_feeling_get;
exports.how_were_feeling_io = how_were_feeling_io;

new cronJob('0 0 0 * * *', function () {
    emotionList.total = 0;

    _.each(emotionKeywords, function(keyword) { 
        emotionList.keywords[keyword] = 0; 
    });
}, null, true);
