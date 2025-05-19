import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Paper } from '@mui/material';
import Logo from './Logo';
import './LoginForm.css';

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Username and password required');
      return;
    }
    setError('');
    try {
      await onLogin(username, password);
    } catch (err) {
      setError(err.message || 'Username and password do not match');
    }
  };
  return (
    <Box className="login-container">
      <Logo />
      <Paper className="login-card" elevation={3}>
        <Typography className="login-title" variant="h4">
          Login
        </Typography>
        <form onSubmit={handleSubmit} className="login-form">
          <TextField
            className="login-input"
            label="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            fullWidth
            variant="outlined"
            autoFocus
            InputProps={{
              style: { fontSize: '16px' }
            }}
            InputLabelProps={{
              style: { fontSize: '16px' }
            }}
          />
          <TextField
            className="login-input"
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            variant="outlined"
            InputProps={{
              style: { fontSize: '16px' }
            }}
            InputLabelProps={{
              style: { fontSize: '16px' }
            }}
          />
          {error && <Typography className="error-message">{error}</Typography>}
          <Button className="login-button" type="submit" variant="contained" fullWidth>
            Sign In
          </Button>
        </form>
      </Paper>
      <Typography className="version-text" variant="caption">
        v1.0.0
      </Typography>
    </Box>
  );
}
