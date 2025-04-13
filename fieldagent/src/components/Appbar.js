import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box"; // Added Box for better alignment

const StyledAppBar = styled(AppBar)({
  flexGrow: 1,
});

const StyledToolbar = styled(Toolbar)({
  minHeight: "100px",
  paddingRight: 16, // Ensures right alignment
  paddingLeft: 16,  // Optional for spacing
  display: "flex",
  justifyContent: "space-between", // Ensures space between title & user name
});

export default function Appbar() {
  const navigate = useNavigate();
  const agentName = localStorage.getItem("agentName"); // Get agent name from localStorage
  const isLoggedIn = !!agentName; // Check if user is logged in
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
    localStorage.removeItem("agentId");
    localStorage.removeItem("agentName");
    navigate("/login");
    handleMenuClose();
  };

  return (
    <StyledAppBar position="static">
      <StyledToolbar>
        {/* Left: Title */}
        <Typography variant="h5">Field Agent Portal</Typography>

        {/* Right: Agent Name & Dropdown */}
        {isLoggedIn && (
          <Box display="flex" alignItems="center">
            <Typography
              variant="h6"
              sx={{ cursor: "pointer", color: "white", marginRight: 2 }} // Align properly
              onMouseEnter={handleMenuOpen}
            >
              {agentName}
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
