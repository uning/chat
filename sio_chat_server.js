
var app = require('http').createServer(handler)
, sio = require('socket.io').listen(app)
, fs = require('fs')

app.listen(8880);

function handler (req, res) {
	fs.readFile(__dirname + '/index.html',
				function (err, data) {
					if (err) {
						res.writeHead(500);
						return res.end('Error loading index.html');
					}

					res.writeHead(200);
					res.end(data);
				});
}

//confiure
//https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO
//process.env.NODE_ENV='development'
sio.configure('development', function(){
	sio.set('transports', [
		   'websocket'
		   , 'flashsocket'
		   , 'htmlfile'
		   , 'xhr-polling'
		   , 'jsonp-polling'
	]);
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
});

sio.sockets.on('connection', function (socket) {
	socket.emit('news', { hello: 'world' });
	socket.on('client_msg', function (data) {
		console.log('receive from :',data);
	});
	var i = 0;
	setInterval(function(){
		socket.emit('server_msg', { mess: 'sever msg' + i });
		i += 1;
	},5000);
});
