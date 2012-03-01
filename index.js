
require ('./src/server')
var fs = require('fs')

app.listen(app.set('port'));
log.info("Chat app server listening on port", app.set('port'));

var pidfile = process.cwd() + '/chat.pid'
process.argv.forEach(function (val, index, array) {
	if('-p'===val || '--pidfile' === val){
		pidfile = process.argv[index+1]
	}
});


fs.writeFile( pidfile, process.pid, function (err) {
  if (err) throw err;
  log.info('pid  saved in file:"' , pidfile , '" ' + process.pid );
});

process.on('uncaughtException', function (err) {
  log.error('Caught exception: ' + err);
});

process.on('exit',function(){
	log.error('process ',process.pid + ' exit, running time: ', process.uptime(),' seconds')
	fs.unlinkSync(pidfile)
})
process.on('SIGHUP', function () {
  log.error('Got SIGHUP signal.');
});
process.on('SIGINT', function () {
    log.error('Got signal SIGINT');
	process.exit(0);
});
process.on('SIGTERM', function () {
    log.info('Got SIGTERM signal.' );
	process.exit(0);
});
process.on('SIGPIPE', function () {
  console.error('Got SIGPIPE signal.');
});
