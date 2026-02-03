'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { setToken } from '@/lib/auth';

export default function Login() {
  const [formData, setFormData] = useState({
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
      const res = await api.auth.login(formData);
      const data = await res.json();
      
      if (res.ok) {
        setToken(data.token);
        if (data.user && data.user.role) {
          localStorage.setItem('userRole', data.user.role);
        }
        router.push('/dashboard');
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (error) {
      setMessage('Network error');
    }
    
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto' }}>
      <h1>Login</h1>
      
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
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: 20 }}>
        Don't have account? <a href="/register" style={{ color: '#0070f3' }}>Register</a>
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
