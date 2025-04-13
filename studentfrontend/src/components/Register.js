import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { TextField, Container, Paper, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  paperStyle: {
    padding: '50px 20px',
    width: 600,
    margin: '20px auto',
    textAlign: 'center',
  },
  buttonStyle: {
    backgroundColor: '#1976d2',
    color: 'white',
    '&:hover': {
      backgroundColor: '#125aa1',
    },
  },
  successMessage: {
    color: 'green',
    marginTop: '20px',
  },
}));

export default function Register() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const classes = useStyles();
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    const user = { 
      name, 
      username, 
      password, 
      contactNumber, 
      email, 
      address, 
      dateOfBirth 
    };
    
    fetch('http://localhost:8080/user/adduser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
      .then((response) => {
        if (response.ok) {
          setSuccessMessage('Registration successful! Redirecting to login...');
          setName('');
          setUsername('');
          setPassword('');
          setContactNumber('');
          setEmail('');
          setAddress('');
          setDateOfBirth('');
          
          setTimeout(() => {
            navigate('/login'); // Already lowercase, matches App.js
          }, 2000);
        } else {
          throw new Error('Registration failed');
        }
      })
      .catch((error) => {
        console.error('Error adding user:', error);
        setSuccessMessage('Registration failed. Please try again.');
      });
  };

  return (
    <Container>
      <Paper elevation={3} className={classes.paperStyle}>
        <h1 style={{ color: '#1976d2', marginBottom: '20px' }}>Register Here</h1>
        <Box display="flex" flexDirection="column" alignItems="center">
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            sx={{ mb: 2 }}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            sx={{ mb: 2 }}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            value={password}
            sx={{ mb: 2 }}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="Contact Number"
            variant="outlined"
            fullWidth
            value={contactNumber}
            sx={{ mb: 2 }}
            onChange={(e) => setContactNumber(e.target.value)}
          />
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            fullWidth
            value={email}
            sx={{ mb: 2 }}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Address"
            variant="outlined"
            fullWidth
            value={address}
            sx={{ mb: 2 }}
            onChange={(e) => setAddress(e.target.value)}
          />
          <TextField
            label="Date of Birth"
            variant="outlined"
            type="date"
            fullWidth
            value={dateOfBirth}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
          <Button
            variant="contained"
            className={classes.buttonStyle}
            sx={{ mt: 2 }}
            onClick={handleClick}
          >
            Register
          </Button>
          {successMessage && (
            <Typography 
              className={classes.successMessage}
              sx={{ color: successMessage.includes('failed') ? 'red' : 'green' }}
            >
              {successMessage}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
}