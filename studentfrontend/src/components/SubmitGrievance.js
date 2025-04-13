import React, { useState } from 'react';
import { TextField, Container, Paper, Button, Box, Typography, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function SubmitGrievance() {
  const [complaintType, setComplaintType] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [preferredResolutionDate, setPreferredResolutionDate] = useState('');
  const [preferredResolutionTime, setPreferredResolutionTime] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const userId = localStorage.getItem("userId");

    if (!userId) {
      setMessage("User not logged in. Please log in to submit a grievance.");
      return;
    }

    const issue = {
      userId: parseInt(userId),
      complaintType,
      issueDescription,
      preferredResolutionDate,
      preferredResolutionTime,
    };

    console.log("Submitting issue:", issue);
    console.log("JSON payload:", JSON.stringify(issue));

    try {
      const response = await fetch('http://localhost:8080/issue/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issue),
      });

      if (response.ok) {
        setMessage("Issue submitted successfully!");
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        const errorText = await response.text();
        setMessage(`Failed to submit issue: ${errorText}`);
      }
    } catch (error) {
      console.error("Error submitting issue:", error);
      setMessage("Server error. Please try again later.");
    }
  };

  return (
    <Container>
      <Paper elevation={3} sx={{ padding: "50px 20px", width: 600, margin: "20px auto", textAlign: "center" }}>
        <h1 style={{ color: '#1976d2', marginBottom: '20px' }}>Submit a Grievance</h1>
        <Box component="form" display="flex" flexDirection="column" alignItems="center" onSubmit={handleSubmit}>
          <TextField
            select
            label="Complaint Type"
            variant="outlined"
            fullWidth
            value={complaintType}
            onChange={(e) => setComplaintType(e.target.value)}
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
          <TextField
            label="Issue Description"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            value={issueDescription}
            onChange={(e) => setIssueDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Preferred Resolution Date"
            type="date"
            variant="outlined"
            fullWidth
            value={preferredResolutionDate}
            onChange={(e) => setPreferredResolutionDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Preferred Resolution Time"
            type="time"
            variant="outlined"
            fullWidth
            value={preferredResolutionTime}
            onChange={(e) => setPreferredResolutionTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: "#1976d2", color: "white", mt: 2 }}
          >
            Submit
          </Button>
          {message && (
            <Typography sx={{ color: message.includes("successfully") ? "green" : "red", mt: 2 }}>
              {message}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
}