

// get required modules
var  mongoose = require('mongoose'),
  models = require('./models'),
  ID = require('./id');

(function(){
  var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
     
	//moddel dsign
  /**
   * User model
   * 
   * Used for persisting users
   */  
  function validatePresenceOf(value) {
    return value && value.length;
  }
  
  var User = new Schema({
    _id: { type: Schema.Types.Mixed ,/* */ unique:true },
    email: { type: String, validate: [validatePresenceOf, 'Email address required'], index: true },
    name: String,
    lastseen: Date,
    isonline: Boolean,
    hashed_password: String,
    salt: String
  },{colletcion:'user',strict:false});
  
  User.virtual('lastseendate')
    .get(function() {
      return date.toReadableDate(this.lastseen, 'datestamp');
    });
  
  User.virtual('id')
    .get(function() {
		if(typeof this._id == 'object')
			return this._id.toHexString();
		return this._id
  });
  
  User.virtual('password')
    .set(function(pw) {
      this._password = pw;
      this.salt = this.createSalt();
      this.hashed_password = this.encryptPassword(pw);
    })
    .get(function() { return this._password; });
  
  User.method('authenticate', function(plain) {
    return this.encryptPassword(plain) === this.hashed_password;
  });
  
  User.method('createSalt', function() {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  });
  
  User.method('encryptPassword', function(str) {
    return crypto.createHmac('sha1', this.salt).update(str).digest('hex');
  });
  
  User.pre('save', function(next) {
    if (!validatePresenceOf(this.hashed_password)) {
      next(new Error('Invalid password'));
    } else {
      next();
    }
  });
  
  //register validators
  User.path('email').validate(function(val) {
    return val.length > 0;
  }, 'EMAIL_MISSING');
  
  User.path('name').validate(function(val) {
    return val.length > 0;
  }, 'NAME_MISSING');
  
  // register mongoose models
  mongoose.model('User', User,'user');
})();

//configure mongoose models
User = mongoose.model('User');
db = mongoose.connect('mongdb://localhost:35050/test');


mUser = new User({_id:'test1','aa':[1,2,3,4],'email':'test'});
console.log(mUser);

mUser.set('rr',{it:12323})
mUser.save(function(err,u){
	console.log('mUser.save ret ',err,u)
});
cond = {_id:3};

ObjectId = mongoose.Types.ObjectId;
//cond ={_id: new ObjectId('4f13df232f47688f03000001')}
User.findById(3,function(err,user){
	user.set('mmmm','aaa')
	user.save(function(err,u){
		console.log('mUser.save ret ',err,u)

	});
	console.log("user.findone: findById(3) ",err,user)
}
)

if(0){
User.findById(new ObjectId("4f13df232f47688f03000001"),function(err,user){
	console.log("user.findone: by (ObjectId()) ",err,user,user.id)
}
)

User.findById("4f13df232f47688f03000001",function(err,user){
	console.log("user.findone: by '4f13df232f47688f03000001' ",err,user)
}
)
User.findOne(cond,function(err,user){
	console.log("user.findone:cond ",err,user)
}
)
}

