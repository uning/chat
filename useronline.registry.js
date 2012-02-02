/**
 * UserOnlineRegistry class
*/
exports.UserOnlineRegistry = {
	_currentUsers: {},
	_currentGroups: {}, //群

	addUser: function(userid,username,state,socket) {
		user = this._currentUsers[userid] || {}

		user.n = username;
		user.s = state || 1;
		user.id = userid;
		user.socket = socket;
		this._currentUsers[userid] = user
		return user;
	},

	removeUser: function(userid) {
		if (userid in this._currentUsers){
			//user =  this._currentUsers[userid];
			delete  this._currentUsers[userid];
		}
	},

	setState: function(userid, state) {
		if (userid in this._currentUsers) {
			this._currentUsers[userid].s = state;
		}
	},
	getState: function(userid) {
		if (userid in this._currentUsers) {
			return this._currentUsers[userid].s;
		}
	},
	setSocket: function(userid, s) {
		if (userid in this._currentUsers) {
			this._currentUsers[userid].socket = s;
		}
	},

	getSocket: function(userid) {
		if (userid in this._currentUsers) {
			return this._currentUsers[userid].socket;
		}
	},

	getAll: function() {
		return this._currentUsers
	},

	getUser: function(userid) {
		if (userid in this._currentUsers) {
			return this._currentUsers[userid];
		}
	},

	addGroup:function(userid,groupid){
		this._currentUsers[groupid] = this._currentUsers[groupid] || {};
		if (userid in this._currentUsers) {
			this._currentUsers[groupid][userid] = 1;
		}
	}
};
