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
  Button 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [error, setError] = useState('');
  const agentId = localStorage.getItem("agentId");
  const agentName = localStorage.getItem("agentName");
  const navigate = useNavigate();

  // Fetch issues assigned to the field agent when the component mounts
  useEffect(() => {
    if (!agentId) {
      setError("Field agent not logged in. Please log in to view your dashboard.");
      return;
    }

    const fetchIssues = async () => {
      try {
        const response = await fetch(`http://localhost:8080/issue/agent/${agentId}`);
        if (response.ok) {
          const data = await response.json();
          setIssues(data);
          setFilteredIssues(data);
        } else {
          setError('Failed to fetch issues.');
        }
      } catch (err) {
        setError('Server error. Please try again later.');
      }
    };

    fetchIssues();
  }, [agentId]);

  // Fetch the agent's issue count (optional, for display purposes)
  const [issueCount, setIssueCount] = useState(0);
  useEffect(() => {
    const fetchIssueCount = async () => {
      try {
        const response = await fetch(`http://localhost:8080/field-agent/${agentId}`);
        if (response.ok) {
          const agent = await response.json();
          setIssueCount(agent.issueCount);
        }
      } catch (err) {
        console.error('Error fetching issue count:', err);
      }
    };

    if (agentId) {
      fetchIssueCount();
    }
  }, [agentId]);

  // Filter issues based on status
  useEffect(() => {
    if (statusFilter === 'All') {
      setFilteredIssues(issues);
    } else {
      setFilteredIssues(issues.filter(issue => issue.status === statusFilter));
    }
  }, [statusFilter, issues]);

  // Handle issue click to view details
  const handleViewGrievance = (issueId) => {
    navigate(`/view-grievance/${issueId}`);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Welcome to Your Dashboard, {agentName}!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Total Issues Assigned: {issueCount}
        </Typography>
        <Typography variant="body1" gutterBottom>
          View and manage your assigned grievances below.
        </Typography>

        {/* Status Filter */}
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
          </Select>
        </FormControl>

        {/* Error Message */}
        {error ? (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        ) : filteredIssues.length === 0 ? (
          <Typography sx={{ mt: 2 }}>
            No issues assigned for the selected status.
          </Typography>
        ) : (
          <Table sx={{ mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>Complaint Type</TableCell>
                <TableCell>Issue Description</TableCell>
                <TableCell>Preferred Resolution Date</TableCell>
                <TableCell>Preferred Resolution Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>User Name</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredIssues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell>{issue.complaintType}</TableCell>
                  <TableCell>{issue.issueDescription}</TableCell>
                  <TableCell>{issue.preferredResolutionDate}</TableCell>
                  <TableCell>{issue.preferredResolutionTime}</TableCell>
                  <TableCell>{issue.status}</TableCell>
                  <TableCell>{issue.user.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewGrievance(issue.id)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>
    </Container>
  );
}