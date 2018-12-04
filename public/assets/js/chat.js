const outputHolder = document.getElementsByClassName('chat_messages')[0],
      typingHolder = document.getElementsByClassName('chat_istyping')[0],
      messageHolder = document.getElementById('message-input'),
      roomHolder = document.getElementById('roomname'),
      btn = document.getElementById('message-send'),
      usernameHolder = document.getElementsByClassName('chat_username')[0],
      params = getParamsFromUrl();
      username = params.username || 'noname',
      room = params.room || 'main';

function getParamsFromUrl() {
  let equations = location.search.substr(1, location.search.length - 1).split('&');
  let result = {};
  equations.forEach(e => {
    let tmp = e.split('=');
    result[tmp[0]] = tmp[1]
  });
  return result;
}

username = username.slice(0, 1).toUpperCase() + username.slice(1).toLowerCase();
usernameHolder.innerHTML = username;

room = room.slice(0, 1).toUpperCase() + room.slice(1).toLowerCase();
roomHolder.innerHTML = room;

const socket = io.connect('/' + room.toLowerCase());
console.log(socket.nsp);

btn.addEventListener('click', function() {
  socket.emit('chat', {
    message: messageHolder.value,
    user: username
  });
  messageHolder.value = '';
});

messageHolder.addEventListener('keypress', function() {
  socket.emit('typing', username);
});

socket.on('chat', function(data) {
  outputHolder.innerHTML += `<p class="text-primary">${data.user}: <span class="text-body">${data.message}</span></p>`;
});

let typingLife = 0;

socket.on('typing', function(user) {
  typingLife++;
  typingHolder.innerHTML = `<p class="text-muted">${user} is typing...</p>`;
  setTimeout(function() {
    typingLife--;
    if (!typingLife) {
      typingHolder.innerHTML = '';
    }
  }, 1000);
});
