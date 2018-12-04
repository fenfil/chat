const express = require('express');
const socket = require('socket.io');
const app = express();

const server = app.listen(3000, function() {
  console.log('listening on 3000');
});

app.use(express.static('public'));

const io = socket(server);

const namespaces = [
  {
    namespace: 'main',
    io: io
  }
];

function configureNamespace(io) {
  io.on('connection', function(socket) {
    socket.on('chat', function(data) {
      io.emit('chat', data);
    });
    socket.on('typing', function(user) {
      socket.broadcast.emit('typing', user);
    });
  });
}

function controlNamespace(room) {
  let f = false;
  for (let i = 0; i < namespaces.length; i++) {
    if (namespaces[i].namespace == room) {
      f = true;
    }
  }
  if (!f) {
    namespaces.push({
      namespace: room,
      io: io.of(room)
    });
    configureNamespace(namespaces[namespaces.length - 1].io);
  }
}

configureNamespace(io);

app.get('/', (req, res) => {
  res.sendFile('./public/index.html');
});

app.get('/chat', (req, res) => {
  controlNamespace(req.query.room.toLowerCase());
  res.sendFile(__dirname + '/public/chat.html');
});