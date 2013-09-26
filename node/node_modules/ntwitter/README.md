Asynchronous Twitter client API for node.js
===========================================

[ntwitter](http://github.com/AvianFlu/ntwitter) is an improved version of jdub's [node-twitter](http://github.com/jdub/node-twitter), which in turn was inspired by, and uses some code from, technoweenie's [twitter-node](http://github.com/technoweenie/twitter-node).


## Installation

You can install ntwitter and its dependencies with npm: `npm install ntwitter`.


## Getting started

This library is, for the most part, the same API as `node-twitter`. Much of the documentation below is straight from `node-twitter` - credit goes to [jdub](http://github.com/jdub) for putting all this together in the first place. 

The most significant API change involves error handling in callbacks. Callbacks now receive the error as a separate parameter, rather than as part of the data. This is consistent with node's standard library. Callbacks should now look something like this:

``` javascript
function (err, result) {
  if (err) return callback(err);

  // Do something with 'result' here
}
```

Where `callback` is the parent function's callback.  (Or any other function you want to call on error.)


### Setup API 

The keys listed below can be obtained from [dev.twitter.com](http://dev.twitter.com) after [setting up a new App](https://dev.twitter.com/apps/new).

``` javascript
var twitter = require('ntwitter');

var twit = new twitter({
  consumer_key: 'Twitter',
  consumer_secret: 'API',
  access_token_key: 'keys',
  access_token_secret: 'go here'
});
```


### REST API 

Interaction with other parts of Twitter is accomplished through their RESTful API.
The best documentation for this exists at [dev.twitter.com](http://dev.twitter.com).  Convenience methods exist
for many of the available methods, but some may be more up-to-date than others.
If your Twitter interaction is very important, double-check the parameters in the code with 
Twitter's current documentation.

Note that all functions may be chained:

``` javascript
twit
  .verifyCredentials(function (err, data) {
    console.log(data);
  })
  .updateStatus('Test tweet from ntwitter/' + twitter.VERSION,
    function (err, data) {
      console.log(data);
    }
  );
```

### Search API 

``` javascript
twit.search('nodejs OR #node', {}, function(err, data) {
  console.log(data);
});
```

### Streaming API 

The stream() callback receives a Stream-like EventEmitter.

Here is an example of how to call the `statuses/sample` method:

``` javascript
twit.stream('statuses/sample', function(stream) {
  stream.on('data', function (data) {
    console.log(data);
  });
});
```
        
Here is an example of how to call the 'statuses/filter' method with a bounding box over San Fransisco and New York City ( see streaming api for more details on [locations](https://dev.twitter.com/docs/streaming-api/methods#locations) ):

``` javascript
twit.stream('statuses/filter', {'locations':'-122.75,36.8,-121.75,37.8,-74,40,-73,41'}, function(stream) {
  stream.on('data', function (data) {
    console.log(data);
  });
});
```

ntwitter also supports user and site streams:

``` javascript
twit.stream('user', {track:'nodejs'}, function(stream) {
  stream.on('data', function (data) {
    console.log(data);
  });
  stream.on('end', function (response) {
    // Handle a disconnection
  });
  stream.on('destroy', function (response) {
    // Handle a 'silent' disconnection from Twitter, no end/error event fired
  });
  // Disconnect stream after five seconds
  setTimeout(stream.destroy, 5000);
});
```

## Contributors

[Lots of people contribute to this project. You should too!](https://github.com/AvianFlu/ntwitter/contributors)

## TODO

- Complete the convenience functions, preferably generated
- Support [recommended reconnection behaviour](https://dev.twitter.com/docs/streaming-apis/connecting#Best_practices) for the streaming APIs

