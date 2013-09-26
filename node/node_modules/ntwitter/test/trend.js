var ntwitter = require('../index.js'),
    mocha = require('mocha'),
    should = require('should'),
    fs = require('fs'),
    config = JSON.parse(fs.readFileSync('./config.json'));

var twitter = new ntwitter({
  consumer_key: config.key,
  consumer_secret: config.secret,
  access_token_key: config.token_key,
  access_token_secret: config.token_secret
});

describe('Twitter Trend API', function() {
  it('Origin getTrends still work', function(done) {
    twitter.getTrends(function(err, data) {
      data[0].trends.should.not.be.empty;
      done();
    });
  });

  it('Origin getCurrentTrends still work', function(done) {
    twitter.getCurrentTrends(function(err, data) {
      data[0].trends.should.not.be.empty;
      done();
    });
  });

  it('GET trends/:woeid data without earth id', function(done) {
    twitter.getTrendsWithId(null, function(err, data) {
      data[0].trends.should.not.be.empty;
      done();
    });
  });

  it('GET trends/:woeid data wih earth id', function(done) {
    twitter.getTrendsWithId('23424977', function(err, data) {
      data[0].trends.should.not.be.empty;
      data[0].locations[0].name.should.equal('United States');
      done();
    });
  });
});
