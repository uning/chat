

sio = require('socket.io').listen(app);
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
	sio.set('heartbeat timeout',60);sio.set('heartbeat interval',80);
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

sio.configure( function(){
	var cp = express.cookieParser();
	//处理连接，ip 封禁
	//根据cid 处理 等 
	sio.set('authorization', function (handshakeData, callback) {
		//console.log('handshakeData',handshakeData);
		cp(handshakeData,null,function(){
			var u,uname
			log.info('handshakeData address',handshakeData.address);
			if(handshakeData.query.cid){ //处理flash 连接情况(以cid 为参数)
				u = ID.parseCid(handshakeData.query.cid); 
				if(u){
					callback(null, true);
					uname = handshakeData.query.name || 'user' + u 
					handshakeData.user = uor.addUser(u,uname)
					log.debug('cid handshake ok',handshakeData.user.id)
				}else{
					log.warn('cid handshake error : no userid',handshakeData)
				}
			}else{ //处理网页情况(以cookie 为参数,已经登录)
				auth.loadUser(handshakeData,null,function(){
					if(handshakeData.currentUser){
						u = handshakeData.currentUser.id;
						callback(null, true);
						uname = handshakeData.currentUser.name || handshakeData.currentUser.email
						handshakeData.user = uor.addUser(u,uname)
						log.debug('cookie handshake ok ',handshakeData.user.id)
					}else{
						callback(null, false);
						log.warn('cookie handshake error : no userid',handshakeData)
					}
				});
			}
		});

		 /*
		 findDatabyIP(handshakeData.address.address, function (err, data) {
			 if (err) return callback(err);

			 if (data.authorized) {
				 handshakeData.foo = 'bar';
				 for(var prop in data) handshakeData[prop] = data[prop];
				 callback(null, true);
			 } else {
				 callback(null, false);
			 }
		 })
		 */
	 })
});

/**
 * 处理聊天逻辑
 *
 *
*/
sio.sockets.on('connection', function(socket) {
  if(!socket.handshake){
	  log.warn('no handleshake')
	  socket.close();
	  return;
  }
  if(!socket.handshake.user){
	  log.warn('no user',socket.handshake)
	  socket.close();
	  return;
  }
  var user = socket.handshake.user;
  user.lastseen = new Date();
  user.socket = socket;
  log.info('connection:',user.n,user.id)

 //处理系统通知
 // socket.broadcast.emit('login', { n: user.n,id:user.id});
  user.login();//表示长连接成功
 


  //加载处理器
  //socket.emit('eventnme',param) 产生事件
  //socket.send(message) 产生message,可以为json object 或字符串

  socket.on('online', function(m, c) {
	  if( m && m.ids){
		  var len = m.ids.length,om = {},id,u;
		  for(var i = 0; i< len ;i++){
			  id = m.ids[i];
			  u = uor.getUser(id);
			  if(u && u.socket){
				  om[id] = 1;
			  }else
				  om[id] = 0;
		  }
		  socket.emit('online',om)
	  }

  });

  //最近消息
  socket.on('recentm', function(m, c) {
       var user = socket.handshake.user;
	   var callb = function(err,data){
		   if(err){

		   }
		   else{
			   socket.emit('recentm',{msgs:data})
		   }
	   }
	   user.getRecentMsgs(callb)
  });

  socket.on('message', function(m, c) {
    var user = socket.handshake.user;
    user.lastseen = new Date();
	log.debug('message:',m,socket.handshake.user.id,c)
    // parse message
	var msg = m || {};
	if(typeof m == 'string'){
		try{
			msg = json.parse(m)
		}catch(e){
			log.warn('message from '+socket.handshake.username +'invalid ',m);
			return;
		}
	}
	//socket.broadcast.send(m);//just
    /*
	### *消息定义*
	{
	 t: 1,     //消息类型 1 -世界聊天，2- 公会聊天，3 系统，4 系统通知，默认0 玩家一对一或1对多聊天
	 to: [],   //接收者id列表, 几个特殊的 ALL --所有 
	 c:''      // 消息内容        
	}
   */
   msg.t = msg.t || 0;
	var omsg = {_fid:user.id,_fn:user.n,_t:new Date().getTime(),c:msg.c,t:msg.t}
	//socket.emit('message',omsg)
	switch (msg.t) {
	  case 1:
	  case 3:
	  case 4:
		  //
		  socket.broadcast.emit('message',omsg)
		  break;
	  case 2: // 公会聊天
		break;
	  default: //玩家一对一或1对多聊天
		  var toids = msg.to,touser
	      if('all' === toids){
			  omsg.t = 1;
			  socket.broadcast.emit('message',omsg)
		  }else if( typeof '1' === typeof toids || typeof 1 === typeof toids  ){
			  touser = uor.getUser(toids);
			  touser && touser.tome(omsg) || uor.offlineMsg(toids,omsg) 
		  }else if(typeof toids === typeof []){
			  var unum = toids.length
			  for(var i = 0 ;i < unum ; i ++){
				  touser = uor.getUser(toids[i]);
				  touser && touser.tome(omsg) || uor.offlineMsg(toids[i],omsg);
			  }
		  }else{
			  log.warn('no `to` ignore',user.id,m);
		  }
	}
  });

  socket.on('disconnect', function(c) {
	//uor.removeUser(socket.handshake.userid);
	log.info('disconnect:',c,socket.handshake.user.id)
	socket.broadcast.emit('offline',{userid:socket.handshake.user.id});
	var user = socket.handshake.user;
	user.s  = 2;// offline
	user.socket = null;
  });


});
