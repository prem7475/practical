const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { createApp } = require('./server');

test('task API supports create, complete, list, and delete', async () => {
  const app = createApp();
  const created = await request(app).post('/api/tasks').send({ title: 'Build the app' });
  assert.equal(created.status, 201);
  assert.equal(created.body.completed, false);

  const completed = await request(app).patch(`/api/tasks/${created.body.id}`).send({ completed: true });
  assert.equal(completed.status, 200);
  assert.equal(completed.body.completed, true);
  assert.equal((await request(app).get('/api/tasks')).body.length, 1);
  assert.equal((await request(app).delete(`/api/tasks/${created.body.id}`)).status, 204);
  assert.equal((await request(app).get(`/api/tasks/${created.body.id}`)).status, 404);
});

test('task API validates task titles and completion values', async () => {
  const app = createApp();
  assert.equal((await request(app).post('/api/tasks').send({ title: '  ' })).status, 400);
  assert.equal((await request(app).post('/api/tasks')).status, 400);
  await request(app).post('/api/tasks').send({ title: 'Valid task' });
  assert.equal((await request(app).patch('/api/tasks/1').send({ completed: 'yes' })).status, 400);
});
