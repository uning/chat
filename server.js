// fix up paths
require.paths.unshift('vendor');
require.paths.unshift('vendor/jade/lib');

// get required modules
var express = require('express'),
  mongoose = require('mongoose'),
  stylus = require('stylus'),
  //mongostore = require('connect-mongodb'),
  models = require('./models'),
  db;

// include authentication helpers
auth = require('./auth').AuthHelper;

// include commonjs-utils and extensions
json = require('commonjs-utils/lib/json-ext');
base64 = require('commonjs-utils/lib/base64');
date = require('./date-ext');

// create server object
app = exports.module = express.createServer();

// setup helpers
app.helpers(require('./helpers.js').helpers);
app.dynamicHelpers(require('./helpers.js').dynamicHelpers);

// stylus compile function
function compile(str, path, fn) {
  stylus(str)
    .set('filename', path)
    .set('compress', true)
    .render(fn);
}

//configure environments
app.configure('development', function(){
  app.set('connstring', 'mongodb://localhost/chat-dev');
  app.set('port', 9002);
  app.set('host', 'localhost');
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.set('port', 3002);
  app.set('connstring', 'mongodb://localhost/chat');
  app.set('host', 'chat.schaermu.ch');
  app.use(express.errorHandler()); 
});

//configure server instance
app.configure(function(){
  app.set('views', __dirname + '/views');
  // set jade as default view engine
  app.set('view engine', 'jade');
  // set stylus as css compile engine
  app.use(stylus.middleware(
    { src: __dirname + '/stylus', dest: __dirname + '/public', compile: compile }
  ));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  // use connect-mongodb as session middleware
  //app.use(express.session({ store: mongostore(app.set('connstring')), secret: 'topsecret' }));
  // FIX: temporarily use in-memory session store (connect-mongodb middleware is broken as of 0.1.1)
  app.use(express.session({ secret: 'topsecret' }));
  app.use(express.methodOverride());
  app.use(app.router);
  // use express logger
  app.use(express.logger({ format: '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m :response-time ms' }));
  app.use(express.static(__dirname + '/public'));
});

//configure mongoose models
models.defineModels(mongoose, function() {
  app.Message = BlogPost = mongoose.model('Message');
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
    .listen(app.set('port')); */
  console.log("Chat app server listening on port %d", app.address().port);
}