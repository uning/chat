// login form route
app.get('/', function(req, res) {
  res.render('user/login', {
    locals: {
      user: new User()
    }
  });
});

// login route
app.post('/', function(req, res) {
  User.findOne({ name: req.body.user.name }, function(err, user) {
    if (user && user.authenticate(req.body.user.password)) {
      req.session.user_id = user.id;
      
      if (req.body.remember_me) {
        var loginToken = new LoginToken({ email: user.email });
        loginToken.save(function() {
          res.cookie('logintoken', loginToken.cookieValue, { expires: new Date(Date.now() + 2 * 604800000), path: '/' });
        });
      }
      
      res.redirect('/chat');
    } else {
      req.flash('error', 'Login failed');
      res.redirect('/');
    }
  });
});

//logout user
app.del('/', auth.loadUser, function(req, res) {
  if (req.session) {
    LoginToken.remove({ email: req.currentUser.email }, function() {});
    res.clearCookie('logintoken');
    req.session.destroy(function() {});
  }
  res.redirect('/');
});

// register form route
app.get('/register', function(req, res) {
  
});