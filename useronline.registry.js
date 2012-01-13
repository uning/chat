/**
 * UserOnlineRegistry class
 */
exports.UserOnlineRegistry = {
  _currentUsers: {},
  _currentGroups: {}, //群
  addUser: function(userid,username,state,socket) {
	 state = state || 1;//1 handshaked 2 connected
	 this._currentUsers[userid] = { n: username, id: userid, s: state,socket:socket };
  },
  removeUser: function(userid) {
    if (userid in this._currentUsers)
      delete this._currentUsers[userid];
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
