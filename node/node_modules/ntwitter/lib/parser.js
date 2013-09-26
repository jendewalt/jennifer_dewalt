// glorious streaming json parser, built specifically for the twitter streaming api
// assumptions:
//   1) ninjas are mammals
//   2) tweets come in chunks of text, surrounded by {}'s, separated by line breaks
//   3) only one tweet per chunk
//
//   p = new parser.instance()
//   p.addListener('object', function...)
//   p.receive(data)
//   p.receive(data)
//   ...

var EventEmitter = require('events').EventEmitter;

var Parser = module.exports = function Parser() {
  // Make sure we call our parents constructor
  EventEmitter.call(this);
  this.buffer = '';
  this.lastTime = null;
  return this;
};

// The parser emits events!
Parser.prototype = Object.create(EventEmitter.prototype);

Parser.END        = '\r\n';
Parser.END_LENGTH = 2;

Parser.prototype.receive = function receive(buffer) {
  this.lastTime = new Date().getTime();
  this.buffer += buffer.toString('utf8');
  var index, json;

  // We have END?
  while ((index = this.buffer.indexOf(Parser.END)) > -1) {
    json = this.buffer.slice(0, index);
    this.buffer = this.buffer.slice(index + Parser.END_LENGTH);
    if (json.length > 0) {
      try {
        json = JSON.parse(json);
      } catch (error) {
        this.emit('error', new Error('Invalid JSON - ', error.message));
      }
      this.emit('_data', json);
    }
  }
};


Parser.prototype.checkHeartbeat = function(){
  var self = this;
  var currentTime = new Date().getTime();

  if (self.lastTime !== null && self.lastTime < (currentTime - 30000)){
    self.emit("missedHeartbeat");
  }

  setTimeout(function(){ self.checkHeartbeat(); }, 30000  );
}