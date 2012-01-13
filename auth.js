exports.AuthHelper = {
  /**
   * Authenticates a request using the login token
   * 
   * @param express request
   * @param express response
   * @param express next function
*/
	authFromLoginToken: function(req, res, next) {
		var cookie = JSON.parse(req.cookies.logintoken);
		LoginToken.findOne({ email: cookie.email, token: cookie.token }, function(err, token) {
			console.log(__filename,err,token,cookie)
			if (!token) {
				res &&  res.redirect('/') || next()
			}else{
				User.findOne({ email: token.email }, function(err, user) {
					if (user) {
						req.session.user_id = user.id;
						req.currentUser = user;

						if(res){//更新token
							//token.token = token.randomToken();//已经自动更新了
							token.save(function(){
								res && res.cookie('logintoken', token.cookieValue, { expires: new Date(Date.now() + 2 * 604800000), path: '/' });
								next();
							});
						}else{
							next();
						}
					} else {
						res && res.redirect('/login') || next()
					}
				});
			}
		});
	},


  /**
   * Loads the user for a request
   * 
   * @param express request
   * @param express response
   * @param express next function
*/
	loadUser: function(req, res, next) {
		if (app.set('disableAuthentication') === true){
			next();
		}else {
			req.session = req.session || {};
			if (req.session.user_id) {
				User.findById(req.session.user_id, function(err, user) {
					if (user) {
						req.currentUser = user;
						next();
					} else {
						res && res.redirect('/') || next()
					}
				});
			} else if (req.cookies.logintoken) {
				this.authFromLoginToken(req, res, next);
			} else {
				res && res.redirect('/') || next();
			}
		}
	}
};
