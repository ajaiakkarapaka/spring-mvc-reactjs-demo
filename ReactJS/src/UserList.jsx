import React from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

export default function UserList({ users, isAdmin, onEdit, onDelete }) {
  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ m: 2 }}>User List</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Role</TableCell>
            {isAdmin && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.role}</TableCell>
              {isAdmin && (
                <TableCell>
                  <Button size="small" variant="outlined" color="primary" onClick={() => onEdit(user)}>Edit</Button>
                  <Button size="small" variant="outlined" color="error" sx={{ ml: 1 }} onClick={() => onDelete(user.id)}>Delete</Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
