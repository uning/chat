var sio = require('socket.io'),
  uor = require('../useronline.registry').UserOnlineRegistry;

app.get('/chat', auth.loadUser, function(req, res, next) {
  // render chat interface
  res.render('chat/index', { locals:
    {
      user: req.currentUser,
      host: app.set('host')
    }
  });
});

var socket = sio.listen(app);

socket.on('connection', function(client) {
  client.on('message', function(m, c) {
    // parse message
    var msg = json.parse(m);
    
    switch (msg.action) {
      case 'SIGNIN':
        // set user as connected and add it to the loggedInUsers hash
        uor.addUser(msg.name, msg.userid, client.sessionId);

        User.findById(msg.userid, function(err, user) {
          if (!user)
            return;
          else {
            user.lastseen = new Date();
            user.isonline = true;
            user.save(function(err) {
              var bCast = {
                  action: 'USERS',
                  currentUsers: uor.getCurrent()
              };
              socket.broadcast(json.stringify(bCast));
            });
          }
        });
        break;
      case 'COMMAND':
        switch (msg.cmd) {
          case 'afk':
            if (uor.getState(client.sessionId) == 1)
              uor.setState(client.sessionId, 0);
            else
              uor.setState(client.sessionId, 1);
            var bCast = {
              action: 'USERS',
              currentUsers: uor.getCurrent()
            };
            socket.broadcast(json.stringify(bCast));
            break;
          case 'msg':
            
            break;
        }
        break;
      case 'SEND':
        // send message to channel
        var broadCast = {
          action: 'MESSAGE',
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
    var registredUser = uor.getBySessionId(client.sessionId);
    User.findById(registredUser.id, function(err, user) {
      if (!user)
        return;
      else {
        user.lastseen = new Date();
        user.isonline = true;
        user.save(function(err) {
          uor.removeUser(client.sessionId);
          
          var bCast = {
              action: 'USERS',
              currentUsers: uor.getCurrent()
          };
          socket.broadcast(json.stringify(bCast));
        });
      }
    });
  });
});