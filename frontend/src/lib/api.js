const API_BASE = 'http://localhost:5000/api/v1';

export const api = {
  auth: {
    register: (data) => fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    login: (data) => fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    getUsers: () => fetch(`${API_BASE}/auth/users`, {
      headers: getAuthHeader()
    })
  },
  tasks: {
    list: () => fetch(`${API_BASE}/tasks`, {
      headers: getAuthHeader()
    }),
    create: (data) => fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    }),
    update: (id, data) => fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    }),
    delete: (id) => fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    })
  }
};

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}
