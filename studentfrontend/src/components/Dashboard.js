import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Button, 
  Paper, 
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';

export default function Dashboard() {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [error, setError] = useState('');
  const [openReopenDialog, setOpenReopenDialog] = useState(false);
  const [reopenImage, setReopenImage] = useState(null);
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  const fetchIssues = async () => {
    try {
      const response = await fetch(`http://localhost:8080/issue/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setIssues(data);
        setFilteredIssues(data);
      } else {
        setError("Failed to fetch issues.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  useEffect(() => {
    if (!userId) {
      setError("User not logged in. Please log in to view your dashboard.");
      return;
    }

    fetchIssues();
  }, [userId]);

  useEffect(() => {
    if (statusFilter === 'All') {
      setFilteredIssues(issues);
    } else {
      setFilteredIssues(issues.filter(issue => issue.status === statusFilter));
    }
    setSelectedIssue(null);
  }, [statusFilter, issues]);

  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
  };

  const handleWithdraw = async (issueId) => {
    try {
      const response = await fetch(`http://localhost:8080/issue/${issueId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setIssues(prevIssues => prevIssues.filter(issue => issue.id !== issueId));
        setFilteredIssues(prevIssues => prevIssues.filter(issue => issue.id !== issueId));
        setSelectedIssue(null);
      } else {
        const errorText = await response.text();
        alert(`Failed to withdraw issue: ${errorText}`);
      }
    } catch (error) {
      alert("Error withdrawing issue. Please try again later.");
    }
  };

  const handleReopen = async (issueId) => {
    const issue = issues.find(i => i.id === issueId);
    if (issue.status !== "Completed") {
      alert("Only completed issues can be reopened.");
      return;
    }
    setSelectedIssue(issue);
    setOpenReopenDialog(true);
  };

  const handleReopenSubmit = async () => {
    if (!reopenImage) {
      alert("Please upload proof image.");
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (reopenImage.size > maxSize) {
      alert("File size exceeds 10MB. Please upload a smaller image.");
      return;
    }

    const formData = new FormData();
    formData.append("issueId", selectedIssue.id);
    formData.append("image", reopenImage);
    formData.append("userId", userId);

    try {
      const response = await fetch('http://localhost:8080/issue/reopen-request', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setOpenReopenDialog(false);
        setReopenImage(null);
        alert("Reopen request submitted successfully.");
        // Fetch updated issues to reflect any changes (e.g., rejection)
        await fetchIssues();
      } else {
        const errorText = await response.text();
        console.error("Response Status:", response.status);
        console.error("Response Text:", errorText);
        alert(`Failed to submit reopen request: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("Error submitting reopen request: " + error.message);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Welcome to Your Dashboard, {userName}!
        </Typography>
        <Typography variant="h6" gutterBottom>
          View and manage your grievances below.
        </Typography>

        <FormControl sx={{ mb: 2, minWidth: 200 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Filter by Status"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Reopen Requested">Reopen Requested</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </Select>
        </FormControl>

        {error ? (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        ) : filteredIssues.length === 0 ? (
          <Typography sx={{ mt: 2 }}>
            No issues found for the selected status.
          </Typography>
        ) : (
          <>
            <Table sx={{ mt: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Complaint Type</TableCell>
                  <TableCell>Issue Description</TableCell>
                  <TableCell>Preferred Resolution Date</TableCell>
                  <TableCell>Preferred Resolution Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredIssues.map((issue) => (
                  <TableRow 
                    key={issue.id} 
                    onClick={() => handleIssueClick(issue)} 
                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
                  >
                    <TableCell>{issue.complaintType}</TableCell>
                    <TableCell>{issue.issueDescription}</TableCell>
                    <TableCell>{issue.preferredResolutionDate}</TableCell>
                    <TableCell>{issue.preferredResolutionTime}</TableCell>
                    <TableCell>{issue.status}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        disabled={issue.status !== "Pending"}
                        onClick={(e) => { e.stopPropagation(); handleWithdraw(issue.id); }}
                        sx={{ mr: 1 }}
                      >
                        Withdraw
                      </Button>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        disabled={issue.status !== "Completed"}
                        onClick={(e) => { e.stopPropagation(); handleReopen(issue.id); }}
                      >
                        Reopen
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Dialog open={openReopenDialog} onClose={() => setOpenReopenDialog(false)}>
              <DialogTitle>Reopen Issue #{selectedIssue?.id}</DialogTitle>
              <DialogContent>
                <Typography>Please upload proof (max 10MB) that the issue was not resolved properly:</Typography>
                <TextField
                  type="file"
                  inputProps={{ accept: "image/*" }}
                  onChange={(e) => setReopenImage(e.target.files[0])}
                  fullWidth
                  sx={{ mt: 2 }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenReopenDialog(false)}>Cancel</Button>
                <Button onClick={handleReopenSubmit} variant="contained">Submit</Button>
              </DialogActions>
            </Dialog>

            {selectedIssue && (
              <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Issue Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography><strong>Complaint Type:</strong> {selectedIssue.complaintType}</Typography>
                    <Typography><strong>Issue Description:</strong> {selectedIssue.issueDescription}</Typography>
                    <Typography><strong>Preferred Resolution Date:</strong> {selectedIssue.preferredResolutionDate}</Typography>
                    <Typography><strong>Preferred Resolution Time:</strong> {selectedIssue.preferredResolutionTime}</Typography>
                    <Typography><strong>Status:</strong> {selectedIssue.status}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography><strong>Full Name:</strong> {selectedIssue.user.name}</Typography>
                    <Typography><strong>Contact Number:</strong> {selectedIssue.user.contactNumber}</Typography>
                    <Typography><strong>Email:</strong> {selectedIssue.user.email}</Typography>
                    <Typography><strong>Address:</strong> {selectedIssue.user.address}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </>
        )}
      </Box>
    </Container>
  );
}