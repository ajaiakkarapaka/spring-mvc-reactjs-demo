import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { 
  CssBaseline, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Box, 
  Snackbar, 
  Alert, 
  Fade,
  CircularProgress 
} from '@mui/material';
import { theme } from './theme';
import LoginForm from './LoginForm';
import UserList from './UserList';
import UserForm from './UserForm';
import ErrorBoundary from './ErrorBoundary';
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

  const loadUsers = async (authHeader) => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchUsers(authHeader || auth);
      console.log('Fetched users:', data); // Debug log
      setUsers(data);
    } catch (e) {
      console.error('Error loading users:', e); // Debug log
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth) {
      loadUsers();
    }
  }, [auth]);

  const handleLogin = async (user, pass) => {
    const authHeader = getAuthHeader(user, pass);
    setLoading(true);
    setError('');
    
    try {
      // First get the current user's info
      const currentUser = await fetchCurrentUser(authHeader);
      
      // Then update all the state atomically
      setAuth(authHeader);
      setUsername(currentUser.username);
      setRole(currentUser.role);
      
      // Load users based on role
      if (currentUser.role === 'ADMIN') {
        await loadUsers(authHeader);
      } else {
        setUsers([currentUser]);
      }
      
      setLoading(false);
    } catch (e) {
      console.error('Login error:', e);
      setLoading(false);
      setAuth(null);
      setUsername('');
      setRole(null);
      setUsers([]);
      throw new Error('Username and password do not match');
    }
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
          {error && (
            <Fade in={!!error}>
              <Box sx={{ mb: 2 }}>
                <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
              </Box>
            </Fade>
          )}
          
          {success && (
            <Snackbar 
              open 
              autoHideDuration={3000} 
              onClose={() => setSuccess('')}
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
                disabled={loading}
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

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : (
            <UserList 
              users={users} 
              isAdmin={role === 'ADMIN'} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          )}

          <ErrorBoundary>
            <UserForm 
              open={showForm} 
              onClose={() => setShowForm(false)} 
              onSave={handleSave} 
              user={editUser} 
            />
          </ErrorBoundary>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
