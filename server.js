const express = require('express');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const http = require('http').createServer(server);
  const io = require('socket.io')(http);

  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('other-person-roll', (data) => {
      io.emit('other-person-roll', data);
    });
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  http.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
