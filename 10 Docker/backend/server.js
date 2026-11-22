const express = require('express');
const cors = require('cors');

function createApp() {
  const app = express();
  const tasks = [];
  let nextId = 1;
  app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5180' }));
  app.use(express.json());

  app.get('/api/health', (request, response) => response.json({ status: 'ok' }));

  app.get('/api/tasks', (request, response) => response.json(tasks));

  app.post('/api/tasks', (request, response) => {
    const body = request.body || {};
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    if (!title || title.length > 120) {
      return response.status(400).json({ error: 'Task title must contain 1 to 120 characters.' });
    }
    const task = { id: nextId++, title, completed: false };
    tasks.unshift(task);
    response.status(201).json(task);
  });

  app.patch('/api/tasks/:id', (request, response) => {
    const task = tasks.find((item) => item.id === Number(request.params.id));
    if (!task) return response.status(404).json({ error: 'Task not found' });
    const body = request.body || {};
    if (typeof body.completed !== 'boolean') {
      return response.status(400).json({ error: 'completed must be a boolean' });
    }
    task.completed = body.completed;
    response.json(task);
  });

  app.delete('/api/tasks/:id', (request, response) => {
    const index = tasks.findIndex((item) => item.id === Number(request.params.id));
    if (index === -1) return response.status(404).json({ error: 'Task not found' });
    tasks.splice(index, 1);
    response.status(204).end();
  });

  return app;
}

if (require.main === module) {
  const port = process.env.PORT || 5004;
  createApp().listen(port, '0.0.0.0', () => console.log(`Task API listening on port ${port}`));
}

module.exports = { createApp };
