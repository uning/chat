
require ('./src/server')
app.listen(app.set('port'));
log.info("Chat app server listening on port %d", app.address().port);

