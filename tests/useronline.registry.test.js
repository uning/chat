
module.exports = {
	setUp: function (callback) {
		this.foo = 'bar';
		require('../server')
		u = uor.addUser('1','testname')
		callback();
	},
	tearDown: function (callback) {
		// clean up
		callback();
		//process.exit(); // tell me how to quit elagently
		setTimeout(process.exit,1000);//asume 1s to run over
		
	},
	testChatUser:{
	  tome:function (test) {
			test.equals(this.foo, 'bar');
			var msg = {c:'a message from user',t:1}
			u.tome(msg)
			rc.multi()
			.lrange('msg:'+u.id,0,-1,function(err,r){
				console.log(r)

				//test.equals(r,json.stringify(u))
			}).exec(function(){
				test.done();
			});


	  },
	  login:function(test){
		  u.login()
		  rc.multi()
		  .get('info:'+u.id,function(err,r){
			  var ru = json.parse(r);
			  test.equals(ru.n,u.n)
			  test.equals(ru.id,u.id)
		    }).exec(function(){
				test.done();
			});
	  }
	  
	}
};
