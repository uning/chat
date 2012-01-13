
// get required modules
express = require('express'),
  mongoose = require('mongoose'),
  stylus = require('stylus'),
  nib = require('nib'),
  MongoStore = require('connect-mongo'),
  RedisStore = require('connect-redis')(express),
  models = require('./models'),
  ID = require('./id')

// include authentication helpers
auth = require('./auth').AuthHelper;
uor = require('./useronline.registry').UserOnlineRegistry;

// include commonjs-utils and extensions
json = require('commonjs-utils/lib/json-ext');
base64 = require('commonjs-utils/lib/base64');
date = require('./date-ext');

// create server object
app = exports.module = express.createServer();


// setup helpers
app.helpers(require('./helpers.js').helpers);
app.dynamicHelpers(require('./helpers.js').dynamicHelpers);


//require config
sio = exports.sio  = require('socket.io').listen(app)
require('./config');

sio.configure( function(){
	var cp = express.cookieParser();
	//处理连接，ip 封禁
	//根据cid 处理 等 
	sio.set('authorization', function (handshakeData, callback) {
		//console.log('handshakeData',handshakeData);
		cp(handshakeData,null,function(){
			//console.log('handshakeData',handshakeData);
			if(handshakeData.query.cid){ //处理flash 连接情况(以cid 为参数)
				u = ID.parseCid(handshakeData.query.cid); 
				if(u){
					handshakeData.userid = u; //handshaked
					callback(null, true);
					handshakeData.username = handshakeData.query.name || 'user' + u 
					uor.addUser(handshakeData.userid,handshakeData.username)
					console.log('cid handshake ok',handshakeData.userid)
				}else{
					console.log('cid handshake error : no userid',handshakeData)
				}
			}else{ //处理网页情况(以cookie 为参数,已经登录)
				auth.loadUser(handshakeData,null,function(){
					if(handshakeData.currentUser){
						handshakeData.userid = handshakeData.currentUser.id;
						callback(null, true);
						handshakeData.username = handshakeData.currentUser.name || handshakeData.currentUser.email
						uor.addUser(handshakeData.userid,handshakeData.username)
						console.log('cookie handshake ok ',handshakeData.userid)
					}else{
						callback(null, false);
						console.log('cookie handshake error : no userid',handshakeData)
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
//configure server instance
app.configure(function(){

  app.set('connstring', 'mongodb://' + app.set('m_host') +':'+app.set('m_port') +'/' + app.set('m_database'));
  app.set('views', __dirname + '/views');
  // set jade as default view engine
  app.set('view engine', 'jade');


  // set stylus as css compile engine

  var compile = function(str, path) {
    return stylus(str)
      .set('filename', path)
      .use(nib());
  };
  app.use(stylus.middleware(
    { src: __dirname + '/stylus', dest: __dirname + '/public', compile: compile }
  ));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  // use connect-mongo as session middleware
  app.use(express.session({
    secret: 'topsecret',
    //store: new MongoStore({ db: app.set('m_database'), host: app.set('m_host'),port:app.set('m_port') })
    store: new MongoStore(app.set('sessionMongo'))
  }));
  app.use(express.methodOverride());
  app.use(app.router);
  // use express logger
  app.use(express.logger({ format: '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m :response-time ms' }));
  app.use(express.static(__dirname + '/public'));
});

//configure mongoose models
models.defineModels(mongoose, function() {
  app.Message = Message = mongoose.model('Message');
  app.User = User = mongoose.model('User');
  app.LoginToken = LoginToken = mongoose.model('LoginToken');
  db = mongoose.connect(app.set('connstring'));
});

// require routes
require('./routes/chat');
require('./routes/user');

if (!module.parent) {
  app.listen(app.set('port'));
  // TODO: implement cluster as soon as its stable
  /* cluster(app)
    .set('workers', 2)
    .use(cluster.debug())
    .listen(app.set('port'));*/
  console.log("Chat app server listening on port %d", app.address().port);
}
