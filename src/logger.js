

var getReadableDate = function() {
	var padDatePart = function(part) {
		return (part < 10 ? '0' + part : part);
	}

	var inputDate = new Date();
	var year, month,day,hour,min,sec 
	year = inputDate.getFullYear();
	month = inputDate.getMonth();
	day = inputDate.getDate();
	hour = inputDate.getHours();
	min = inputDate.getMinutes();
	sec = inputDate.getSeconds();
	return year+' ' + 
		padDatePart(month) + '' +
		padDatePart(day) + ' ' +
		padDatePart(hour) + ':' +
		padDatePart(min) + ':' +
		padDatePart(sec);
};

/**
 * Module dependencies.
 */

/**
 * Log levels.
 */

var levels = [
    'error'
  , 'warn'
  , 'info'
  , 'debug'
];
var level2int={};
var padlevels=[]

/**
 * Colors for log levels.
 */

var colors = [
    31
  , 33
  , 36
  , 90
];


exports.getLogger = function (opts) {
	return new Logger(opts)
}
var Logger = function (opts) {
  opts = opts || {}
  this.colors = false !== opts.colors;
  this.level = 3;
  this.enabled = true;
};

/**
 * Log method.
 * @api public
 */
Logger.prototype.log = function () {
  var index = level2int[this.type];
  if (index > this.level || !this.enabled)
    return this;


   var inputDate = new Date();
   var param = [];

   if(this.colors)
	   param.push('   \033[' + colors[index] + 'm' + padlevels[index] + ' -\033[39m');
   else
	   param.push( padlevels[index] )
  param.push('['+getReadableDate()+']');
  for (var i = 0, l = arguments.length; i < l; i++)
    param.push(arguments[i]);

  console.log.apply(console,param);

  return this;
};

/**
 * Generate methods.
 */
var max = 0;
levels.forEach(function (name,k) {
  level2int[name] = k;
  max = Math.max(max, name.length);
  Logger.prototype[name] = function () {
	  this.type = name;
      this.log.apply(this,arguments);
  };
});

levels.forEach(function (name,k) {
 padlevels.push(name + new Array(max - name.length + 1).join(' '));
});
