import React, { useState, useEffect } from 'react';
import { 
  Button, 
  TextField, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  MenuItem, 
  Avatar,
  Box,
  Fade
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { keyframes } from '@mui/system';

const wiggle = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
`;

const roles = [
  { value: 'USER', label: 'User' },
  { value: 'ADMIN', label: 'Admin' }
];

const userTypes = [
  { value: 'TEACHER', label: 'Teacher' },
  { value: 'STUDENT', label: 'Student' },
  { value: 'ADMINISTRATIVE', label: 'Administrative' }
];

export default function UserForm({ open, onClose, onSave, user }) {
  const [form, setForm] = useState({ 
    username: '', 
    password: '', 
    role: 'USER',
    userType: 'STUDENT'
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [usernameError, setUsernameError] = useState('');
  const [isWiggling, setIsWiggling] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ 
        ...user, 
        password: '' 
      });
      if (user.id) {
        setPhotoPreview(`http://localhost:8080/api/users/${user.id}/photo`);
      }
    } else {
      setForm({ 
        username: '', 
        password: '', 
        role: 'USER',
        userType: 'STUDENT'
      });
      setPhotoPreview(null);
    }
    // Reset errors when form is opened/closed
    setUsernameError('');
    setIsWiggling(false);
  }, [user, open]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('user', new Blob([JSON.stringify(form)], { type: 'application/json' }));
      if (photo) {
        formData.append('photo', photo);
      }
      await onSave(formData);
      setUsernameError('');
      setIsWiggling(false);
    } catch (err) {
      console.error('Form submission error:', err);
      if (err.message.includes('Username already exists')) {
        setUsernameError('Username already exists. Please choose a different username.');
        setIsWiggling(true);
        // Reset wiggle after animation completes
        setTimeout(() => setIsWiggling(false), 500);
      } else {
        setUsernameError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      TransitionComponent={Fade}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(90deg, rgba(63, 81, 181, 0.1) 0%, rgba(63, 81, 181, 0.05) 100%)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        padding: 3
      }}>
        {user ? 'Edit User' : 'Create User'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ padding: 3 }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 3
          }}>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              id="photo-input"
              onChange={handlePhotoChange}
            />
            <label htmlFor="photo-input">
              <Avatar
                src={photoPreview}
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mb: 2,
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  }
                }}
              />
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCamera />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }
                }}
              >
                Upload Photo
              </Button>
            </label>
          </Box>

          <TextField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            error={!!usernameError}
            helperText={usernameError}
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: 2,
                animation: isWiggling ? `${wiggle} 0.5s ease-in-out` : 'none',
              },
              mb: 2
            }}
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
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: 2,
              },
              mb: 2
            }}
          />
          
          <TextField
            select
            label="Role"
            name="role"
            value={form.role}
            onChange={handleChange}
            fullWidth
            margin="normal"
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: 2,
              },
              mb: 2
            }}
          >
            {roles.map(option => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="User Type"
            name="userType"
            value={form.userType}
            onChange={handleChange}
            fullWidth
            margin="normal"
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: 2,
              }
            }}
          >
            {userTypes.map(option => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ 
          padding: 3,
          background: 'rgba(0, 0, 0, 0.02)',
          borderTop: '1px solid rgba(0, 0, 0, 0.05)'
        }}>          <Button 
            onClick={onClose}
            disabled={loading}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={loading}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
