const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });

function createApp() {
  const app = express();
  const feedback = [];
  let nextId = 1;
  app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5179' }));
  app.use(express.json());

  app.get('/api/feedback', (request, response) => {
    response.json(feedback);
  });

  app.post('/api/feedback', (request, response) => {
    const body = request.body || {};
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const name = typeof body.name === 'string' && body.name.trim()
      ? body.name.trim().slice(0, 60)
      : 'Student';
    const rating = Number(body.rating);
    if (!message || message.length > 500) {
      return response.status(400).json({ error: 'Message must contain 1 to 500 characters.' });
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return response.status(400).json({ error: 'Rating must be a whole number from 1 to 5.' });
    }

    const entry = { id: nextId++, name, message, rating, createdAt: new Date().toISOString() };
    feedback.unshift(entry);
    response.status(201).json(entry);
  });

  return app;
}

if (require.main === module) {
  const port = process.env.PORT || 5003;
  createApp().listen(port, () => console.log(`Feedback API running at http://localhost:${port}`));
}

module.exports = { createApp };
