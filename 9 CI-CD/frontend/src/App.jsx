import { useEffect, useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';

export default function App() {
  const [feedback, setFeedback] = useState([]);
  const [form, setForm] = useState({ name: 'Student', rating: '5', message: '' });
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadFeedback() {
    try {
      const response = await fetch(`${apiUrl}/feedback`);
      if (!response.ok) throw new Error('Could not load feedback.');
      setFeedback(await response.json());
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadFeedback(); }, []);

  async function submit(event) {
    event.preventDefault();
    setNotice('');
    try {
      const response = await fetch(`${apiUrl}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, rating: Number(form.rating) })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Submission failed.');
      setFeedback((current) => [result, ...current]);
      setForm({ name: 'Student', rating: '5', message: '' });
      setNotice('Thanks! Your feedback was saved.');
    } catch (error) {
      setNotice(error.message);
    }
  }

  return (
    <main className="app-shell">
      <nav className="navbar">
        <strong>Practical 9 - CI-CD</strong>
        <span></span>
      </nav>
      <div className="content">
        <h1>Feedback Form</h1>
        <form className="form-card" onSubmit={submit}>
          <label>Name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
          <label>Rating
            <select value={form.rating} onChange={(event) => setForm({ ...form, rating: event.target.value })}>
              {[5, 4, 3, 2, 1].map((value) => <option value={value} key={value}>{value}</option>)}
            </select>
          </label>
          <label>Feedback<textarea required value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} /></label>
          <button type="submit">Submit Feedback</button>
        </form>
        {notice && <p className="notice">{notice}</p>}
        <section className="entries-card">
          <h2>Feedback Entries</h2>
          {loading ? <p>Loading...</p> : feedback.length === 0 ? <p className="muted">No feedback yet.</p> : feedback.map((item) => (
            <article className="feedback-card" key={item.id}><b>{item.name || "Student"}:</b> {item.message}</article>
          ))}
        </section>
      </div>
    </main>
  );
}
