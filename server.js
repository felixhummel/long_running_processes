var http = require('http');
var child_process = require('child_process');
var util = require('util');

var logEvents = function(obj, name, events) {
  var i;
  for (i=0; i < events.length; i++) {
    var ev = events[i];
    obj.on(ev, function() {
      var args = arguments.length == 0 ? '' : util.inspect(arguments);
      console.log(name+': ' + ev + ' ' + args);
    });
  }
};
var logConnectionEvents = function(conn, name) {
  logEvents(conn, name, ['connect', 'data', 'end', 'timeout', 'drain', 'error', 'close']);
};
var logStreamEvents = function(stream, name) {
  logEvents(stream, name, ['data', 'drain', 'error', 'close', 'pipe']);
};

http.createServer(function (req, res) {
  res.writeHead(200, {
    'transfer-encoding': 'chunked'
  });
  logStreamEvents(req, 'Request Stream');
  logStreamEvents(res, 'Response Stream');
  logConnectionEvents(res.connection, 'Request Connection');
  logConnectionEvents(res.connection, 'Response Connection');

  proc = child_process.spawn('./example_process');

  logStreamEvents(proc.stdout, 'STDOUT');
  util.pump(proc.stdout, res);
  /*
  proc.stdout.on('data', function(data) {
    res.write(data);
  });
  */
  req.connection.on('end', function() {
    res.end();
    proc.kill();
    console.log('=============================================================');
  });


}).listen(1337, "127.0.0.1");
console.log('Server running at http://127.0.0.1:1337/');

