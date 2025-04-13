import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Appbar from './components/Appbar';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import ViewGrievance from './components/ViewGrievance';

const theme = createTheme();

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Appbar />
        <Routes>
          <Route path="/" element={<Home />} /> {/* Fixed: Render Home component instead of Appbar */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/view-grievance/:id" element={<ViewGrievance />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}