'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getToken, clearToken } from '@/lib/auth';

export default function Admin() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.tasks.list();
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
    setLoading(false);
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    
    try {
      const res = await api.tasks.delete(id);
      if (res.ok) {
        setTasks(tasks.filter(t => t._id !== id));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleLogout = () => {
    clearToken();
    router.push('/login');
  };

  if (loading) return <div style={{ marginTop: 50, textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 1000, margin: '20px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <h1>Admin Panel</h1>
        <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
      </div>

      <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 6, marginBottom: 30 }}>
        <h2>System Overview</h2>
        <p>Total Tasks: {tasks.length}</p>
        <p>Users: {users.length || 'N/A'}</p>
      </div>

      <div>
        <h2>All Tasks</h2>
        {tasks.length === 0 ? (
          <p style={{ color: '#999' }}>No tasks found</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr style={{ background: '#f0f0f0' }}>
                  <th style={thStyle}>Title</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Created By</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task._id} style={trStyle}>
                    <td style={tdStyle}>{task.title}</td>
                    <td style={tdStyle}>{task.status}</td>
                    <td style={tdStyle}>{task.user?.name || 'Unknown'}</td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        style={deleteButtonStyle}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const logoutButtonStyle = {
  padding: 10,
  background: '#f33',
  color: 'white',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer'
};

const deleteButtonStyle = {
  padding: 8,
  background: '#f33',
  color: 'white',
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
  fontSize: 14
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  border: '1px solid #ddd'
};

const thStyle = {
  padding: 12,
  textAlign: 'left',
  borderBottom: '2px solid #ddd'
};

const tdStyle = {
  padding: 12,
  borderBottom: '1px solid #ddd'
};

const trStyle = {
  '&:hover': {
    background: '#f9f9f9'
  }
};
