import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [sender, setSender] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/messages');
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!sender.trim() || !message.trim()) return;
    try {
      await axios.post('http://localhost:5000/api/messages', { sender, message });
      setMessage('');
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>💬 Chat</h1>

      <div style={styles.form}>
        <input
          placeholder="Your name"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          style={styles.input}
        />
        <textarea
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={styles.textarea}
        />
        <button onClick={sendMessage} style={styles.button}>Send</button>
      </div>

      <div style={styles.messagesContainer}>
        <h2 style={styles.subtitle}>Messages</h2>
        {messages.map((msg) => (
          <div key={msg.id} style={styles.messageCard}>
            <strong>{msg.sender}:</strong> <span>{msg.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '20px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  title: {
    textAlign: 'center',
    color: '#333'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px'
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc'
  },
  textarea: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    resize: 'none',
    minHeight: '60px'
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out'
  },
  messagesContainer: {
    marginTop: '20px'
  },
  subtitle: {
    color: '#444',
    borderBottom: '1px solid #ccc',
    paddingBottom: '5px',
    marginBottom: '10px'
  },
  messageCard: {
    backgroundColor: '#ffffff',
    padding: '10px 15px',
    borderRadius: '8px',
    marginBottom: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
  }
};

export default App;
