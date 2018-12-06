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

username = username.toLowerCase();
usernameHolder.innerHTML = username;

room = room.toLowerCase();
roomHolder.innerHTML = room;

const socket = io.connect('/' + room);

socket.emit('init', username);

socket.on('init', (data) => {
  data.messages.forEach(e => {
    outputHolder.innerHTML += `<p class="text-primary">${e.user}: <span class="text-body">${e.message}</span></p>`;
  });
});

btn.addEventListener('click', function() {
  socket.emit('chat', {
    message: messageHolder.value,
    user: username
  });
  messageHolder.value = '';
});

socket.on('chat', function(data) {
  outputHolder.innerHTML += `<p class="text-primary">${data.user}: <span class="text-body">${data.message}</span></p>`;
});