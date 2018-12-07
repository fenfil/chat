const express = require('express');
const socket = require('socket.io');
const fs = require('fs');
const path = require('path');

const debugServer = require('debug')('app:server');
const debugSocket = require('debug')('app:socket');

const app = express();

const server = app.listen(3000, function() {
  debugServer('listening on 3000');
});

const io = socket(server);

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('public'));


const rooms  = [];

function backupNamespace(data) {
  fs.appendFile(path.resolve('data', `${data.room}.txt`), data.toBackup(), err => {});
}

function configureNamespace(room) {
  let data = {
    users: [],
    messages: [],
    room: room,
    toBackup: function() {
      let s = '';
      this.messages.forEach(e => {
        s += `${e.user}: ${e.message}\n`;
      });
      return s;
    }
  }
  let ids = {};
  let nsp = io.of(room);
  nsp.on('connection', function(socket) {
    debugSocket(`new socket connected to: ${nsp}`);
    
    socket.on('init new user', function(user) {
      socket.emit('init', data);
      socket.broadcast.emit('new user connected', user);
      data.users.push(user);
      ids[socket.id] = user;
    });
    
    socket.on('disconnect', function() {
      let user = ids[this.id];
      socket.broadcast.emit('user disconnected', user);
      delete ids[this.id];
      let i = data.users.indexOf(user);
      data.users.splice(i, 1);
    });
    
    socket.on('chat', function(message) {
      nsp.emit('chat', message);
      data.messages.push(message);
      backupNamespace(data);
    });
  });
}

app.get('/', (req, res) => {
  res.render('pages/login', {title: 'my app'});
});

app.get('/chat', (req, res) => {
  let room = req.query.room.toLowerCase();
  debugServer(`new connection to room: ${room}`);
  if (rooms.indexOf(room) == -1) {
    rooms.push(room);
    configureNamespace(room);
  }
  res.render('pages/chat');
});