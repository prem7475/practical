import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5006';

export default function App() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('Student');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const bottomRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(socketUrl);
    socketRef.current = socket;
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('chat:history', (history) => setMessages(history));
    socket.on('chat:message', (message) => setMessages((current) => [...current, message]));
    socket.on('chat:error', (result) => setError(result.message));
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function sendMessage(event) {
    event.preventDefault();
    if (!text.trim()) return;
    setError('');
    socketRef.current?.emit('chat:send', { text, sender: name });
    setText('');
  }

  return (
    <main className="app-shell">
      <nav className="navbar">
        <strong>Practical 8 - WebSockets</strong>
        <span></span>
      </nav>
      <div className="content">
        <h1>Chat App</h1>
        <section className="chat-card">
          <p className={connected ? "connection connected" : "connection"}>
            Status: {connected ? "Connected" : "Disconnected"}
          </p>
          <label>Name<input value={name} onChange={(event) => setName(event.target.value)} /></label>
          <h2>Messages</h2>
          <div className="message-list">
            {messages.map((message) => (
              <p className="message-card" key={message.id}><strong>{message.sender}:</strong> {message.text}</p>
            ))}
            {messages.length === 0 && <p className="muted">No messages yet.</p>}
            <div ref={bottomRef} />
          </div>
          {error && <p className="notice">{error}</p>}
          <form onSubmit={sendMessage}>
            <label>Message<input value={text} onChange={(event) => setText(event.target.value)} /></label>
            <button disabled={!connected || !text.trim()} type="submit">Send</button>
          </form>
        </section>
      </div>
    </main>
  );
}
