
//var sc = require('../Socket.IO-node-client/index');
var sc = require('socket.io-client-xstreamly')
,ID = require('./src/id')

var handleS = function(socket,uid){
	var message = function(m,m1){
		console.log(uid,m,m1);
	}
	socket.on('reconnect', function (e) {
		message('System', 'Reconnected to the server');
		console.log(e)
	});

	socket.on('reconnecting', function () {
		message('System', 'Attempting to re-connect to the server');
	});

	socket.on('error', function (e) {
		message('System error', e ? e : 'A unknown error occurred');
		socket.close();
		console.log(e)
	});
	socket.on('login', function (e) {
		message('server-login',  JSON.stringify(e));
		console.log(e)
	});

	socket.on('offline', function (e) {
		message('server-offline',  JSON.stringify(e));
		console.log(e)
	});

	socket.on('connect', function(){
		message('System', 'Connected to chat server!');
	});

	socket.on('disconnect', function() {
		//socket = io.connect();
	});

	socket.on('connect_failed', function(e) {
		message('System connect_failed' , e ? e : ' connect_failed Connection to chat server failed');
	});

	socket.on('message', function(data){
		console.log('on message',data);
		message('received message',JSON.stringify(data))
		message(data._fn ,JSON.stringify(data.c))
	});


	socket.on('online', function(d){
		message('online:',d)
	})
	socket.on('recentm', function(d){
		message('recentm:',d)
	})
}

var cid1 = ID.genCid(1),cid2= ID.genCid(2);
console.log(cid1,cid2)
if(process.argv[2] != 1){
	var s1 = sc.connect('http://localhost:8880?cid=' + cid1);
	handleS(s1,'user1')

	//发送一条给用户2

	s1.emit('message',{to:2,c:'test msg'});
	s1.emit('online',{ids:[1,2,3]});
}else{
	var s2 = require('socket.io-client-xstreamly').connect('http://localhost:8880?cid=' + cid2);
	handleS(s2,'user2');
	console.log('connet 2',cid2)
	s2.emit('online',{ids:[1,2,3]});
	s2.emit('recentm',{ids:[1,2,3]});


}


