
require ('./src/server')
var fs = require('fs')

app.listen(app.set('port'));
log.info("Chat app server listening on port", app.set('port'));

var pidfile = process.cwd() + '/run.pid'
fs.writeFile( pidfile, process.pid, function (err) {
  if (err) throw err;
  log.info('pid  saved in ' + pidfile + ' ' + process.pid );
});

process.on('exit',function(){
	log.error(process.pid + 'exit')
	fs.unlinkSync(pidfile)
})
