import React from 'react';
import { Typography, Box } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

export default function Logo() {
  return (
    <Box className="app-logo" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>      <PersonIcon sx={{ 
          fontSize: { xs: 30, sm: 35, md: 40 }, 
          color: '#fff' 
        }} />
      <Typography
        variant="h4"
        component="h1"
        sx={{
          color: '#fff',
          fontWeight: 600,
          textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
        }}
      >
        STUDENT MANAGEMENT
      </Typography>
    </Box>
  );
}
