var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');

var child_process = require('child_process');
var util = require('util');

app.listen(1337);

function handler(req, res) {
  fs.readFile(__dirname + '/index.html', function (err, data) {
    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function(socket) {
  var proc;
  socket.on('run', function(data) {
    proc = child_process.spawn('./example_process');
    proc.stdout.setEncoding('utf8');
    proc.stdout.on('data', function(data) {
      socket.emit('proc', data);
      util.inspect(data);
    });
  });
  socket.on('kill', function(data) {
    proc.kill()
  });
});

