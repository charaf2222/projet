import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';

const Authentication = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Form data:", formData);
      const response = await axios.post('http://127.0.0.1:8000/api/login/', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.token && response.data.enseignantId) {
        console.log('Login successful:', response.data);
        localStorage.setItem('authToken', response.data.token);
        navigate(`/HomeEnseignant/${response.data.enseignantId}`);
      } else {
        console.log('Authentication failed');
        setError('Authentication failed');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      setError('Authentication error. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        Connexion
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 360 }}>
        <TextField
          label="Username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Ce Connecter
        </Button>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </form>
    </Box>
  );
};

export default Authentication;
