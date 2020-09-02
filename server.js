const express = require('express');
const next = require('next');
const randomWords = require('random-words');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const http = require('http').createServer(server);
  const io = require('socket.io')(http);

  let rooms = [];
  const updateRooms = (newRooms) => {
    rooms = newRooms;
  };

  function setupIoRoom(name) {
    const room = io.of(name);
    rooms.push(name);
    let roomUsers = [];
    const updateUsers = (newUsers) => {
      roomUsers = newUsers;
    };
    room.on('connection', (socket) => {
      console.log(`a user connected to ${name}`);
      socket.on('register-user', (data) => {
        updateUsers(roomUsers.concat({ username: data, id: socket.id }));
        room.emit('update-users', roomUsers);
      });
      socket.on('roll', (data) => {
        room.emit('roll', data);
      });
      socket.on('add-die', (data) => {
        room.emit('add-die', data);
      });
      socket.on('disconnecting', (reason) => {
        updateUsers(roomUsers.filter(({ id }) => id !== socket.id));
        room.emit('update-users', roomUsers);
        if (roomUsers.length === 0) {
          updateRooms(rooms.filter((room) => room !== name));
          console.info(`removed ${name}`);
        }
      });
    });
  }

  io.on('connection', (socket) => {
    console.log('a connection attempt for ', socket.handshake.query.name);
    if (io.nsps[`/${socket.handshake.query.name}`]) {
      console.log('namespace exists');
    } else {
      console.log('creating room');
      setupIoRoom(socket.handshake.query.name);
    }
  });

  server.all('/api/new-room', (req, res) => {
    console.log('request for new room');
    const newRoom = randomWords(3).join('-');
    setupIoRoom(newRoom);
    res.status(201);
    res.json({ name: newRoom });
  });

  server.all('/api/active-rooms', (req, res) => {
    res.status(200);
    res.json({ count: rooms.length });
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  http.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
