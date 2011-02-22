var sio = require('socket.io');

app.get('/chat', auth.loadUser, function(req, res, next) {
  // render chat interface
  res.render('chat/index', {});
});

var socket = sio.listen(app);

var loggedInUsers = [];

socket.on('connection', function(client) {
  client.on('message', function(m, c) {
    // parse message
    var msg = json.parse(m);
    
    switch (msg.action) {
      case 'LOGIN':
        
        break;
      case 'SEND':
        // send message to channel
        var broadCast = {
          posted: date.toReadableDate(new Date(), 'timestamp'),
          message: msg.body,
          name: msg.name
        };
    
        // send to all clients
        socket.broadcast(json.stringify(broadCast));
        break;
    }
  });
  
  client.on('disconnect', function(c) {
    console.log('client ' + c + ' disconnected');
  });
});