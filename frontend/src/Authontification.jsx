import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Authentication = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

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
          'Content-Type': 'application/json', // Ensure JSON content type
        },
      });

      if (response.data.token && response.data.enseignantId) {
        console.log('Login successful:', response.data);
        // Store token in localStorage or another secure place
        localStorage.setItem('authToken', response.data.token);
        navigate(`/HomeEnseignant/${response.data.enseignantId}`);
      } else {
        console.log('Authentication failed');
        alert('Authentication failed');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      // Display a more user-friendly message depending on the error response
      alert('Authentication error. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <button type="submit">Login</button>
    </form>
  );
};

export default Authentication;
