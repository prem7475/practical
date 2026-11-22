import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/students";
const emptyForm = { name: "Student", rollNumber: "", course: "", age: "" };

async function request(path = "", options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");

  async function loadStudents() {
    try {
      setStudents(await request());
      setMessage("");
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => { loadStudents(); }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const student = await request(editingId ? `/${editingId}` : "", {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(form)
      });
      setStudents((current) => editingId
        ? current.map((item) => item._id === student._id ? student : item)
        : [student, ...current]);
      setForm(emptyForm);
      setEditingId("");
      setMessage(editingId ? "Student updated." : "Student added.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  function editStudent(student) {
    setForm({ name: student.name, rollNumber: student.rollNumber, course: student.course, age: student.age });
    setEditingId(student._id);
  }

  async function deleteStudent(id) {
    try {
      await request(`/${id}`, { method: "DELETE" });
      setStudents((current) => current.filter((student) => student._id !== id));
      setMessage("Student deleted.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="app-shell">
      <nav className="navbar">
        <strong>Practical 4 - MongoDB</strong>
        <span></span>
      </nav>
      <div className="content">
        <h1>Student Management</h1>
        <form className="form-card" onSubmit={handleSubmit}>
          <label>Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label>Roll Number<input required value={form.rollNumber} onChange={(e) => setForm({ ...form, rollNumber: e.target.value })} /></label>
          <label>Class / Course<input required value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} /></label>
          <label>Age<input required type="number" min="5" max="100" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} /></label>
          <button type="submit">{editingId ? "Save Changes" : "Add Student"}</button>
        </form>
        {message && <p className="notice">{message}</p>}
        <section className="list-card">
          <h2>Student List</h2>
          {students.length === 0 ? <p>No students.</p> : (
            <div className="table-scroll">
              <table className="student-table">
                <thead>
                  <tr><th>Name</th><th>Roll Number</th><th>Class / Course</th><th>Age</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td>{student.name}</td><td>{student.rollNumber}</td><td>{student.course}</td><td>{student.age}</td>
                      <td>
                        <button onClick={() => editStudent(student)}>Edit</button>{" "}
                        <button className="delete-button" onClick={() => deleteStudent(student._id)}>Delete</button>
                      </td>
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
