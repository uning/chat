var crypto = require('crypto');

function defineModels(mongoose, fn) {
  var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
  
  var monthNames = [ 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli',
                     'August', 'September', 'Oktober', 'November', 'Dezember' ];
  var monthNamesShort = [ 'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul',
                          'Aug', 'Sep', 'Okt', 'Nov', 'Dez' ];
   
  /**
   * User model
   * 
   * Used for persisting users
   */  
  function validatePresenceOf(value) {
    return value && value.length;
  }
  
  User = new Schema({
    email: String,
    name: String,
    lastseen: Date,
    isonline: Boolean,
    hashed_password: String,
    salt: String
  });
  
  User.virtual('lastseendate')
    .get(function() {
      var year = this.lastseen.getFullYear();
      var month = monthNames[this.lastseen.getMonth()];
      var day = this.lastseen.getDate();      
      return (day < 10 ? '0' + day : day) + '. ' + month + ' ' + year;
    });
  
  User.virtual('id')
    .get(function() {
      return this._id.toHexString();
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
    if (!validatePresenceOf(this.password)) {
      next(new Error('Ungueltiges Passwort'));
    } else {
      next();
    }
  });
  
  /**
   * Message model
   * 
   * Used for persisting chat messages
   */
  Message = new Schema({
    posted: Date,
    user: ObjectId,
    message: String
  });
  
  Message.virtual('posteddate')
    .get(function() {
      var year = this.posted.getFullYear();
      var month = monthNames[this.posted.getMonth()];
      var day = this.posted.getDate();      
      return (day < 10 ? '0' + day : day) + '. ' + month + ' ' + year;
    });
  
  /**
   * LoginToken model
   * 
   * Used for persisting session tokens
   */
  LoginToken = new Schema({
    email: { type: String, index: true },
    series: { type: String, index: true },
    token: { type: String, index: true }
  });
  
  LoginToken.virtual('id')
    .get(function() {
      return this._id.toHexString();
  });

  LoginToken.virtual('cookieValue')
    .get(function() {
      return JSON.stringify({ email: this.email, token: this.token, series: this.series });
    });
  
  LoginToken.method('randomToken', function() {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  });

  LoginToken.pre('save', function(next) {
    this.token = this.randomToken();
    this.series = this.randomToken();
  });
  
  // register mongoose models
  mongoose.model('Message', Message);
  mongoose.model('User', User);
  mongoose.model('LoginToken', LoginToken);
  fn();
}

exports.defineModels = defineModels;