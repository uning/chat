


//process.env.NODE_ENV='development'
app.configure('development', function(){
  app.set('m_database', 'chat-dev');
  app.set('m_host', 'localhost');
  app.set('m_port', 35050);

  app.set('sessionMongo',{ db: 'chat-dev', host:'localhost',port:35050 })
  app.set('sessionRedis',{ host:'localhost',port:53000})
  //配置server,使用redis
  app.set('confserver', {host:'127.0.0.1',port:53006});
  app.set('host', '192.168.1.50');
  app.set('port', 8880);
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.set('confserver', {host:'127.0.0.1',port:53006});
  app.set('sessionMongo',{ db: 'chat-dev', host:'localhost',port:35050 })
  app.set('sessionRedis',{ host:'localhost',port:53000})

  app.set('host', 'chat.playcrab.com');
  app.set('port', 8880);
  app.use(express.errorHandler()); 
});


//confiure socket io
//https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO
sio.configure('development', function(){
	sio.set('transports', [
		   'websocket'
		   , 'flashsocket'
		   , 'htmlfile'
		   , 'xhr-polling'
		   , 'jsonp-polling'
	]);
	/*
	heartbeat timeout defaults to 15 seconds

	The timeout for the client when it should send a new heart beat to the server. This value is sent to the client after a successful handshake.
			heartbeat interval defaults to 20 seconds

	*/
	sio.set('heartbeat timeout',30);sio.set('heartbeat interval',40);
});


sio.configure('production', function(){
	sio.enable('browser client etag');
	sio.set('log level', 1);
	sio.set('transports', [
		   'websocket'
		   , 'flashsocket'
		   , 'htmlfile'
		   , 'xhr-polling'
		   , 'jsonp-polling'
	]);
	sio.set('heartbeat timeout',30);sio.set('heartbeat interval',40);
});
