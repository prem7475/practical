const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { createApp } = require('./server');

test('Todo API supports a validated create, read, update, and delete flow', async () => {
  const app = createApp();
  const created = await request(app).post('/api/todos').send({ title: '  Learn Postman  ' });
  assert.equal(created.status, 201);
  assert.deepEqual(created.body, { id: 1, title: 'Learn Postman', completed: false });

  const listed = await request(app).get('/api/todos');
  assert.equal(listed.status, 200);
  assert.equal(listed.body.length, 1);

  const updated = await request(app).put('/api/todos/1')
    .send({ title: 'Test the API', completed: true });
  assert.equal(updated.status, 200);
  assert.equal(updated.body.completed, true);

  assert.equal((await request(app).delete('/api/todos/1')).status, 204);
  assert.equal((await request(app).get('/api/todos/1')).status, 404);
});

test('Todo API rejects blank titles and incomplete updates', async () => {
  const app = createApp();
  assert.equal((await request(app).post('/api/todos').send({ title: '  ' })).status, 400);
  assert.equal((await request(app).post('/api/todos')).status, 400);
  await request(app).post('/api/todos').send({ title: 'Valid title' });
  assert.equal((await request(app).put('/api/todos/1').send({ title: '' })).status, 400);
  assert.equal((await request(app).put('/api/todos/1')).status, 400);
  assert.equal((await request(app).get('/api/todos/999')).status, 404);
});
