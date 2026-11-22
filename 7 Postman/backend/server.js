const express = require('express');

function createApp() {
  const app = express();
  let nextId = 1;
  const todos = [];

  app.use(express.json());

  app.get('/', (request, response) => {
    response.type('html').send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Practical 7 - Postman</title>
    <style>
      body { margin: 0; font-family: Arial, sans-serif; background: #f4f7fb; color: #243247; }
      nav { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; padding: 14px 20px; background: #dceaf7; color: #214f78; }
      main { max-width: 760px; margin: 24px auto; padding: 0 18px; }
      section { padding: 18px; border: 1px solid #cbd9e6; border-radius: 8px; background: white; }
      h1, h2 { color: #315f85; }
      a { display: inline-block; padding: 8px 12px; border-radius: 5px; background: #315f85; color: white; text-decoration: none; }
    </style>
  </head>
  <body>
    <nav><strong>Practical 7 - Postman</strong><span></span></nav>
    <main>
      <section>
        <h1>Todo API</h1>
        <p>Use the Postman collection to test the Todo API requests.</p>
        <h2>Todo endpoint</h2>
        <p>View the current todo collection:</p>
        <a href="/api/todos">Open todos</a>
      </section>
    </main>
  </body>
</html>`);
  });

  app.get('/api/todos', (request, response) => {
    response.json(todos);
  });

  app.get('/api/todos/:id', (request, response) => {
    const todo = todos.find((item) => item.id === Number(request.params.id));
    if (!todo) return response.status(404).json({ error: 'Todo not found' });
    response.json(todo);
  });

  app.post('/api/todos', (request, response) => {
    const body = request.body || {};
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    if (!title) return response.status(400).json({ error: 'A non-empty title is required' });

    const todo = { id: nextId++, title, completed: false };
    todos.push(todo);
    response.status(201).json(todo);
  });

  app.put('/api/todos/:id', (request, response) => {
    const todo = todos.find((item) => item.id === Number(request.params.id));
    if (!todo) return response.status(404).json({ error: 'Todo not found' });

    const body = request.body || {};
    if (typeof body.title !== 'string' || !body.title.trim()) {
      return response.status(400).json({ error: 'A non-empty title is required' });
    }
    if (typeof body.completed !== 'boolean') {
      return response.status(400).json({ error: 'completed must be a boolean' });
    }

    todo.title = body.title.trim();
    todo.completed = body.completed;
    response.json(todo);
  });

  app.delete('/api/todos/:id', (request, response) => {
    const index = todos.findIndex((item) => item.id === Number(request.params.id));
    if (index === -1) return response.status(404).json({ error: 'Todo not found' });
    todos.splice(index, 1);
    response.status(204).end();
  });

  return app;
}

if (require.main === module) {
  const port = process.env.PORT || 5005;
  createApp().listen(port, () => console.log(`Todo API running at http://localhost:${port}`));
}

module.exports = { createApp };
