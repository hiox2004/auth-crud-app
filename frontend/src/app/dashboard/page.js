'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getToken, clearToken } from '@/lib/auth';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState('user');
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'pending', assignedUserId: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) {
      router.push('/login');
      return;
    }
    
    const role = localStorage.getItem('userRole');
    if (role) setUserRole(role);
    
    fetchTasks();
    if (role === 'admin') {
      fetchUsers();
    }
  }, []);

  const fetchTasks = async () => {
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

  const fetchUsers = async () => {
    try {
      const res = await api.auth.getUsers();
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const taskData = {
        title: newTask.title,
        description: newTask.description,
        status: newTask.status
      };
      
      if (userRole === 'admin' && newTask.assignedUserId) {
        taskData.assignedUserId = newTask.assignedUserId;
      }
      
      const res = await api.tasks.create(taskData);
      if (res.ok) {
        const data = await res.json();
        setTasks([...tasks, data]);
        setNewTask({ title: '', description: '', status: 'pending', assignedUserId: '' });
        setMessage('Task created!');
        setTimeout(() => setMessage(''), 2000);
      }
    } catch (error) {
      setMessage('Error creating task');
    }
  };

  const handleUpdateTask = async (id, status) => {
    try {
      const res = await api.tasks.update(id, { status });
      if (res.ok) {
        setTasks(tasks.map(t => t._id === id ? { ...t, status } : t));
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
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
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  if (loading) return <div style={{ marginTop: 50, textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 800, margin: '20px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <div>
          <h1>My Tasks {userRole === 'admin' && <span style={{ fontSize: 18, color: '#f39' }}>(Admin)</span>}</h1>
        </div>
        <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
      </div>

      {message && (
        <div style={{ 
          padding: 12, 
          marginBottom: 20, 
          background: '#efe',
          borderRadius: 4,
          color: '#080'
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleAddTask} style={{ marginBottom: 30, padding: 16, background: '#f9f9f9', borderRadius: 6 }}>
        <div style={{ marginBottom: 12 }}>
          <input
            type="text"
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            style={inputStyle}
            required
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <textarea
            placeholder="Description "
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            style={{...inputStyle, minHeight: 80 }}
          />
        </div>
        
        {userRole === 'admin' && (
          <div style={{ marginBottom: 12 }}>
            <select
              value={newTask.assignedUserId}
              onChange={(e) => setNewTask({ ...newTask, assignedUserId: e.target.value })}
              style={inputStyle}
            >
              <option value="">Assign to</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
        )}
        
        <button type="submit" style={buttonStyle}>Add Task</button>
      </form>

      <div>
        {tasks.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center' }}>No tasks yet. Create one to get started!</p>
        ) : (
          tasks.map(task => (
            <div key={task._id} style={taskCardStyle}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 8px 0' }}>{task.title}</h3>
                {task.description && <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: 14 }}>{task.description}</p>}
                {task.user && <p style={{ margin: '0 0 4px 0', color: '#999', fontSize: 12 }}>Created by: {task.user.name} ({task.user.email})</p>}
                <p style={{ margin: '0', color: '#999', fontSize: 12 }}>Created: {new Date(task.createdAt).toLocaleDateString()}</p>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <select
                  value={task.status}
                  onChange={(e) => handleUpdateTask(task._id, e.target.value)}
                  style={{ padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
                {userRole === 'admin' && (
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    style={deleteButtonStyle}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: 12,
  border: '1px solid #ddd',
  borderRadius: 6,
  fontSize: 16,
  boxSizing: 'border-box'
};

const buttonStyle = {
  padding: 12,
  background: '#0070f3',
  color: 'white',
  border: 'none',
  borderRadius: 6,
  fontSize: 16,
  cursor: 'pointer',
  width: '100%'
};

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
  cursor: 'pointer'
};

const taskCardStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 16,
  border: '1px solid #ddd',
  borderRadius: 6,
  marginBottom: 12
};
