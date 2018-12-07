const outputHolder = document.getElementsByClassName('chat_messages')[0],
      typingHolder = document.getElementsByClassName('chat_istyping')[0],
      messageHolder = document.getElementById('message-input'),
      roomHolder = document.getElementById('roomname'),
      usersOnlineHolder = document.getElementsByClassName('chat_users-online')[0],
      btn = document.getElementById('message-send'),
      usernameHolder = document.getElementsByClassName('chat_username')[0],
      params = getParamsFromUrl();
      username = params.username || 'noname',
      room = params.room || 'main';

let users = [];

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

users.push(username);

room = room.toLowerCase();
roomHolder.innerHTML = room;

function updateUsers() {
  let s = '';
  users.forEach(e => {
    s += `<p>${e}</p>`;
  });
  usersOnlineHolder.innerHTML = s;
}

updateUsers();

messageHolder.addEventListener('keypress', e => {
  if (e.key == 'Enter') {
    btn.click();
  }
});

//   = Sockets =

const socket = io.connect('/' + room);

socket.emit('init new user', username);

btn.addEventListener('click', function() {
  socket.emit('chat', {
    message: messageHolder.value,
    user: username
  });
  messageHolder.value = '';
});

socket.on('init', (data) => {
  users = users.concat(data.users);
  data.messages.forEach(e => {
    outputHolder.innerHTML += `<p class="text-primary">${e.user}: <span class="text-body">${e.message}</span></p>`;
  });
  updateUsers();
});

socket.on('new user connected', (user) => {
  users.push(user);
  updateUsers();
});

socket.on('user disconnected', (user) => {
  let i;
  if (i = users.indexOf(user)) {
    users.splice(i, 1);
  }
  updateUsers();
});

socket.on('chat', function(data) {
  outputHolder.innerHTML += `<p class="text-primary">${data.user}: <span class="text-body">${data.message}</span></p>`;
});