import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { TextField, Container, Paper, Button, Box } from '@mui/material';

const useStyles = makeStyles(() => ({
  paperStyle: {
    padding: '50px 20px',
    width: 600,
    margin: '20px auto',
    textAlign: 'center',
  },
  buttonStyle: {
    backgroundColor: '#1976d2',
    color: 'white',
    '&:hover': {
      backgroundColor: '#125aa1',
    },
  },
  studentList: {
    textAlign: 'center',
  },
  studentCard: {
    margin: '10px auto',
    padding: '15px',
    width: '80%',
    textAlign: 'center',
  },
}));

export default function Student() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [students, setStudents] = useState([]);
  const classes = useStyles();

  const handleClick = (e) => {
    e.preventDefault();
    const student = { name, address };
    console.log(student);
    fetch('http://localhost:8080/student/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    }).then(() => {
      console.log('New Student added');
    });
  };

  useEffect(() => {
    fetch('http://localhost:8080/student/getAll')
      .then((res) => res.json())
      .then((result) => {
        setStudents(result);
      });
  }, []);

  return (
    <Container>
      <Paper elevation={3} className={classes.paperStyle}>
        <h1 style={{ color: '#1976d2', marginBottom: '20px' }}>Add Student</h1>
        <Box display="flex" flexDirection="column" alignItems="center">
          <TextField
            label="Student Name"
            variant="outlined"
            fullWidth
            value={name}
            sx={{ mb: 2 }} // Adds margin-bottom for spacing
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Student Address"
            variant="outlined"
            fullWidth
            value={address}
            sx={{ mb: 2 }} // Adds margin-bottom for spacing
            onChange={(e) => setAddress(e.target.value)}
          />
          <Button
            variant="contained"
            className={classes.buttonStyle}
            sx={{ mt: 2 }} // Adds margin-top for spacing
            onClick={handleClick}
          >
            Submit
          </Button>
        </Box>
      </Paper>

      <h1 className={classes.studentList}>Students</h1>

      <Paper elevation={3} className={classes.paperStyle}>
        {students.map((student) => (
          <Paper elevation={6} className={classes.studentCard} key={student.id}>
            <strong>Id:</strong> {student.id}
            <br />
            <strong>Name:</strong> {student.name}
            <br />
            <strong>Address:</strong> {student.address}
          </Paper>
        ))}
      </Paper>
    </Container>
  );
}
