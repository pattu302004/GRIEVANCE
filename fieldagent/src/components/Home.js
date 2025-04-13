import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <Container sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom style={{ color: '#1976d2' }}>
        Welcome to the Field Agent Portal
      </Typography>
      <Typography variant="h6" gutterBottom>
        Please log in or register to manage grievances.
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: '#1976d2', color: 'white', mr: 2 }}
          onClick={() => navigate('/login')}
        >
          Login
        </Button>
        <Button
          variant="outlined"
          sx={{ color: '#1976d2', borderColor: '#1976d2' }}
          onClick={() => navigate('/register')}
        >
          Register
        </Button>
      </Box>
    </Container>
  );
}