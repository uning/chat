/**
 * UserOnlineRegistry class
 */

exports.UserOnlineRegistry = {
  _currentUsers: {},
  addUser: function(username, userid, sessionid) {
    this._currentUsers[sessionid] = { n: username, id: userid, s: 0 };
  },
  removeUser: function(sessionid) {
    if (sessionid in this._currentUsers)
      delete this._currentUsers[sessionid];
  },
  setState: function(sessionid, state) {
    if (sessionid in this._currentUsers) {
      this._currentUsers[sessionid].s = state;
    }
  },
  getState: function(sessionid) {
    if (sessionid in this._currentUsers) {
      return this._currentUsers[sessionid].s;
    }
  },
  getCurrent: function() {
    var ret = {};
    for (var idx in this._currentUsers) {
      ret[idx] = ({ name: this._currentUsers[idx].n, state: this._currentUsers[idx].s });
    }
    return ret;
  },
  getBySessionId: function(sessionid) {
    return this._currentUsers[sessionid];
  }
};