import React, { useState } from 'react';
import { TextField, Container, Paper, Button, Box, Typography, MenuItem, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function SubmitGrievance() {
  const [complaintType, setComplaintType] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [preferredResolutionDate, setPreferredResolutionDate] = useState('');
  const [preferredResolutionTime, setPreferredResolutionTime] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [coordinates, setCoordinates] = useState('');
  const [message, setMessage] = useState('');
  const [locationType, setLocationType] = useState('current'); // Default to 'current'
  const navigate = useNavigate();

  const handleSetLocation = () => {
    if (!navigator.geolocation) {
      setMessage('Geolocation is not supported by your browser.');
      return;
    }

    console.log('Requesting GPS location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        if (lat > 90 || lat < -90 || lon > 180 || lon < -180) {
          setMessage('Invalid GPS coordinates received. Please try again.');
          console.log('Invalid GPS coords:', { lat, lon });
          return;
        }

        console.log('GPS location received:', { lat, lon });
        setLatitude(lat);
        setLongitude(lon);
        setCoordinates(`${lat.toString()},${lon.toString()}`);
        setMessage('GPS location detected. Please submit to update database.');
      },
      (error) => {
        console.error('Geolocation error:', error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setMessage('Location access denied. Please allow GPS.');
            break;
          case error.POSITION_UNAVAILABLE:
            setMessage('Location data unavailable. Please try again.');
            break;
          case error.TIMEOUT:
            setMessage('Request timed out. Please try again.');
            break;
          default:
            setMessage('Unable to fetch location: ' + error.message);
        }
      },
      { timeout: 10000 }
    );
  };

  const handleClearLocation = () => {
    setLatitude(null);
    setLongitude(null);
    setCoordinates('');
    setMessage('Location cleared.');
    console.log('Location cleared');
  };

  const handleManualLocation = () => {
    const [latInput, lonInput] = coordinates.trim().split(',');
    const lat = parseFloat(latInput);
    const lon = parseFloat(lonInput);

    console.log('Attempting to set manual location:', { coordinates, lat, lon });

    if (!latInput || !lonInput || isNaN(lat) || isNaN(lon) || lat > 90 || lat < -90 || lon > 180 || lon < -180) {
      setMessage('Invalid coordinates. Enter as "latitude,longitude" (e.g., "9.9252,78.1198" for Madurai).');
      setLatitude(null);
      setLongitude(null);
      console.log('Validation failed:', { coordinates, lat, lon });
      return;
    }

    setLatitude(lat);
    setLongitude(lon);
    setMessage(`Location updated to ${lat.toFixed(6)}, ${lon.toFixed(6)}. Please submit to update database.`);
    console.log('Location set successfully:', { latitude: lat, longitude: lon });
  };

  const handlePreviewLocation = () => {
    const [latInput, lonInput] = coordinates.trim().split(',');
    const lat = parseFloat(latInput);
    const lon = parseFloat(lonInput);

    console.log('Previewing location:', { coordinates, lat, lon });

    if (!latInput || !lonInput || isNaN(lat) || isNaN(lon) || lat > 90 || lat < -90 || lon > 180 || lon < -180) {
      setMessage('Invalid coordinates. Enter as "latitude,longitude" (e.g., "9.9252,78.1198").');
      console.log('Preview validation failed:', { coordinates, lat, lon });
      return;
    }

    setMessage('Previewing location in Google Maps.');
    const mapsUrl = `https://www.google.com/maps?q=${lat},${lon}&z=15`;
    window.open(mapsUrl, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const userId = localStorage.getItem("userId");

    if (!userId) {
      setMessage("User not logged in. Please log in to submit a grievance.");
      console.log('Submission failed: No userId');
      return;
    }

    if (latitude === null || longitude === null) {
      setMessage("Please set a location before submitting.");
      return;
    }

    const issue = {
      userId: parseInt(userId),
      complaintType,
      issueDescription,
      preferredResolutionDate,
      preferredResolutionTime,
      latitude,
      longitude,
    };

    try {
      console.log('Submitting issue:', issue);
      const response = await fetch('http://localhost:8080/issue/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issue),
      });

      if (response.ok) {
        setMessage("Issue submitted successfully!");
        console.log('Issue submitted:', issue);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setMessage("Failed to submit issue. Please try again.");
        console.log('Submission failed:', response.status, await response.text());
      }
    } catch (error) {
      console.error("Error submitting issue:", error);
      setMessage("Server error. Please try again later.");
    }
  };

  return (
    <Container>
      <Paper elevation={3} sx={{ padding: "50px 20px", width: 600, margin: "20px auto", textAlign: "center" }}>
        <h1 style={{ color: '#1976d2', marginBottom: '20px' }}>Submit a Grievance</h1>
        <Box component="form" display="flex" flexDirection="column" alignItems="center" onSubmit={handleSubmit}>
          <TextField
            select
            label="Complaint Type"
            variant="outlined"
            fullWidth
            value={complaintType}
            onChange={(e) => setComplaintType(e.target.value)}
            sx={{ mb: 2 }}
          >
            <MenuItem value="Road Damage">Road Damage</MenuItem>
            <MenuItem value="Waste Management">Waste Management</MenuItem>
            <MenuItem value="Water Supply">Water Supply</MenuItem>
            <MenuItem value="Electricity Issues">Electricity Issues</MenuItem>
            <MenuItem value="Public Transportation">Public Transportation</MenuItem>
            <MenuItem value="Noise Pollution">Noise Pollution</MenuItem>
            <MenuItem value="Air Pollution">Air Pollution</MenuItem>
            <MenuItem value="Sewage and Drainage">Sewage and Drainage</MenuItem>
            <MenuItem value="Street Lighting">Street Lighting</MenuItem>
            <MenuItem value="Illegal Construction">Illegal Construction</MenuItem>
            <MenuItem value="Parks and Recreation">Parks and Recreation</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
          <TextField
            label="Issue Description"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            value={issueDescription}
            onChange={(e) => setIssueDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Preferred Resolution Date"
            type="date"
            variant="outlined"
            fullWidth
            value={preferredResolutionDate}
            onChange={(e) => setPreferredResolutionDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Preferred Resolution Time"
            type="time"
            variant="outlined"
            fullWidth
            value={preferredResolutionTime}
            onChange={(e) => setPreferredResolutionTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <FormControl component="fieldset" sx={{ mb: 2, width: '100%' }}>
            <Typography sx={{ mb: 1 }}>Location Type</Typography>
            <RadioGroup
              row
              value={locationType}
              onChange={(e) => setLocationType(e.target.value)}
            >
              <FormControlLabel value="current" control={<Radio />} label="Grievance in Current Location" />
              <FormControlLabel value="different" control={<Radio />} label="Different Location" />
            </RadioGroup>
          </FormControl>
          {locationType === 'current' ? (
            <Box sx={{ mb: 2, width: '100%' }}>
              <Button variant="outlined" onClick={handleSetLocation} sx={{ mb: 1 }}>
                Set Location (GPS)
              </Button>
              {latitude !== null && longitude !== null && (
                <Typography sx={{ color: 'green', mt: 1 }}>
                  Location set to: {latitude.toFixed(6)}, {longitude.toFixed(6)}{' '}
                  <a
                    href={`https://www.google.com/maps?q=${latitude},${longitude}&z=15`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'inherit', textDecoration: 'underline' }}
                  >
                    (View on Map)
                  </a>
                </Typography>
              )}
            </Box>
          ) : (
            <Box sx={{ mb: 2, width: '100%' }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Button variant="outlined" onClick={handleSetLocation}>
                  Set Location (GPS)
                </Button>
                {latitude && longitude && (
                  <Button variant="outlined" color="secondary" onClick={handleClearLocation}>
                    Clear Location
                  </Button>
                )}
              </Box>
              <Typography sx={{ color: 'gray', mb: 1 }}>
                Paste coordinates as "latitude,longitude" (e.g., "9.9252,78.1198" for Madurai) from Google Maps, preview to check, then update.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                <TextField
                  label="Coordinates (latitude,longitude)"
                  variant="outlined"
                  value={coordinates}
                  onChange={(e) => setCoordinates(e.target.value)}
                  placeholder="e.g., 9.9252,78.1198"
                  fullWidth
                  sx={{ mb: 1 }}
                />
                <Button variant="outlined" onClick={handlePreviewLocation} sx={{ height: '56px' }}>
                  Preview Location
                </Button>
              </Box>
              <Button variant="outlined" onClick={handleManualLocation} sx={{ mb: 1 }}>
                Update Location
              </Button>
              {(latitude !== null && longitude !== null) ? (
                <Typography sx={{ color: 'green', mt: 1 }}>
                  Location set to: {latitude.toFixed(6)}, {longitude.toFixed(6)}{' '}
                  <a
                    href={`https://www.google.com/maps?q=${latitude},${longitude}&z=15`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'inherit', textDecoration: 'underline' }}
                  >
                    (View on Map)
                  </a>
                </Typography>
              ) : (
                <Typography sx={{ color: 'gray', mt: 1 }}>
                  No location set. Update after previewing.
                </Typography>
              )}
            </Box>
          )}
          <Button type="submit" variant="contained" sx={{ backgroundColor: '#1976d2', color: 'white', mt: 2 }}>
            Submit
          </Button>
          {message && (
            <Typography sx={{ color: message.includes('successfully') || message.includes('updated') || message.includes('cleared') ? 'green' : 'red', mt: 2 }}>
              {message}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
}