import { useEffect, useState } from "react";
import { useCounter } from "./hooks/useCounter.js";
import { useTheme } from "./context/ThemeContext.jsx";

export default function App() {
  const [name, setName] = useState("Student");
  const counter = useCounter();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    document.title = `Hooks Lab | Count: ${counter.count}`;
  }, [counter.count]);

  return (
    <main className="page-shell" style={{ background: isDark ? "#f0f4f8" : "#f7f9fc", color: "#243247", minHeight: "100vh" }}>
      <nav className="navbar">
        <strong>Practical 2 - React Hooks</strong>
        <span></span>
      </nav>
      <div className="content">
        <h1>React Hooks Practical</h1>
        <section className="panel">
          <h2>Counter</h2>
          <p className="counter-value">Count: {counter.count}</p>
          <div className="button-row">
            <button onClick={counter.increment}>Increase</button>
            <button onClick={counter.decrement}>Decrease</button>
            <button className="secondary-button" onClick={counter.reset}>Reset</button>
          </div>
        </section>
        <section className="panel">
          <h2>Greeting</h2>
          <label>
            Name
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <p>Hello, {name || "Student"}!</p>
        </section>
        <button className="secondary-button" onClick={toggleTheme}>Change Theme</button>
      </div>
    </main>
  );
}
