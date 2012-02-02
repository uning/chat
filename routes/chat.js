



app.get('/chat', auth.loadUser, function(req, res, next) {
  // render chat interface
  res.render('chat/index', { locals:
    {
      user: req.currentUser
    }
  });
});


sio.sockets.on('connection', function(socket) {

  if(!socket.handshake){
	  console.log('no handleshake')
	  socket.close();
	  return;
  }
  if(!socket.handshake.userid){
	  console.log('no userid')
	  socket.close();
	  return;
  }
  user = uor.addUser(socket.handshake.userid,socket.handshake.username,2,socket);
  user.lastseen = new Date();
  console.log('connection:',socket.handshake.username,socket.handshake.userid)

 //处理系统通知
  socket.emit('welcome', { hello: user.n});

  //加载处理器
  //socket.emit('eventnme',param) 产生事件
  //socket.send(message) 产生message,可以为json object 或字符串


  socket.on('message', function(m, c) {
	user = uor.getUser(socket.handshake.userid);
	console.log('message:',m,c,socket.handshake.userid)
	if(!user){
		console.log('iii!!! discard message ',m,socket.handshake.userid,'no user')
		return ;
	}
    // parse message
	var msg = m || {};
	if(typeof m == 'string'){
		try{
			msg = json.parse(m)
		}catch(e){
			console.error('message from '+socket.handshake.username +'invalid ',m);
			return;
		}
	}
    socket.broadcast.send(m);//just
	//public static const MSG_WORLD:int = 1,MSG_QUN:int = 2,MSG_SYS:int = 3,MSG_NOTICE = 4,MSG_USER = 0;
	/*
    switch (msg.action) {
      case 'SIGNIN':
        // set user as connected and add it to the loggedInUsers hash
        uor.addUser(msg.name, msg.userid, socket.sessionId);
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
              socket.broadcast.send(json.stringify(bCast));
            });
          }
        });
        break;
      case 'COMMAND':
        switch (msg.cmd) {
          case 'afk':
            if (uor.getState(socket.sessionId) == 1)
              uor.setState(socket.sessionId, 0);
            else
              uor.setState(socket.sessionId, 1);
            var bCast = {
              action: 'USERS',
              currentUsers: uor.getCurrent()
            };
            socket.broadcast.send(json.stringify(bCast));
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
    
        // send to all sockets
        socket.broadcast.send(json.stringify(broadCast));
        break;
    }
	*/
  });
  
  socket.on('disconnect', function(c) {
	  uor.removeUser(socket.handshake.userid);
	  console.log('disconnect:',c,socket.handshake.userid)
	  socket.broadcast.emit('offline',{userid:socket.handshake.userid});
	  /*
    var registredUser = uor.getBySessionId(socket.sessionId);
	if(!registredUser)
		return;
    User.findById(registredUser.id, function(err, user) {
      if (!user)
        return;
        user.lastseen = new Date();
        user.isonline = false;
        user.save(function(err) {
          uor.removeUser(socket.sessionId);
          
          var bCast = {
              action: 'USERS',
              currentUsers: uor.getCurrent()
          };
          socket.broadcast(json.stringify(bCast));
        });
    });
	*/
  });


});
