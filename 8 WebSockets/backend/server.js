const http = require('node:http');
const express = require('express');
const { Server } = require('socket.io');

function createServer() {
  const app = express();
  app.get('/api/health', (request, response) => response.json({ status: 'ok' }));

  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_ORIGIN || 'http://localhost:5178' }
  });
  const messages = [];
  let nextId = 1;

  io.on('connection', (socket) => {
    socket.emit('chat:history', messages);
    socket.on('chat:send', (payload) => {
      const text = typeof payload?.text === 'string' ? payload.text.trim() : '';
      if (!text || text.length > 500) {
        socket.emit('chat:error', { message: 'Message must be between 1 and 500 characters.' });
        return;
      }

      const message = {
        id: nextId++,
        text,
        sender: typeof payload.sender === 'string' && payload.sender.trim()
          ? payload.sender.trim().slice(0, 30)
          : 'Student',
        sentAt: new Date().toISOString()
      };
      messages.push(message);
      io.emit('chat:message', message);
    });
  });

  return { app, httpServer, io };
}

if (require.main === module) {
  const port = process.env.PORT || 5006;
  const { httpServer } = createServer();
  httpServer.listen(port, () => console.log(`Chat server listening on http://localhost:${port}`));
}

module.exports = { createServer };
