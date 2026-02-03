'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { isLoggedIn } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn()) {
      router.push('/dashboard');
    }
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '100px auto', textAlign: 'center' }}>
      <h1>Task Management App</h1>
      <p style={{ color: '#666', fontSize: 16, marginBottom: 40 }}>
        Organize your tasks with user and admin roles
      </p>
      
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button 
          onClick={() => router.push('/register')}
          style={buttonStyle}
        >
          Register as User
        </button>
        <button 
          onClick={() => router.push('/admin-register')}
          style={{...buttonStyle, background: '#f39'}}
        >
          Register as Admin
        </button>
        <button 
          onClick={() => router.push('/login')}
          style={{...buttonStyle, background: '#666'}}
        >
          Login
        </button>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: '12px 24px',
  fontSize: 16,
  background: '#0070f3',
  color: 'white',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer'
};
