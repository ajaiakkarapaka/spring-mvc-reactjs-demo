import React, { useState, useEffect } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from '@mui/material';

const roles = [
  { value: 'USER', label: 'User' },
  { value: 'ADMIN', label: 'Admin' }
];

export default function UserForm({ open, onClose, onSave, user }) {
  const [form, setForm] = useState({ username: '', password: '', role: 'USER' });

  useEffect(() => {
    if (user) {
      setForm({ ...user, password: '' });
    } else {
      setForm({ username: '', password: '', role: 'USER' });
    }
  }, [user]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{user ? 'Edit User' : 'Create User'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required={!user}
            helperText={user ? 'Leave blank to keep current password' : ''}
          />
          <TextField
            select
            label="Role"
            name="role"
            value={form.role}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            {roles.map(option => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
