
// login form route
app.get('/',function(req, res) {
	auth.loadUser(req,null,function(){
		if (req.currentUser) {
			res.redirect('/chat');
			return;
		}
		//*/
		res.render('user/login', {
			locals: {
				user: new User()
			}
		});
	});
});

// login route
app.post('/', function(req, res) {
  User.findOne({ email: req.body.user.email }, function(err, user) {
    if (user && user.authenticate(req.body.user.password)) {
      req.session.userid = user.id;
      if (req.body.remember_me) {
        var token = new LoginToken({ email: user.email });
          token.save(function() {
          res.cookie('logintoken', token.cookieValue, { expires: new Date(Date.now() + 2 * 604800000), path: '/' });
		  res.redirect('/chat');
		  console.log('login',user,token,token.cookieValue)
        });
      }else{
		  res.redirect('/chat');
	  }
      
    } else {
      req.flash('error', 'Login failed');
      res.redirect('/');
    }
  });
});

//logout user
app.get('/logout', auth.loadUser, function(req, res) {
  console.log('logout',req)
  if (req.session) {
    LoginToken.remove({ email: req.currentUser.email }, function() {});
    res.clearCookie('logintoken');
    req.session.destroy(function() {});
  }
  res.redirect('/');
});

// register form route
app.get('/register', function(req, res) {
  res.render('user/register', {
    locals: {
      register: new User()
    }
  });
});

// create user route
app.post('/register', function(req, res) {
//	req.body.register.email = req.body.register.email +'@playcrab.com'
  User.findOne({ email: req.body.register.email }, function(err, user) {
    if (user) {
      // show error on username
      req.flash('error', 'E-Mail address already registred!');
      res.render('user/register', {
        locals: {
          register: req.body.register
        }
      });
    } else if (req.body.register.password != req.body.password_verify) {
      req.flash('error', 'Passwords do not match!');
      res.render('user/register', {
        locals: {
          register: req.body.register
        }
      });
    } else {
      var nUser = new User(req.body.register);
      // check username
      User.findOne({ name: nUser.name }, function(err, userCheck) {
        if (userCheck) {
          req.flash('error', 'Username is already taken!');
          res.render('user/register', {
            locals: {
              register: req.body.register
            }
          });
        } else {
          function userSaveFailed() {
            req.flash('error', 'Error while saving your registration!');
            res.render('user/register', {
              locals: { register: nUser }
            });
          }

          nUser.save(function(err) {
            if (err) userSaveFailed();
			req.session.userid = nUser.id;
            req.flash('info', 'Registration successful');
			
            res.redirect('/');
          });
        }
      });
    }
  });
});
