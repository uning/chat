var sio = require('socket.io');

app.get('/chat', auth.loadUser, function(req, res, next) {
  // render chat interface
  res.render('chat/index', {});
});

var socket = sio.listen(app);

socket.on('connection', function(client) {
  client.on('message', function(m, c) {
    // parse message
    var msg = json.parse(m);
    var broadCast = {
          posted: date.toReadableDate(new Date(), 'timestamp'),
          message: msg.body,
          name: msg.name
        };
    
    // send to all clients
    socket.broadcast(json.stringify(broadCast));
  });
  
  client.on('disconnect', function(c) {
    console.log('client ' + c + ' disconnected');
  });
});