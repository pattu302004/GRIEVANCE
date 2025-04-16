import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Appbar from './Appbar';
import Login from './Login';
import Dashboard from './Dashboard';
import IssueDetails from './IssueDetails';

const theme = createTheme();

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Grid container direction="column" sx={{ height: '100vh' }}>
          {/* Appbar at the top */}
          <Grid item>
            <Appbar />
          </Grid>

          {/* Main content fills remaining space */}
          <Grid item xs sx={{ overflow: 'auto' }}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/issue-details/:id" element={<IssueDetails />} />
            </Routes>
          </Grid>
        </Grid>
      </Router>
    </ThemeProvider>
  );
}
