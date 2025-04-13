import React from "react";
import { Box, Grid, Typography } from "@mui/material";

export default function Home() {
  return (
    <Box sx={{ height: "calc(100vh - 80px)", overflow: "hidden", display: "flex", alignItems: "center" }}>
      <Grid container sx={{ height: "100%" }}>

        {/* Left Side: Full Height Image */}
        <Grid 
          item 
          xs={5} 
          sx={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center",
          }}
        >
          <img
            src={require("../image.png")}
            alt="Urban Issues"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </Grid>

        {/* Right Side: Text (Closer to Image) */}
        <Grid
          item
          xs={7} 
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: "20px", // Adjusted to bring text closer
            paddingRight: "40px", // Prevents text from touching screen edges
          }}
        >
          <Typography variant="h3" gutterBottom>
            Welcome to the Urban Grievance Portal
          </Typography>
          <Typography variant="h5" gutterBottom>
            A platform for citizens to report and track urban issues. We ensure your grievances
            reach the right authorities for quick resolution.
          </Typography>
          <Typography variant="h6" paragraph>
            Our system connects you directly with municipal bodies to handle issues like road damage, 
            waste management, water supply problems, and more. Stay updated on your complaints and help 
            make our cities better.
          </Typography>
          <Typography variant="h6">
            Join us in creating a better urban environment by reporting and tracking grievances in real time.
          </Typography>
        </Grid>

      </Grid>
    </Box>
  );
}
