import React, { useState, useEffect } from 'react';
import { CssBaseline, AppBar, Toolbar, Typography, Button, Container, Box, Snackbar, Alert } from '@mui/material';
import LoginForm from './LoginForm';
import UserList from './UserList';
import UserForm from './UserForm';
import { getAuthHeader, fetchUsers, createUser, updateUser, deleteUser, fetchCurrentUser } from './api';

export default function App() {
  const [auth, setAuth] = useState(null);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState(null); // <-- add role state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [success, setSuccess] = useState('');

  // Fetch users after login
  useEffect(() => {
    if (auth) {
      loadUsers();
    }
  }, [auth]);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchUsers(auth);
      setUsers(data);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleLogin = async (user, pass) => {
    const authHeader = getAuthHeader(user, pass);
    setLoading(true);
    setError('');
    try {
      // First try to get current user info
      console.log('Fetching current user info...');
      const currentUser = await fetchCurrentUser(authHeader);
      console.log('Current user:', currentUser);
      
      // Set auth state if successful
      setAuth(authHeader);
      setUsername(currentUser.username);
      setRole(currentUser.role);
      
      // Try to fetch users list if admin
      if (currentUser.role === 'ADMIN') {
        console.log('Admin user, fetching all users...');
        const data = await fetchUsers(authHeader);
        setUsers(data);
      } else {
        console.log('Regular user, setting empty user list');
        setUsers([currentUser]); // Show only the current user
      }
    } catch (e) {
      console.error('Login error:', e);
      setError('Login failed: ' + (e.message || 'Unknown error'));
      // Reset state on error
      setAuth(null);
      setUsername('');
      setRole(null);
      setUsers([]);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setAuth(null);
    setUsername('');
    setRole(null);
    setUsers([]);
  };

  const handleCreate = () => {
    setEditUser(null);
    setShowForm(true);
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError('');
    try {
      await deleteUser(id, auth);
      setSuccess('User deleted');
      await loadUsers();
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleSave = async (form) => {
    setLoading(true);
    setError('');
    try {
      if (editUser) {
        // If password is blank, don't send it
        const userToUpdate = { ...editUser, ...form };
        if (!form.password) delete userToUpdate.password;
        await updateUser(editUser.id, userToUpdate, auth);
        setSuccess('User updated');
      } else {
        await createUser(form, auth);
        setSuccess('User created');
      }
      setShowForm(false);
      await loadUsers();
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const isAdmin = role === 'ADMIN';

  if (!auth) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <Box>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>User Management</Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>{username} ({role})</Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Snackbar open autoHideDuration={3000} onClose={() => setSuccess('')}><Alert severity="success">{success}</Alert></Snackbar>}
        <Box display="flex" justifyContent="flex-end" mt={4}>
          {isAdmin && <Button variant="contained" color="primary" onClick={handleCreate}>Create User</Button>}
        </Box>
        <UserList users={users} isAdmin={isAdmin} onEdit={handleEdit} onDelete={handleDelete} />
        <UserForm open={showForm} onClose={() => setShowForm(false)} onSave={handleSave} user={editUser} />
      </Container>
    </Box>
  );
}
