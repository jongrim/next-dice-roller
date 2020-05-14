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

  function setupIoRoom(name) {
    const room = io.of(name);
    room.on('connection', (socket) => {
      console.log(`a user connected to ${name}`);
      socket.on('other-person-roll', (data) => {
        room.emit('other-person-roll', data);
      });
    });
  }

  server.all('/api/new-room', (req, res) => {
    console.log('request for new room');
    const newRoom = randomWords(3).join('-');
    setupIoRoom(newRoom);
    res.status(201);
    res.json({ name: newRoom });
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  http.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
