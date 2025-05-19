import React from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import Logo from './Logo';
import './UserList.css';

export default function UserList({ users, isAdmin, onEdit, onDelete }) {
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
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Role</TableCell>
              {isAdmin && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id} className="table-row">
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.role}</TableCell>
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
                      sx={{ ml: 1 }} 
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
    </Box>
  );
}
