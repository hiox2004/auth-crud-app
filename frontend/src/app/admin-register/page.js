'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { setToken } from '@/lib/auth';

export default function AdminRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    adminSecret: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/v1/auth/register-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        setToken(data.token);
        localStorage.setItem('userRole', 'admin');
        router.push('/dashboard');
      } else {
        setMessage(data.message || 'Admin registration failed');
      }
    } catch (error) {
      setMessage('Network error');
    }
    
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto' }}>
      <h1>Admin Registration</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 20 }}>
        Enter the admin secret key to create an admin account
      </p>
      
      {message && (
        <div style={{ 
          padding: 12, 
          marginBottom: 20, 
          background: message.includes('failed') ? '#fee' : '#efe',
          borderRadius: 4 
        }}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <input
            name="adminSecret"
            type="password"
            placeholder="Admin Secret"
            value={formData.adminSecret}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={buttonStyle}
        >
          {loading ? 'Creating...' : 'Create Admin'}
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: 20 }}>
        Not an admin? <a href="/register" style={{ color: '#0070f3' }}>Register as user</a>
      </p>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: 12,
  border: '1px solid #ddd',
  borderRadius: 6,
  fontSize: 16,
  boxSizing: 'border-box',
  marginBottom: 0
};

const buttonStyle = {
  width: '100%',
  padding: 12,
  background: '#0070f3',
  color: 'white',
  border: 'none',
  borderRadius: 6,
  fontSize: 16,
  cursor: 'pointer'
};
