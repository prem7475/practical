const test = require('node:test');
const assert = require('node:assert/strict');
const { io: connect } = require('socket.io-client');
const { createServer } = require('./server');

test('Socket.IO broadcasts validated chat messages to connected clients', async () => {
  const { httpServer, io } = createServer();
  await new Promise((resolve) => httpServer.listen(0, resolve));
  const address = httpServer.address();
  const url = `http://127.0.0.1:${address.port}`;
  const sender = connect(url, { transports: ['websocket'] });
  const receiver = connect(url, { transports: ['websocket'] });

  try {
    await Promise.all([sender, receiver].map((client) => new Promise((resolve, reject) => {
      client.once('connect', resolve);
      client.once('connect_error', reject);
    })));
    const received = new Promise((resolve) => receiver.once('chat:message', resolve));
    sender.emit('chat:send', { text: '  Hello from a test  ', sender: 'Student' });
    const message = await received;
    assert.equal(message.text, 'Hello from a test');
    assert.equal(message.sender, 'Student');

    const defaultSenderMessage = new Promise((resolve) => receiver.once('chat:message', resolve));
    sender.emit('chat:send', { text: 'Hello with default sender', sender: ' ' });
    const messageWithDefaultSender = await defaultSenderMessage;
    assert.equal(messageWithDefaultSender.sender, 'Student');
  } finally {
    sender.close();
    receiver.close();
    await new Promise((resolve) => io.close(resolve));
  }
});
