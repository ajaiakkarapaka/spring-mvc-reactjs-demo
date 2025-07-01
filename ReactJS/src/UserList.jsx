import React, { useState } from 'react';
import { 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography, 
  Box, 
  Avatar, 
  Dialog, 
  DialogTitle, 
  DialogContent,
  IconButton,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Logo from './Logo';
import './UserList.css';

export default function UserList({ users = [], isAdmin, onEdit, onDelete }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    // Clear selected user after animation completes
    setTimeout(() => setSelectedUser(null), 300);
  };

  console.log('UserList rendered with users:', users); // Debug log

  return (
    <Box className="user-list-container">
      <Logo />
      <TableContainer component={Paper} className="user-list-card">
        <Typography variant="h5" className="user-list-header">
          User Management Dashboard
        </Typography>
        <Table>
          <TableHead>
            <TableRow className="table-header">
              <TableCell>Profile</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>User Type</TableCell>
              {isAdmin && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {users && users.length > 0 ? (
              users.map(user => (
                <TableRow key={user.id} className="table-row">
                  <TableCell>
                    <Avatar
                      src={user.profilePhoto ? `data:${user.profilePhotoContentType};base64,${user.profilePhoto}` : undefined}
                      alt={user.username}
                      sx={{
                        width: 40,
                        height: 40,
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        }
                      }}
                      onClick={() => handleUserClick(user)}
                    />
                  </TableCell>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    <Button 
                      onClick={() => handleUserClick(user)}
                      sx={{
                        textTransform: 'none',
                        '&:hover': {
                          backgroundColor: 'rgba(63, 81, 181, 0.08)',
                        }
                      }}
                    >
                      {user.username}
                    </Button>
                  </TableCell>
                  <TableCell>{user.userType}</TableCell>
                  {isAdmin && (
                    <TableCell align="right">
                      <Tooltip title="Edit user">
                        <IconButton 
                          onClick={() => onEdit(user)}
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          <EditIcon fontSize="small" color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete user">
                        <IconButton 
                          onClick={() => onDelete(user.id)}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" color="error" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={isAdmin ? 5 : 4} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No users found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={dialogOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        aria-labelledby="user-profile-title"
        keepMounted={false}
        TransitionProps={{
          onExited: () => setSelectedUser(null),
        }}
      >
        <DialogTitle id="user-profile-title" sx={{ pb: 1 }}>
          User Profile
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box 
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              gap={2} 
              py={2}
              role="region"
              aria-label="User details"
            >
              <Avatar
                src={selectedUser.profilePhoto ? `data:${selectedUser.profilePhotoContentType};base64,${selectedUser.profilePhoto}` : undefined}
                alt={`${selectedUser.username}'s profile photo`}
                sx={{ width: 120, height: 120 }}
              />
              <Typography variant="h6">{selectedUser.username}</Typography>
              <Typography variant="body1" color="text.secondary">
                User Type: {selectedUser.userType}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Role: {selectedUser.role}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
