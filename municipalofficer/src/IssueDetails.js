import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Grid, Button, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

export default function IssueDetails() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [fieldAgents, setFieldAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const response = await fetch(`http://localhost:8080/issue/${id}`);
        if (response.ok) {
          const data = await response.json();
          setIssue(data);
          fetchFieldAgents(data.complaintType);
        } else {
          setError('Failed to fetch issue details.');
        }
      } catch (err) {
        setError('Server error. Please try again later.');
      }
    };
    fetchIssue();
  }, [id]);

  const fetchFieldAgents = async (complaintType) => {
    try {
      const response = await fetch(`http://localhost:8080/field-agent/by-specialization/${complaintType}`);
      if (response.ok) {
        const data = await response.json();
        setFieldAgents(data);
      }
    } catch (err) {
      console.error('Error fetching field agents:', err);
    }
  };

  const handleAssign = async () => {
    if (!selectedAgent) {
      setError('Please select a field agent.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/issue/assign/${id}?agentId=${selectedAgent}`, {
        method: 'PUT',
      });
      if (response.ok) {
        setIssue({ ...issue, assignedAgent: fieldAgents.find(agent => agent.id === parseInt(selectedAgent)), status: 'Assigned' });
        setError('');
        alert('Issue assigned successfully!');
      } else {
        setError('Failed to assign issue.');
      }
    } catch (err) {
      setError('Server error during assignment.');
    }
  };

  if (error) return <Container sx={{ mt: 4 }}><Typography color="error">{error}</Typography></Container>;
  if (!issue) return <Container sx={{ mt: 4 }}><Typography>Loading...</Typography></Container>;

  return (
    <Container sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Issue Details</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography><strong>ID:</strong> {issue.id}</Typography>
            <Typography><strong>Complaint Type:</strong> {issue.complaintType}</Typography>
            <Typography><strong>Description:</strong> {issue.issueDescription}</Typography>
            <Typography><strong>Submission Date:</strong> {issue.submissionDate}</Typography>
            <Typography><strong>Preferred Resolution Date:</strong> {issue.preferredResolutionDate}</Typography>
            <Typography><strong>Preferred Resolution Time:</strong> {issue.preferredResolutionTime}</Typography>
            <Typography><strong>Status:</strong> {issue.status}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>User Name:</strong> {issue.user.name}</Typography>
            <Typography><strong>Contact Number:</strong> {issue.user.contactNumber}</Typography>
            <Typography><strong>Email:</strong> {issue.user.email}</Typography>
            <Typography><strong>Address:</strong> {issue.user.address}</Typography>
            <Typography><strong>Assigned Agent:</strong> {issue.assignedAgent ? issue.assignedAgent.name : 'Unassigned'}</Typography>
          </Grid>
        </Grid>
        {issue.status !== 'Completed' && !issue.assignedAgent && (
          <Box sx={{ mt: 3 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Field Agent</InputLabel>
              <Select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                label="Select Field Agent"
              >
                <MenuItem value="">Select an agent</MenuItem>
                {fieldAgents.map(agent => (
                  <MenuItem key={agent.id} value={agent.id}>
                    {agent.name} (Issue Count: {agent.issueCount})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" onClick={handleAssign} sx={{ mr: 2 }}>
              Assign to Agent
            </Button>
          </Box>
        )}
        <Button variant="outlined" onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Paper>
    </Container>
  );
}