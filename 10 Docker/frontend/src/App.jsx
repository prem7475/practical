import { useEffect, useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5004/api';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadTasks() {
    try {
      const response = await fetch(`${apiUrl}/tasks`);
      if (!response.ok) throw new Error('Unable to load tasks. Check that the API is running.');
      setTasks(await response.json());
      setNotice('');
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadTasks(); }, []);

  async function addTask(event) {
    event.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not add task.');
      setTasks((current) => [result, ...current]);
      setTitle('');
      setNotice('');
    } catch (error) {
      setNotice(error.message || 'Could not connect to the API.');
    }
  }

  async function toggleTask(task) {
    try {
      const response = await fetch(`${apiUrl}/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not update task.');
      setTasks((current) => current.map((item) => item.id === result.id ? result : item));
      setNotice('');
    } catch (error) {
      setNotice(error.message || 'Could not connect to the API.');
    }
  }

  async function deleteTask(id) {
    try {
      const response = await fetch(`${apiUrl}/tasks/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Could not delete task.');
      setTasks((current) => current.filter((item) => item.id !== id));
      setNotice('');
    } catch (error) {
      setNotice(error.message || 'Could not connect to the API.');
    }
  }

  const doneCount = tasks.filter((task) => task.completed).length;

  return (
    <main className="app-shell">
      <nav className="navbar">
        <strong>Practical 10 - Docker</strong>
        <span></span>
      </nav>
      <div className="content">
        <h1>Task Manager</h1>
        <section className="task-card">
          <p className="count-badge">Completed: {doneCount} / {tasks.length}</p>
          <form onSubmit={addTask}>
            <label htmlFor="task-title">Task</label>
            <input id="task-title" required value={title} onChange={(event) => setTitle(event.target.value)} />
            <button type="submit">Add Task</button>
          </form>
          {notice && <p className="notice">{notice}</p>}
          {loading ? <p>Loading...</p> : tasks.length === 0 ? <p className="muted">No tasks yet.</p> : (
            <div className="table-scroll">
              <table>
                <thead><tr><th>Task</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.title}</td>
                      <td>
                        <label className="status-label">
                          <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task)} />
                          {task.completed ? "Completed" : "Pending"}
                        </label>
                      </td>
                      <td><button className="delete-button" onClick={() => deleteTask(task.id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
