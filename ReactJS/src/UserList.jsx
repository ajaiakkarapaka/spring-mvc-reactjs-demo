import React, { useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Avatar, Dialog, DialogTitle, DialogContent } from '@mui/material';
import Logo from './Logo';
import './UserList.css';

export default function UserList({ users, isAdmin, onEdit, onDelete }) {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleClose = () => {
    setSelectedUser(null);
  };

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
              {isAdmin && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id} className="table-row">
                <TableCell>
                  <Avatar
                    src={user.profilePhoto ? `data:${user.profilePhotoContentType};base64,${user.profilePhoto}` : undefined}
                    alt={user.username}
                  />
                </TableCell>
                <TableCell>{user.id}</TableCell>
                <TableCell>
                  <Button onClick={() => handleUserClick(user)}>{user.username}</Button>
                </TableCell>
                <TableCell>{user.userType}</TableCell>
                {isAdmin && (
                  <TableCell>
                    <Button 
                      size="small" 
                      className="edit-button"
                      onClick={() => onEdit(user)}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="small" 
                      className="delete-button"
                      onClick={() => onDelete(user.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedUser && (
        <Dialog open={!!selectedUser} onClose={handleClose}>
          <DialogTitle>User Profile</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
              <Avatar
                src={selectedUser.profilePhoto ? `data:${selectedUser.profilePhotoContentType};base64,${selectedUser.profilePhoto}` : undefined}
                alt={selectedUser.username}
                sx={{ width: 100, height: 100 }}
              />
              <Typography variant="h6">{selectedUser.username}</Typography>
              <Typography variant="body1">User Type: {selectedUser.userType}</Typography>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
}
