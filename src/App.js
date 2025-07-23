import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [sender, setSender] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

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

  const deleteMessage = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/messages/${id}`);
      fetchMessages();
    } catch (err) {
      console.error('Delete error:', err.response?.data || err.message);
    }
  };

  const startEdit = (msg) => {
    setEditingId(msg.id);
    setEditText(msg.message);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const updateMessage = async (id) => {
    if (!editText.trim()) return;
    try {
      const res = await axios.put(`http://localhost:5000/api/messages/${id}`, {
        message: editText,
      });
      console.log('Update success:', res.data);
      setEditingId(null);
      setEditText('');
      fetchMessages();
    } catch (err) {
      console.error('Update failed:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    const storedSender = localStorage.getItem('sender');
    if (storedSender) setSender(storedSender);
    fetchMessages();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>💬 Chat</h1>

      <div style={styles.form}>
        <input
          placeholder="Your name"
          value={sender}
          onChange={(e) => {
            setSender(e.target.value);
            localStorage.setItem('sender', e.target.value);
          }}
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
            <strong>{msg.sender}:</strong>{' '}
            {editingId === msg.id ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  autoFocus
                  style={{ padding: '4px', margin: '5px 0', width: '100%' }}
                />
                <div style={{ marginTop: '5px' }}>
                  <button onClick={() => updateMessage(msg.id)} style={styles.updateBtn}>Update</button>
                  <button onClick={cancelEdit} style={styles.cancelBtn}>Cancel</button>
                </div>
              </>
            ) : (
              <span>{msg.message}</span>
            )}

            {msg.sender === sender && editingId !== msg.id && (
              <div style={{ marginTop: '5px' }}>
                <button onClick={() => startEdit(msg)} style={styles.editBtn}>Edit</button>
                <button onClick={() => deleteMessage(msg.id)} style={styles.deleteBtn}>Delete</button>
              </div>
            )}
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
  },
  editBtn: {
    backgroundColor: '#ffc107',
    color: '#000',
    border: 'none',
    padding: '5px 10px',
    marginRight: '5px',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  updateBtn: {
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    marginRight: '5px',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  cancelBtn: {
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};

export default App;
