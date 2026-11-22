const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { createApp } = require('./server');

test('feedback API accepts valid feedback and returns it in the list', async () => {
  const app = createApp();
  const response = await request(app).post('/api/feedback')
    .send({ name: 'Student', message: 'Easy to use', rating: 5 });
  assert.equal(response.status, 201);
  assert.equal(response.body.name, 'Student');
  assert.equal(response.body.rating, 5);

  const list = await request(app).get('/api/feedback');
  assert.equal(list.status, 200);
  assert.equal(list.body[0].message, 'Easy to use');
});

test('feedback API rejects missing messages and ratings outside 1 through 5', async () => {
  const app = createApp();
  assert.equal((await request(app).post('/api/feedback').send({ message: ' ', rating: 4 })).status, 400);
  assert.equal((await request(app).post('/api/feedback')).status, 400);
  assert.equal((await request(app).post('/api/feedback').send({ message: 'Hello', rating: 6 })).status, 400);
});

test('feedback API defaults an empty name to the configured student', async () => {
  const response = await request(createApp()).post('/api/feedback')
    .send({ name: ' ', message: 'A short comment', rating: 5 });
  assert.equal(response.status, 201);
  assert.equal(response.body.name, 'Student');
});
