var sio = require('socket.io');

app.get('/chat', auth.loadUser, function(req, res, next) {
  // render chat interface

});

var socket = sio.listen(app);

socket.on('connection', function(client) {
  client.on('message', function(m, c) {
    console.log('rcvd "' + m + '" from ' + c);
  });
  
  client.on('disconnect', function(c) {
    console.log('client ' + c + ' disconnected');
  });
});