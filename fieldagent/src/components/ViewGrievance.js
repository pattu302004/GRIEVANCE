import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Grid, Button, Box, TextField } from '@mui/material';
export default function ViewGrievance() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [error, setError] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const response = await fetch(`http://localhost:8080/issue/${id}`);
        if (response.ok) {
          const data = await response.json();
          setIssue(data);
        } else {
          setError('Failed to fetch issue details.');
        }
      } catch (err) {
        setError('Server error. Please try again later.');
      }
    };

    fetchIssue();
  }, [id]);

  const initiateCompletion = async () => {
    try {
      const response = await fetch(`http://localhost:8080/issue/initiate-completion/${id}`, {
        method: 'PUT',
      });

      if (response.ok) {
        alert('A confirmation code has been sent to the user.');
        setIssue({ ...issue, status: 'Waiting for Customer Confirmation' });
        setShowCodeInput(true);
      } else {
        alert('Failed to initiate completion process.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Server error. Please try again later.');
    }
  };

  const verifyCode = async () => {
    try {
      const response = await fetch(`http://localhost:8080/issue/verify-code/${id}?code=${confirmationCode}`, {
        method: 'PUT',
      });

      if (response.ok) {
        alert('Code verified. Issue marked as completed!');
        setIssue({ ...issue, status: 'Completed' });
        setShowCodeInput(false);
      } else {
        alert('Invalid code. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      alert('Server error. Please try again later.');
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!issue) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Grievance Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Complaint Type:</strong> {issue.complaintType}</Typography>
            <Typography><strong>Issue Description:</strong> {issue.issueDescription}</Typography>
            <Typography><strong>Preferred Resolution Date:</strong> {issue.preferredResolutionDate}</Typography>
            <Typography><strong>Preferred Resolution Time:</strong> {issue.preferredResolutionTime}</Typography>
            <Typography><strong>Status:</strong> {issue.status}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>User Name:</strong> {issue.user.name}</Typography>
            <Typography><strong>Contact Number:</strong> {issue.user.contactNumber}</Typography>
            <Typography><strong>Email:</strong> {issue.user.email}</Typography>
            <Typography><strong>Address:</strong> {issue.user.address}</Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          {issue.status !== 'Completed' && issue.status !== 'Waiting for Customer Confirmation' && (
            <Button
              variant="contained"
              color="primary"
              onClick={initiateCompletion}
              sx={{ mr: 2 }}
            >
              Mark as Completed
            </Button>
          )}

          {issue.status === 'Waiting for Customer Confirmation' && (
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ mb: 1 }}><strong>Enter Confirmation Code from User:</strong></Typography>
              <TextField
                label="Confirmation Code"
                variant="outlined"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                sx={{ mr: 2 }}
              />
              <Button
                variant="contained"
                color="success"
                onClick={verifyCode}
              >
                Verify & Complete
              </Button>
            </Box>
          )}

          <Button variant="outlined" onClick={handleBack} sx={{ mt: 2 }}>
            Back to Dashboard
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
