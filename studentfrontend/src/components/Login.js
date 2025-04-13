import React, { useState } from 'react';
import { TextField, Container, Paper, Button, Box, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    setMessage("");
    const user = { username, password };

    try {
      const response = await fetch('http://localhost:8080/user/checkuser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem("userId", userData.id);
        localStorage.setItem("userName", userData.name);
        localStorage.setItem("contactNumber", userData.contactNumber);
        localStorage.setItem("email", userData.email);
        localStorage.setItem("address", userData.address);
        navigate('/submit-grievance');
      } else {
        setMessage("Incorrect Username/Password ❌");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("Server error. Please try again later.");
    }
  };

  return (
    <Container>
      <Paper elevation={3} sx={{ padding: "50px 20px", width: 600, margin: "20px auto", textAlign: "center" }}>
        <h1 style={{ color: '#1976d2', marginBottom: '20px' }}>Login</h1>
        <Box display="flex" flexDirection="column" alignItems="center">
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
          <Button
            variant="contained"
            sx={{ backgroundColor: "#1976d2", color: "white", mt: 2 }}
            onClick={handleClick}
          >
            Login
          </Button>
          {message && (
            <Typography sx={{ color: message.includes("Success") ? "green" : "red", mt: 2 }}>
              {message}
            </Typography>
          )}
          <Typography sx={{ mt: 2 }}>
            Don't have an account?{" "}
            <Link 
              component="button" 
              variant="body2" 
              onClick={() => navigate('/register')}
              sx={{ color: "#1976d2", cursor: "pointer" }}
            >
              Register here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}