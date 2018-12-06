const express = require('express');
const socket = require('socket.io');

const debugServer = require('debug')('app:server');
const debugSocket = require('debug')('app:socket');

const app = express();

const server = app.listen(3000, function() {
  debugServer('listening on 3000');
});

const io = socket(server);

app.set('view engine', 'pug');
app.set('views', './views');

app.use(require('morgan')('tiny'));
app.use(express.static('public'));


const namespaces = [];

function configureNamespace(io) {
  io.on('connection', function(socket) {
    debugSocket(`new socket connected`);
    socket.on('chat', function(data) {
      io.emit('chat', data);
    });
    socket.on('typing', function(user) {
      debugSocket(`${user} is typing`);
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

app.get('/', (req, res) => {
  debugServer('home getted');
  res.render('pages/login', {title: 'my app', hallo: 'halloation'});
});

app.get('/chat', (req, res) => {
  let room = req.query.room.toLowerCase();
  debugServer(`new connection to room: ${room}`);
  controlNamespace(room);
  res.render('pages/chat');
});