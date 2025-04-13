import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Tabs, 
  Tab, 
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
  TextField, 
  Grid, 
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [tab, setTab] = useState(0);
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [fieldAgents, setFieldAgents] = useState([]);
  const [filteredFieldAgents, setFilteredFieldAgents] = useState([]);
  const [reopenRequests, setReopenRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [complaintTypeFilter, setComplaintTypeFilter] = useState('');
  const [submissionStartDate, setSubmissionStartDate] = useState(null);
  const [submissionEndDate, setSubmissionEndDate] = useState(null);
  const [resolutionStartDate, setResolutionStartDate] = useState(null);
  const [resolutionEndDate, setResolutionEndDate] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');
  const [issuePage, setIssuePage] = useState(1);
  const [agentPage, setAgentPage] = useState(1);
  const [newAgentId, setNewAgentId] = useState('');
  const [error, setError] = useState('');
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("officerLoggedIn");
  if (!isLoggedIn) {
    navigate('/');
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const issuesResponse = await fetch('http://localhost:8080/issue/all');
        const agentsResponse = await fetch('http://localhost:8080/field-agent/all');
        const reopenResponse = await fetch('http://localhost:8080/issue/reopen-requests');
        if (issuesResponse.ok && agentsResponse.ok && reopenResponse.ok) {
          const issuesData = await issuesResponse.json();
          const agentsData = await agentsResponse.json();
          const reopenData = await reopenResponse.json();
          setIssues(issuesData);
          setFilteredIssues(issuesData);
          setFieldAgents(agentsData);
          setFilteredFieldAgents(agentsData);
          setReopenRequests(reopenData);
        } else {
          setError('Failed to fetch data.');
        }
      } catch (err) {
        setError('Server error. Please try again later.');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const applyFilters = async () => {
      try {
        const url = new URL('http://localhost:8080/issue/filter');
        if (statusFilter) url.searchParams.append('status', statusFilter);
        if (complaintTypeFilter) url.searchParams.append('complaintType', complaintTypeFilter);
        if (submissionStartDate) url.searchParams.append('submissionStartDate', submissionStartDate.toISOString().split('T')[0]);
        if (submissionEndDate) url.searchParams.append('submissionEndDate', submissionEndDate.toISOString().split('T')[0]);
        if (resolutionStartDate) url.searchParams.append('resolutionStartDate', resolutionStartDate.toISOString().split('T')[0]);
        if (resolutionEndDate) url.searchParams.append('resolutionEndDate', resolutionEndDate.toISOString().split('T')[0]);

        const response = await fetch(url);
        if (response.ok) {
          const filteredData = await response.json();
          setFilteredIssues(sortOrder === 'asc' ? 
            filteredData.sort((a, b) => new Date(a.submissionDate) - new Date(b.submissionDate)) : 
            filteredData.sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate)));
        } else {
          setError('Failed to apply filters.');
        }
      } catch (err) {
        setError('Server error during filtering.');
      }
    };
    applyFilters();
  }, [statusFilter, complaintTypeFilter, submissionStartDate, submissionEndDate, resolutionStartDate, resolutionEndDate, sortOrder]);

  const filterFieldAgents = () => {
    let filtered = [...fieldAgents];
    if (complaintTypeFilter) {
      filtered = filtered.filter(agent => agent.specialization === complaintTypeFilter);
    }
    setFilteredFieldAgents(filtered);
  };

  useEffect(() => {
    filterFieldAgents();
  }, [complaintTypeFilter]);

  const handleApproveReopen = async (requestId) => {
    if (!newAgentId) {
      alert("Please select a new agent.");
      return;
    }

    const request = reopenRequests.find(r => r.id === requestId);
    const previousAgent = fieldAgents.find(agent => agent.name === request.previousAgentName && request.previousAgentName !== "None");
    if (previousAgent && previousAgent.id === parseInt(newAgentId)) {
      alert("Cannot assign the same agent who previously handled this issue.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/issue/reopen/${requestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newAgentId })
      });

      if (response.ok) {
        setReopenRequests(prev => prev.filter(r => r.id !== requestId));
        setSelectedRequest(null);
        const issuesResponse = await fetch('http://localhost:8080/issue/all');
        const issuesData = await issuesResponse.json();
        setIssues(issuesData);
        setFilteredIssues(issuesData);
        alert("Issue reopened successfully with new agent.");
      } else {
        const errorText = await response.text();
        alert(`Failed to approve reopen request: ${errorText}`);
      }
    } catch (err) {
      alert("Error approving reopen request: " + err.message);
    }
  };

  const handleRejectReopen = async (requestId) => {
    if (!requestId || requestId === undefined) {
      console.error("Invalid requestId:", requestId);
      alert("Error: No valid request ID provided for rejection.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/issue/reopen/reject/${requestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setReopenRequests(prev => prev.filter(r => r.id !== requestId));
        setSelectedRequest(null);
        alert("Reopen request rejected successfully.");
      } else {
        const errorText = await response.text();
        console.error(`Reject failed with status ${response.status}: ${errorText}`);
        alert(`Failed to reject reopen request: ${errorText}`);
      }
    } catch (err) {
      console.error("Fetch error during rejection:", err);
      alert("Error rejecting reopen request: " + err.message);
    }
  };

  const issuePageCount = Math.ceil(filteredIssues.length / itemsPerPage);
  const agentPageCount = Math.ceil(filteredFieldAgents.length / itemsPerPage);
  const paginatedIssues = filteredIssues.slice((issuePage - 1) * itemsPerPage, issuePage * itemsPerPage);
  const paginatedAgents = filteredFieldAgents.slice((agentPage - 1) * itemsPerPage, agentPage * itemsPerPage);

  const complaintTypes = [
    "Road Damage", "Waste Management", "Water Supply", "Electricity Issues", 
    "Public Transportation", "Noise Pollution", "Air Pollution", "Sewage and Drainage", 
    "Street Lighting", "Illegal Construction", "Parks and Recreation", "Other"
  ];

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Municipal Officer Dashboard</Typography>
      <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} sx={{ mb: 2 }}>
        <Tab label="Issues" />
        <Tab label="Field Agents" />
        <Tab label="Reopen Requests" />
      </Tabs>

      {tab === 0 && (
        <Box>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth sx={{ minWidth: 200 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                  sx={{ height: 45 }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Assigned">Assigned</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Reopen Requested">Reopen Requested</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth sx={{ minWidth: 200 }}>
                <InputLabel>Complaint Type</InputLabel>
                <Select
                  value={complaintTypeFilter}
                  onChange={(e) => setComplaintTypeFilter(e.target.value)}
                  label="Complaint Type"
                  sx={{ height: 45 }}
                >
                  <MenuItem value="">All</MenuItem>
                  {complaintTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth sx={{ minWidth: 200 }}>
                <InputLabel>Sort by Submission Date</InputLabel>
                <Select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  label="Sort by Submission Date"
                  sx={{ height: 45 }}
                >
                  <MenuItem value="desc">Recent First</MenuItem>
                  <MenuItem value="asc">Oldest First</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={3}>
                <DatePicker
                  label="Submission Start Date"
                  value={submissionStartDate}
                  onChange={(newValue) => setSubmissionStartDate(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      sx={{ minWidth: 200, '& .MuiInputBase-root': { height: 45 } }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <DatePicker
                  label="Submission End Date"
                  value={submissionEndDate}
                  onChange={(newValue) => setSubmissionEndDate(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      sx={{ minWidth: 200, '& .MuiInputBase-root': { height: 45 } }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <DatePicker
                  label="Resolution Start Date"
                  value={resolutionStartDate}
                  onChange={(newValue) => setResolutionStartDate(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      sx={{ minWidth: 200, '& .MuiInputBase-root': { height: 45 } }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <DatePicker
                  label="Resolution End Date"
                  value={resolutionEndDate}
                  onChange={(newValue) => setResolutionEndDate(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      sx={{ minWidth: 200, '& .MuiInputBase-root': { height: 45 } }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
          {error ? (
            <Typography color="error">{error}</Typography>
          ) : filteredIssues.length === 0 ? (
            <Typography>No issues found.</Typography>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Complaint Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Submission Date</TableCell>
                    <TableCell>Preferred Resolution Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Assigned Agent</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedIssues.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell>{issue.id}</TableCell>
                      <TableCell>{issue.complaintType}</TableCell>
                      <TableCell>{issue.issueDescription}</TableCell>
                      <TableCell>{issue.submissionDate}</TableCell>
                      <TableCell>{issue.preferredResolutionDate}</TableCell>
                      <TableCell>{issue.status}</TableCell>
                      <TableCell>
                        {issue.assignedAgent ? issue.assignedAgent.name : "Unassigned"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          onClick={() => navigate(`/issue-details/${issue.id}`)}
                        >
                          View/Assign
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                count={issuePageCount}
                page={issuePage}
                onChange={(e, value) => setIssuePage(value)}
                sx={{ mt: 2 }}
              />
            </>
          )}
        </Box>
      )}

      {tab === 1 && (
        <Box>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ minWidth: 200 }}>
                <InputLabel>Specialization</InputLabel>
                <Select
                  value={complaintTypeFilter}
                  onChange={(e) => setComplaintTypeFilter(e.target.value)}
                  label="Specialization"
                  sx={{ height: 45 }}
                >
                  <MenuItem value="">All</MenuItem>
                  {complaintTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {filteredFieldAgents.length === 0 ? (
            <Typography>No field agents found.</Typography>
          ) : (
            <>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Specialization</TableCell>
                    <TableCell>Issue Count</TableCell>
                    <TableCell>Contact Number</TableCell>
                    <TableCell>Email</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedAgents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell>{agent.id}</TableCell>
                      <TableCell>{agent.name}</TableCell>
                      <TableCell>{agent.specialization}</TableCell>
                      <TableCell>{agent.issueCount}</TableCell>
                      <TableCell>{agent.contactNumber}</TableCell>
                      <TableCell>{agent.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                count={agentPageCount}
                page={agentPage}
                onChange={(e, value) => setAgentPage(value)}
                sx={{ mt: 2 }}
              />
            </>
          )}
        </Box>
      )}

      {tab === 2 && (
        <Box>
          {reopenRequests.length === 0 ? (
            <Typography>No reopen requests pending.</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Request ID</TableCell>
                  <TableCell>Issue ID</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Previous Agent</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reopenRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.id}</TableCell>
                    <TableCell>{request.issueId}</TableCell>
                    <TableCell>{request.userName}</TableCell>
                    <TableCell>{request.previousAgentName}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        onClick={() => setSelectedRequest(request)}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <Dialog open={!!selectedRequest} onClose={() => setSelectedRequest(null)}>
            <DialogTitle>Review Reopen Request #{selectedRequest?.id}</DialogTitle>
            <DialogContent>
              <img 
                src={`http://localhost:8080/issue/reopen-image/${selectedRequest?.id}`} 
                alt="Proof" 
                style={{ maxWidth: '100%', marginBottom: '16px' }} 
              />
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>New Agent</InputLabel>
                <Select
                  value={newAgentId}
                  onChange={(e) => setNewAgentId(e.target.value)}
                  label="New Agent"
                >
                  <MenuItem value="">Select Agent</MenuItem>
                  {fieldAgents
                    .filter(agent => {
                      const previousAgent = fieldAgents.find(a => a.name === selectedRequest?.previousAgentName && selectedRequest?.previousAgentName !== "None");
                      return !previousAgent || agent.id !== previousAgent.id;
                    })
                    .map(agent => (
                      <MenuItem key={agent.id} value={agent.id}>
                        {agent.name} ({agent.specialization})
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedRequest(null)}>Cancel</Button>
              <Button 
                variant="outlined" 
                color="error"
                onClick={() => handleRejectReopen(selectedRequest?.id)}
              >
                Reject
              </Button>
              <Button 
                variant="contained" 
                onClick={() => handleApproveReopen(selectedRequest?.id)}
              >
                Approve & Reopen
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </Container>
  );
}