import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Appbar from "./components/Appbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import SubmitGrievance from "./components/SubmitGrievance";
import Dashboard from "./components/Dashboard"; // Import the new Dashboard component

const theme = createTheme();

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Appbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/submit-grievance" element={<SubmitGrievance />} />
          <Route path="/dashboard" element={<Dashboard />} /> {/* Added Dashboard route */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}