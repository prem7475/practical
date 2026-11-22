import { useState } from "react";

export default function App() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-800">
      <nav className="flex flex-wrap items-center gap-4 rounded-lg bg-blue-100 p-4 text-blue-900 shadow-sm">
        <span className="font-bold">Practical 1 - Tailwind</span>
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#contact">Details</a>
        <span className="ml-auto"></span>
      </nav>

      <div className="mx-auto max-w-4xl">
        <h1 className="my-6 text-3xl font-bold text-blue-900">Student Profile</h1>

        <section id="home" className="flex flex-wrap items-center gap-5 rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
          <img
            className="rounded-lg border border-blue-100"
            src="https://placehold.co/150x180"
            alt="Student"
            width="150"
            height="180"
          />
          <div>
            <h2 className="mb-3 text-xl font-semibold text-blue-800">Student</h2>
            
            
            <button
              className="mt-3 rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-800"
              onClick={() => setShowInfo(!showInfo)}
            >
              {showInfo ? "Hide Info" : "Show Info"}
            </button>
            {showInfo && <p className="mt-3 text-blue-800">Student profile for Student.</p>}
          </div>
        </section>

        <section id="about" className="my-5 rounded-lg border border-blue-100 bg-white p-5">
          <h2 className="text-xl font-semibold text-blue-800">About</h2>
          <p>A simple student profile made with Tailwind CSS.</p>
        </section>

        <section id="contact" className="rounded-lg border border-blue-100 bg-white p-5">


        </section>
      </div>
    </main>
  );
}
