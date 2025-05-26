import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Button, Container, Box, Snackbar, Alert, Fade } from '@mui/material';
import { theme } from './theme';
import LoginForm from './LoginForm';
import UserList from './UserList';
import UserForm from './UserForm';
import { getAuthHeader, fetchUsers, createUser, updateUser, deleteUser, fetchCurrentUser } from './api';
import './App.css';

export default function App() {
  const [auth, setAuth] = useState(null);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [success, setSuccess] = useState('');

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
      const currentUser = await fetchCurrentUser(authHeader);
      setAuth(authHeader);
      setUsername(currentUser.username);
      setRole(currentUser.role);

      if (currentUser.role === 'ADMIN') {
        const data = await fetchUsers(authHeader);
        setUsers(data);
      } else {
        setUsers([currentUser]);
      }
    } catch (e) {
      setAuth(null);
      setUsername('');
      setRole(null);
      setUsers([]);
      throw new Error('Username and password do not match');
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

  const handleSave = async (formData) => {
    setLoading(true);
    setError('');
    try {
      if (editUser) {
        await updateUser(editUser.id, formData, auth);
        setSuccess('User updated');
        setShowForm(false);
      } else {
        await createUser(formData, auth);
        setSuccess('User created');
        setShowForm(false);
      }
      await loadUsers();
    } catch (err) {
      // Let the UserForm handle the duplicate username error
      if (err.message.includes('Username already exists')) {
        throw err; // Pass the error to UserForm
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = role === 'ADMIN';

  if (!auth) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoginForm onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box className="app-container">
        <CssBaseline />
        <AppBar position="static" className="app-header">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>User Management</Typography>
            <Typography variant="body1" sx={{ mr: 2 }}>{username} ({role})</Typography>
            <Button 
              color="inherit" 
              onClick={handleLogout}
              sx={{ 
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Container className="content-container">
          <Fade in={!!error}>
            <Box sx={{ mb: 2 }}>
              {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
            </Box>
          </Fade>
          {success && (
            <Snackbar 
              open 
              autoHideDuration={3000} 
              onClose={() => setSuccess('')}
              TransitionComponent={Fade}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Alert severity="success" sx={{ borderRadius: 2 }}>{success}</Alert>
            </Snackbar>
          )}
          <Box 
            display="flex" 
            justifyContent="flex-end" 
            mt={4} 
            mb={2}
          >
            {isAdmin && (
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleCreate}
                sx={{
                  px: 4,
                  py: 1,
                  borderRadius: 2,
                  boxShadow: 2,
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Create User
              </Button>
            )}
          </Box>
          <UserList users={users} isAdmin={isAdmin} onEdit={handleEdit} onDelete={handleDelete} />
          <UserForm open={showForm} onClose={() => setShowForm(false)} onSave={handleSave} user={editUser} />
        </Container>
      </Box>
    </ThemeProvider>
  );
}
