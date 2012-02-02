

var markdown = require('markdown').markdown
,fs = require('fs')

// login form route
app.get('/help', function(req, res) {
  if (req.session) {
	   fs.readFile(app.set('views') + '/readme.md',function(err,data){
		   if (err) {
			   throw err;
		   }
		   md = data.toString('utf8');
		   res.send(markdown.toHTML(md));
	   });
  }else
	  res.send('please login to see');
});

