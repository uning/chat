(function() {
  $(document).ready(function() {
    // check if we are viewing the chat interface
    if ($('.chat-message').length > 0) {
      // open up chat socket
      socket = new io.Socket('localhost');
      socket.connect();
      socket.on('connect', function(){
          // connected, register user on server
        console.log('connected to socket');
      });
      socket.on('message', function(data){
        // create new message element and inject to message list
        console.log(data);
        var jsonMsg = JSON.parse(data);
        
        var elem = $('<li>')
          .html('<span class="date">' + jsonMsg.posted +
              '</span><span class="name">' + jsonMsg.name +
              '</span>:<span class="message">' + jsonMsg.message + '</span>');
        
        $('#chat-messages').append(elem);
      });
      
      // bind input event
      $('.chat-message').bind('keydown', function(e) {
        if (e.keyCode == 13) {
          var name = $('.chat-name');
          if (name.length == 0)
            return;
          console.log(name);
          var msg = this.value;
          // send message to server
          var jsonMsg = {
                body: msg,
                name: name.val()
              };
          socket.send(JSON.stringify(jsonMsg));
          this.value = '';
        }
      });
    }
  });
})();