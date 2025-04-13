import React, { useState } from 'react';
import { TextField, Container, Paper, Button, Box, Typography, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [specialization, setSpecialization] = useState(''); // New state for specialization
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const agent = {
      name,
      username,
      password,
      contactNumber,
      email,
      address,
      dateOfBirth,
      specialization,
    };

    try {
      const response = await fetch('http://localhost:8080/field-agent/addagent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agent),
      });

      if (response.ok) {
        setMessage('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error registering field agent:', error);
      setMessage('Server error. Please try again later.');
    }
  };

  return (
    <Container>
      <Paper elevation={3} sx={{ padding: '50px 20px', width: 600, margin: '20px auto', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom style={{ color: '#1976d2' }}>
          Field Agent Registration
        </Typography>
        <Box component="form" display="flex" flexDirection="column" alignItems="center" onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
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
          <TextField
            label="Contact Number"
            variant="outlined"
            fullWidth
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Address"
            variant="outlined"
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Date of Birth"
            type="date"
            variant="outlined"
            fullWidth
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            label="Specialization"
            variant="outlined"
            fullWidth
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            sx={{ mb: 2 }}
          >
            <MenuItem value="Road Damage">Road Damage</MenuItem>
            <MenuItem value="Waste Management">Waste Management</MenuItem>
            <MenuItem value="Water Supply">Water Supply</MenuItem>
            <MenuItem value="Electricity Issues">Electricity Issues</MenuItem>
            <MenuItem value="Public Transportation">Public Transportation</MenuItem>
            <MenuItem value="Noise Pollution">Noise Pollution</MenuItem>
            <MenuItem value="Air Pollution">Air Pollution</MenuItem>
            <MenuItem value="Sewage and Drainage">Sewage and Drainage</MenuItem>
            <MenuItem value="Street Lighting">Street Lighting</MenuItem>
            <MenuItem value="Illegal Construction">Illegal Construction</MenuItem>
            <MenuItem value="Parks and Recreation">Parks and Recreation</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: '#1976d2', color: 'white', mt: 2 }}
          >
            Register
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