import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const StyledAppBar = styled(AppBar)({
  flexGrow: 1,
});

const StyledToolbar = styled(Toolbar)({
  minHeight: "100px",
});

export default function Appbar() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName"); // Get the user's name from localStorage
  const [anchorElUser, setAnchorElUser] = useState(null); // State for user dropdown menu (right side)
  const [anchorElMenu, setAnchorElMenu] = useState(null); // State for menu icon dropdown (left side)

  // Handlers for user dropdown (right side)
  const handleUserMenuOpen = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorElUser(null);
  };

  const handleDashboard = () => {
    navigate("/dashboard");
    handleUserMenuClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("userId"); // Clear user ID
    localStorage.removeItem("userName"); // Clear user name
    navigate("/login");
    handleUserMenuClose();
  };

  // Handlers for menu icon dropdown (left side)
  const handleMenuIconOpen = (event) => {
    setAnchorElMenu(event.currentTarget);
  };

  const handleMenuIconClose = () => {
    setAnchorElMenu(null);
  };

  const handleSubmitGrievance = () => {
    navigate("/submit-grievance");
    handleMenuIconClose();
  };

  return (
    <StyledAppBar position="static">
      <StyledToolbar>
        <Grid container alignItems="center">
          {/* Left: Menu Icon with Dropdown */}
          <Grid item xs={2}>
            <IconButton 
              edge="start" 
              color="inherit" 
              aria-label="menu"
              onClick={handleMenuIconOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElMenu}
              open={Boolean(anchorElMenu)}
              onClose={handleMenuIconClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              {userName ? (
                <MenuItem onClick={handleSubmitGrievance}>Submit Grievance</MenuItem>
              ) : (
                <MenuItem disabled>Please log in to submit a grievance</MenuItem>
              )}
            </Menu>
          </Grid>

          {/* Center: Title */}
          <Grid item xs={8} container justifyContent="center">
            <Typography variant="h5">Urban Grievance Portal</Typography>
          </Grid>

          {/* Right: User Name or Register/Login Button */}
          <Grid item xs={2} container justifyContent="flex-end">
            {userName ? (
              <>
                <Typography
                  variant="h6"
                  sx={{ cursor: "pointer", color: "white" }}
                  onMouseEnter={handleUserMenuOpen}
                >
                  {userName}
                </Typography>
                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleUserMenuClose}
                  onMouseLeave={handleUserMenuClose}
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
              </>
            ) : (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "white",
                  color: "blue",
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
                onClick={() => navigate("/login")}
              >
                Register / Login
              </Button>
            )}
          </Grid>
        </Grid>
      </StyledToolbar>
    </StyledAppBar>
  );
}