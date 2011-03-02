(function() {
  function toggleMessageBox(state) {
    var el = $('.chat-message');
    if (state == 'inactive') {
      if (el.hasClass('disabled'))
        return;
      el.removeClass('enabled');
      el.addClass('disabled');
      el.removeAttr('enabled');
      el.attr('disabled', 'disabled');
    } else {
      if (el.hasClass('enabled'))
        return;
      el.removeClass('disabled');
      el.addClass('enabled');
      el.removeAttr('disabled');
      el.attr('enabled', 'enabled');
    }
  }
  
  $(document).ready(function() {
    // hook up submit events
    $('#submit-button').click(function() {
      var form = $(document.forms[0]);
      var validator = form.validate();
      if (validator.form())
        form.submit();
    });
    
    // manage flash messages
    function hideFlashMessages() {
      $(this).fadeOut();
    }
    setTimeout(function() {
      $('.flash').each(hideFlashMessages);
    }, 5000);
    $('.flash').click(hideFlashMessages);
    
    // check if we are showing the chat interface
    if ($('.chat-message').length > 0) {
      var currentUsername = $('input[name="username"]').val();
      var currentUserid = $('input[name="userid"]').val();
      
      // set connection state
      $('.connection-state').html('Connecting to chat server...');
      // open up chat socket
      socket = new io.Socket('localhost');
      socket.connect();
            
      socket.on('connect', function(){
        // connected, register user on server
        var jsonMsg = {
            action: 'SIGNIN',
            name: currentUsername,
            userid: currentUserid
          };
        socket.send(JSON.stringify(jsonMsg));
        
        // set ui state
        $('.connection-state').html('Connected to chat server!');
        toggleMessageBox('active');
      });
      
      socket.on('disconnect', function() {
        toggleMessageBox('inactive');
        $('.connection-state').html('Connection to chat server lost, retrying...');        
        socket.connect();
      });
      
      socket.on('connect_failed', function() {
        $('.connection-state').html('Connection to chat server failed, retrying...');   
        socket.connect();
      });
      
      socket.on('message', function(data){
        // create new message element and inject to message list
        var jsonMsg = JSON.parse(data);
        
        switch (jsonMsg.action) {
          case 'USERS':
            // replace userlist            
            $('#chatusers .user-list').html('');
            for (var idx in jsonMsg.currentUsers) {
              var userObj = jsonMsg.currentUsers[idx];
              var elem = $('<li>');
              var html = '» ';
              switch (userObj.state) {
                case 0:
                  // available
                  elem.addClass('avail');
                  html += userObj.name;
                  break;
                case 1:
                  // afk
                  elem.addClass('afk');
                  html += userObj.name + ' (away)';
                  break;
              }
              elem.html(html);
              $('#chatusers .user-list').append(elem);
            }
            $('#chatusers').show();
            break;
          case 'MESSAGE':
            // append new message element
            var elem = $('<li>')
              .html('<span class="date">[' + jsonMsg.posted +
                ']</span><span class="name">' + jsonMsg.name +
                '</span>:<span class="message">&nbsp;' + jsonMsg.message + '</span>');
          
            $('#chat-messages').append(elem);
            break;
        }
      });
      
      // bind input event
      $('.chat-message').bind('keydown', function(e) {
        if (e.keyCode == 13) {
          var msg = this.value;
          // check if we are sending a command
          if (msg.substr(0,1) == "/") {
            // send command to server
            var jsonMsg = {
                  action: 'COMMAND',
                  cmd: msg.substr(1, msg.length - 1)
                };
          } else {
            // send message to server
            var jsonMsg = {
                  action: 'SEND',
                  body: msg,
                  name: currentUsername
                };
          }
          socket.send(JSON.stringify(jsonMsg));
          this.value = '';
        }
      });
    }
  });
})();