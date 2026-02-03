'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { setToken } from '@/lib/auth';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
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
      const res = await api.auth.register(formData);
      const data = await res.json();
      
      if (res.ok) {
        setToken(data.token);
        localStorage.setItem('userRole', 'user');
        router.push('/dashboard');
      } else {
        setMessage(data.message || 'Registration failed');
      }
    } catch (error) {
      setMessage('Network error');
    }
    
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto' }}>
      <h1>Register</h1>
      
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
        
        <div style={{ marginBottom: 20 }}>
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
        
        <button 
          type="submit" 
          disabled={loading}
          style={buttonStyle}
        >
          {loading ? 'Creating...' : 'Register'}
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: 20 }}>
        Already have account? <a href="/login" style={{ color: '#0070f3' }}>Login</a>
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
  boxSizing: 'border-box'
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
