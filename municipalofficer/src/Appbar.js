import React, { useState } from 'react';
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box"; 
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";

const StyledAppBar = styled(AppBar)({
  flexGrow: 1,
});

const StyledToolbar = styled(Toolbar)({
  minHeight: "100px",
  display: "flex",
  justifyContent: "space-between", // Ensures title on left, officer name on right
  paddingRight: 16, // Padding to avoid sticking to the edge
  paddingLeft: 16,
});

export default function Appbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("officerLoggedIn") === "true"; // Ensuring proper check
  const officerName = "admin"; // Hardcoded since there is only one municipal officer
  const [anchorEl, setAnchorEl] = useState(null); // State for dropdown menu

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDashboard = () => {
    navigate("/dashboard");
    handleMenuClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("officerLoggedIn");
    navigate("/");
    handleMenuClose();
  };

  return (
    <StyledAppBar position="static">
      <StyledToolbar>
        {/* Left: Title */}
        <Typography variant="h5">Municipal Officer Portal</Typography>

        {/* Right: Show officer name & dropdown only if logged in */}
        {isLoggedIn && (
          <Box display="flex" alignItems="center">
            <Typography
              variant="h6"
              sx={{ cursor: "pointer", color: "white", marginRight: 2 }} // Right-aligned
              onMouseEnter={handleMenuOpen}
            >
              {officerName}
            </Typography>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              onMouseLeave={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={handleDashboard}>Dashboard</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        )}
      </StyledToolbar>
    </StyledAppBar>
  );
}
