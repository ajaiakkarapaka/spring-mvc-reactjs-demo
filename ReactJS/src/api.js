// API utility for HTTP Basic Auth requests to Spring Boot backend
export function getAuthHeader(username, password) {
  return 'Basic ' + window.btoa(username + ':' + password);
}

export async function fetchUsers(auth) {
  const res = await fetch('http://localhost:8080/api/users', {
    method: 'GET',
    headers: { 
      'Authorization': auth,
      'Content-Type': 'application/json'
    },
    mode: 'cors'
  });  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Username and password do not match');
    }
    throw new Error('Failed to fetch users');
  }
  return res.json();
}

export async function createUser(formData, auth) {  const res = await fetch('http://localhost:8080/api/users', {
    method: 'POST',
    headers: {
      'Authorization': auth
    },
    body: formData
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }
  return res.json();
}

export async function updateUser(id, formData, auth) {
  const res = await fetch(`http://localhost:8080/api/users/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': auth
    },
    body: formData
  });  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }
  return res.json();
}

export async function deleteUser(id, auth) {
  const res = await fetch(`http://localhost:8080/api/users/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': auth }
  });
  if (!res.ok) throw new Error('Failed to delete user');
}

export async function fetchCurrentUser(auth) {
  console.log('Sending auth header:', auth); // Debug log
  const res = await fetch('http://localhost:8080/api/users/me', {
    method: 'GET',
    headers: { 
      'Authorization': auth,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  if (!res.ok) {
    console.error('Auth failed with status:', res.status); // Debug log
    throw new Error(`Failed to fetch user info: ${res.status}`);
  }
  return res.json();
}
