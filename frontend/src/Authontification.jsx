import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './components/styles.css'
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
      const response = await axios.post('http://127.0.0.1:8000/api/login/', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.token && response.data.enseignantId) {
        localStorage.setItem('authToken', response.data.token);
        navigate(`/HomeEnseignant/${response.data.enseignantId}`);
      } else {
        setError('Authentication failed');
      }
    } catch (error) {
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
        backgroundColor: '#f0f0f0'
      }}
    >
      <img src="3.png" alt="Lettre P" style={{ marginBottom: '4px', width: '130px', height: '130px', marginBottom: '30px' }} />



      <form onSubmit={handleSubmit} style={{ width: '300px', background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 3px 5px rgba(0,0,0,0.2)' }}>
        <TextField
          label="Nom d'utilisateur"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          fullWidth
          required
        />
        <TextField
          label="Mot de passe"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          fullWidth
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Connexion
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
