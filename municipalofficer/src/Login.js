import React, { useState } from 'react';
import { TextField, Container, Paper, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const credentials = { username, password };

    try {
      const response = await fetch('http://localhost:8080/municipal-officer-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        localStorage.setItem('officerLoggedIn', 'true');
        setMessage('Login successful! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setMessage('Invalid username or password.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setMessage('Server error. Please try again later.');
    }
  };

  return (
    <Container>
      <Paper elevation={3} sx={{ padding: '50px 20px', width: 600, margin: '20px auto', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom style={{ color: '#1976d2' }}>
          Municipal Officer Login
        </Typography>
        <Box component="form" display="flex" flexDirection="column" alignItems="center" onSubmit={handleSubmit}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: '#1976d2', color: 'white', mt: 2 }}
          >
            Login
          </Button>
          {message && (
            <Typography sx={{ color: message.includes('successful') ? 'green' : 'red', mt: 2 }}>
              {message}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
}