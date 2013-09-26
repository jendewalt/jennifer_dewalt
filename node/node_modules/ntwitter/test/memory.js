var	util = require('util'),
	twitter = require('twitter');

var	count = 0,
	lastc = 0;

function tweet(data) {
	count++;
	if ( typeof data === 'string' )
		util.puts(data);
	else if ( data.text && data.user && data.user.screen_name )
		util.puts('"' + data.text + '" -- ' + data.user.screen_name);
	else if ( data.message )
		util.puts('ERROR: ' + util.inspect(data));
	else
		util.puts(util.inspect(data));
}

function memrep() {
	var rep = process.memoryUsage();
	rep.tweets = count - lastc;
	lastc = count;
	console.log(JSON.stringify(rep));
	// next report in 60 seconds
	setTimeout(memrep, 60000);
}

var twit = new twitter({
	consumer_key: 'STATE YOUR NAME',
	consumer_secret: 'STATE YOUR NAME',
	access_token_key: 'STATE YOUR NAME',
	access_token_secret: 'STATE YOUR NAME'
})
.stream('statuses/sample', function(stream) {
	stream.on('data', tweet);
	// first report in 15 seconds
	setTimeout(memrep, 15000);
})
