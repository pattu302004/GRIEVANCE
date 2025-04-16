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
  Button,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [tab, setTab] = useState(0);
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [fieldAgents, setFieldAgents] = useState([]);
  const [filteredFieldAgents, setFilteredFieldAgents] = useState([]);
  const [reopenRequests, setReopenRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusFilter, setStatusFilter] = useState(''); // Initially empty to show Pending and Reopen
  const [sortOrder, setSortOrder] = useState('desc');
  const [issuePage, setIssuePage] = useState(1);
  const [agentPage, setAgentPage] = useState(1);
  const [newAgentId, setNewAgentId] = useState('');
  const [error, setError] = useState('');
  const itemsPerPage = 10; // Increased to show more rows
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
          setFilteredIssues(issuesData.filter(issue => issue.status === 'Pending' || issue.status === 'Reopen Requested'));
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

        const response = await fetch(url);
        if (response.ok) {
          const filteredData = await response.json();
          setFilteredIssues(
            sortOrder === 'asc'
              ? filteredData.sort((a, b) => new Date(a.submissionDate) - new Date(b.submissionDate))
              : filteredData.sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate))
          );
        } else {
          setError('Failed to apply filters.');
        }
      } catch (err) {
        setError('Server error during filtering.');
      }
    };
    applyFilters();
  }, [statusFilter, sortOrder]);

  const filterFieldAgents = () => {
    let filtered = [...fieldAgents];
    setFilteredFieldAgents(filtered); // No specialization filter for now
  };

  useEffect(() => {
    filterFieldAgents();
  }, [filterFieldAgents]);

  const handleApproveReopen = async (requestId) => {
    if (!newAgentId) {
      alert("Please select a new agent.");
      return;
    }

    const request = reopenRequests.find((r) => r.id === requestId);
    const previousAgent = fieldAgents.find(
      (agent) => agent.name === request.previousAgentName && request.previousAgentName !== "None"
    );
    if (previousAgent && previousAgent.id === parseInt(newAgentId)) {
      alert("Cannot assign the same agent who previously handled this issue.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/issue/reopen/${requestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newAgentId }),
      });

      if (response.ok) {
        setReopenRequests((prev) => prev.filter((r) => r.id !== requestId));
        setSelectedRequest(null);
        const issuesResponse = await fetch('http://localhost:8080/issue/all');
        const issuesData = await issuesResponse.json();
        setIssues(issuesData);
        setFilteredIssues(issuesData.filter(issue => issue.status === 'Pending' || issue.status === 'Reopen Requested'));
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
        setReopenRequests((prev) => prev.filter((r) => r.id !== requestId));
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

  const handleViewInMap = (latitude, longitude) => {
    if (latitude && longitude && !isNaN(latitude) && !isNaN(longitude)) {
      const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=15`;
      window.open(mapsUrl, '_blank');
    } else {
      alert('No valid location data available for this issue.');
    }
  };

  const handleMarkUrgent = (issueId) => {
    navigate(`/issue-details/${issueId}?urgent=true`);
  };

  const handleViewAssign = (issueId, urgent = false) => {
    const status = urgent ? 'urgent' : 'normal';
    navigate(`/issue-details/${issueId}?status=${status}`);
  };

  const issuePageCount = Math.ceil(filteredIssues.length / itemsPerPage);
  const agentPageCount = Math.ceil(filteredFieldAgents.length / itemsPerPage);
  const paginatedIssues = filteredIssues.slice((issuePage - 1) * itemsPerPage, issuePage * itemsPerPage);
  const paginatedAgents = filteredFieldAgents.slice((agentPage - 1) * itemsPerPage, agentPage * itemsPerPage);

  // Calculate counts
  const pendingCount = issues.filter(issue => issue.status === 'Pending').length;
  const reopenCount = issues.filter(issue => issue.status === 'Reopen Requested').length;
  const allCount = issues.length;

  return (
    <Container sx={{ mt: 0, padding: 0, maxWidth: '100%', height: '100vh', display: 'flex', flexDirection: 'row' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: '300px',
          backgroundColor: '#f5f5f5',
          borderRight: '1px solid #e0e0e0',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          boxSizing: 'border-box',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1000, // Ensure sidebar stays on top
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 'bold' }}>
          Municipal Officer Portal
        </Typography>
        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          orientation="vertical"
          sx={{ borderRight: 0, mb: 2 }}
        >
          <Tab label="ISSUES" />
          <Tab label="FIELD AGENTS" />
          <Tab label="REOPEN REQUESTS" />
        </Tabs>
        {tab === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1 }}>
            <Button
              variant={statusFilter === 'Pending' ? 'contained' : 'outlined'}
              onClick={() => setStatusFilter('Pending')}
              fullWidth
              sx={{ justifyContent: 'flex-start', fontSize: '1.1rem', py: 1 }}
            >
              PENDING ({pendingCount})
            </Button>
            <Button
              variant={statusFilter === 'Assigned' ? 'contained' : 'outlined'}
              onClick={() => setStatusFilter('Assigned')}
              fullWidth
              sx={{ justifyContent: 'flex-start', fontSize: '1.1rem', py: 1 }}
            >
              ASSIGNED
            </Button>
            <Button
              variant={statusFilter === 'Completed' ? 'contained' : 'outlined'}
              onClick={() => setStatusFilter('Completed')}
              fullWidth
              sx={{ justifyContent: 'flex-start', fontSize: '1.1rem', py: 1 }}
            >
              COMPLETED
            </Button>
            <Button
              variant={statusFilter === 'Reopen Requested' ? 'contained' : 'outlined'}
              onClick={() => setStatusFilter('Reopen Requested')}
              fullWidth
              sx={{ justifyContent: 'flex-start', fontSize: '1.1rem', py: 1 }}
            >
              REOPEN REQUESTED ({reopenCount})
            </Button>
            <Button
              variant={statusFilter === '' ? 'contained' : 'outlined'}
              onClick={() => setStatusFilter('')}
              fullWidth
              sx={{ justifyContent: 'flex-start', fontSize: '1.1rem', py: 1 }}
            >
              ALL ({allCount})
            </Button>
            <Button
              variant={sortOrder === 'asc' ? 'contained' : 'outlined'}
              onClick={() => setSortOrder('asc')}
              fullWidth
              sx={{ justifyContent: 'flex-start', fontSize: '1.1rem', py: 1 }}
            >
              OLDEST FIRST
            </Button>
            <Button
              variant={sortOrder === 'desc' ? 'contained' : 'outlined'}
              onClick={() => setSortOrder('desc')}
              fullWidth
              sx={{ justifyContent: 'flex-start', fontSize: '1.1rem', py: 1 }}
            >
              RECENT FIRST
            </Button>
          </Box>
        )}
      </Box>
      {/* Main Content */}
      <Box sx={{ flex: 1, minWidth: 0, ml: '300px', p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Box sx={{ maxWidth: '1200px', width: '100%', paddingTop: '20px' }}>
          <Typography variant="h4" gutterBottom align="center">Municipal Officer Dashboard</Typography>
          {tab === 0 && (
            <Box>
              {error ? (
                <Typography color="error" sx={{ fontSize: '1.2rem', textAlign: 'center' }}>{error}</Typography>
              ) : filteredIssues.length === 0 ? (
                <Typography sx={{ fontSize: '1.2rem', textAlign: 'center' }}>No issues found.</Typography>
              ) : (
                <>
                  <Table sx={{ minWidth: 800, maxHeight: '600px', overflowY: 'auto', mt: 2 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontSize: '1.2rem' }}>ID</TableCell>
                        <TableCell sx={{ fontSize: '1.2rem' }}>Complaint Type</TableCell>
                        <TableCell sx={{ fontSize: '1.2rem' }}>User</TableCell>
                        <TableCell sx={{ fontSize: '1.2rem' }}>Submission Date</TableCell>
                        <TableCell sx={{ fontSize: '1.2rem' }}>Preferred Resolution Date</TableCell>
                        <TableCell sx={{ fontSize: '1.2rem' }}>Latitude</TableCell>
                        <TableCell sx={{ fontSize: '1.2rem' }}>Longitude</TableCell>
                        <TableCell sx={{ fontSize: '1.2rem' }}>Status</TableCell>
                        <TableCell sx={{ fontSize: '1.2rem' }}>Assigned Agent</TableCell>
                        <TableCell sx={{ fontSize: '1.2rem' }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedIssues.map((issue) => (
                        <TableRow key={issue.id}>
                          <TableCell sx={{ fontSize: '1.2rem' }}>{issue.id}</TableCell>
                          <TableCell sx={{ fontSize: '1.2rem' }}>{issue.complaintType}</TableCell>
                          <TableCell sx={{ fontSize: '1.2rem' }}>{issue.userName || 'N/A'}</TableCell>
                          <TableCell sx={{ fontSize: '1.2rem' }}>{issue.submissionDate}</TableCell>
                          <TableCell sx={{ fontSize: '1.2rem' }}>{issue.preferredResolutionDate || 'N/A'}</TableCell>
                          <TableCell sx={{ fontSize: '1.2rem' }}>{issue.latitude ? issue.latitude.toFixed(6) : 'N/A'}</TableCell>
                          <TableCell sx={{ fontSize: '1.2rem' }}>{issue.longitude ? issue.longitude.toFixed(6) : 'N/A'}</TableCell>
                          <TableCell sx={{ fontSize: '1.2rem' }}>
                            {issue.status}
                            {issue.urgent && (
                              <Typography component="span" sx={{ color: 'red', ml: 1, fontSize: '1.1rem' }}>
                                (Urgent - Resolve within 24h)
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell sx={{ fontSize: '1.2rem' }}>
                            {issue.assignedAgent ? issue.assignedAgent.name : "Unassigned"}
                          </TableCell>
                          <TableCell sx={{ fontSize: '1.2rem' }}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                variant="outlined"
                                onClick={() => handleViewAssign(issue.id, issue.urgent)}
                                sx={{ fontSize: '1.1rem', whiteSpace: 'nowrap' }}
                              >
                                VIEW/ASSIGN
                              </Button>
                              {issue.latitude && issue.longitude && (
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  onClick={() => handleViewInMap(issue.latitude, issue.longitude)}
                                  sx={{ fontSize: '1.1rem', whiteSpace: 'nowrap' }}
                                >
                                  View in Map
                                </Button>
                              )}
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleMarkUrgent(issue.id)}
                                disabled={issue.status !== 'Pending' && issue.status !== 'Reopen Requested'}
                                sx={{ fontSize: '1.1rem', whiteSpace: 'nowrap' }}
                              >
                                URGENT
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Pagination
                    count={issuePageCount}
                    page={issuePage}
                    onChange={(e, value) => setIssuePage(value)}
                    sx={{ mt: 2, fontSize: '1.2rem', display: 'flex', justifyContent: 'center' }}
                  />
                </>
              )}
            </Box>
          )}
          {tab === 1 && (
            <Box sx={{ maxWidth: '1200px', width: '100%' }}>
              {filteredFieldAgents.length === 0 ? (
                <Typography sx={{ fontSize: '1.2rem', textAlign: 'center' }}>No field agents found.</Typography>
              ) : (
                <>
                  <Table sx={{ minWidth: 800, maxHeight: '600px', overflowY: 'auto', mt: 2 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontSize: '1.2rem' }}>ID</TableCell>
                        <TableCell sx={{ fontSize: '1.2rem' }}>Name</TableCell>
                        <TableCell sx={{ fontSize: '1.2rem' }}>Specialization</TableCell>
                        <TableCell sx={{ fontSize: '1.2rem' }}>Issue Count</TableCell>
                        <TableCell sx={{ fontSize: '1.2rem' }}>Contact Number</TableCell>
                        <TableCell sx={{ fontSize: '1.2rem' }}>Email</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedAgents.map((agent) => (
                        <TableRow key={agent.id}>
                          <TableCell sx={{ fontSize: '1.2rem' }}>{agent.id}</TableCell>
                          <TableCell sx={{ fontSize: '1.2rem' }}>{agent.name}</TableCell>
                          <TableCell sx={{ fontSize: '1.2rem' }}>{agent.specialization}</TableCell>
                          <TableCell sx={{ fontSize: '1.2rem' }}>{agent.issueCount}</TableCell>
                          <TableCell sx={{ fontSize: '1.2rem' }}>{agent.contactNumber}</TableCell>
                          <TableCell sx={{ fontSize: '1.2rem' }}>{agent.email}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Pagination
                    count={agentPageCount}
                    page={agentPage}
                    onChange={(e, value) => setAgentPage(value)}
                    sx={{ mt: 2, fontSize: '1.2rem', display: 'flex', justifyContent: 'center' }}
                  />
                </>
              )}
            </Box>
          )}
          {tab === 2 && (
            <Box sx={{ maxWidth: '1200px', width: '100%' }}>
              {reopenRequests.length === 0 ? (
                <Typography sx={{ fontSize: '1.2rem', textAlign: 'center' }}>No reopen requests pending.</Typography>
              ) : (
                <Table sx={{ minWidth: 800, maxHeight: '600px', overflowY: 'auto', mt: 2 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: '1.2rem' }}>Request ID</TableCell>
                      <TableCell sx={{ fontSize: '1.2rem' }}>Issue ID</TableCell>
                      <TableCell sx={{ fontSize: '1.2rem' }}>User</TableCell>
                      <TableCell sx={{ fontSize: '1.2rem' }}>Previous Agent</TableCell>
                      <TableCell sx={{ fontSize: '1.2rem' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reopenRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell sx={{ fontSize: '1.2rem' }}>{request.id}</TableCell>
                        <TableCell sx={{ fontSize: '1.2rem' }}>{request.issueId}</TableCell>
                        <TableCell sx={{ fontSize: '1.2rem' }}>{request.userName}</TableCell>
                        <TableCell sx={{ fontSize: '1.2rem' }}>{request.previousAgentName}</TableCell>
                        <TableCell sx={{ fontSize: '1.2rem' }}>
                          <Button
                            variant="outlined"
                            onClick={() => setSelectedRequest(request)}
                            sx={{ fontSize: '1.1rem' }}
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
                <DialogTitle sx={{ fontSize: '1.3rem' }}>Review Reopen Request #{selectedRequest?.id}</DialogTitle>
                <DialogContent>
                  <img
                    src={`http://localhost:8080/issue/reopen-image/${selectedRequest?.id}`}
                    alt="Proof"
                    style={{ maxWidth: '100%', marginBottom: '16px' }}
                  />
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel sx={{ fontSize: '1.2rem' }}>New Agent</InputLabel>
                    <Select
                      value={newAgentId}
                      onChange={(e) => setNewAgentId(e.target.value)}
                      label="New Agent"
                      sx={{ fontSize: '1.2rem' }}
                    >
                      <MenuItem value="" sx={{ fontSize: '1.2rem' }}>Select Agent</MenuItem>
                      {fieldAgents
                        .filter((agent) => {
                          const previousAgent = fieldAgents.find(
                            (a) => a.name === selectedRequest?.previousAgentName && selectedRequest?.previousAgentName !== "None"
                          );
                          return !previousAgent || agent.id !== previousAgent.id;
                        })
                        .map((agent) => (
                          <MenuItem key={agent.id} value={agent.id} sx={{ fontSize: '1.2rem' }}>
                            {agent.name} ({agent.specialization})
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setSelectedRequest(null)} sx={{ fontSize: '1.2rem' }}>Cancel</Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleRejectReopen(selectedRequest?.id)}
                    sx={{ fontSize: '1.2rem' }}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleApproveReopen(selectedRequest?.id)}
                    sx={{ fontSize: '1.2rem' }}
                  >
                    Approve & Reopen
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
}