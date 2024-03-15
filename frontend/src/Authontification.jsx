import React, { useState } from 'react';
import axios from 'axios';

const Authontification = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('Request Data:', formData);
      const response = await axios.get('http://127.0.0.1:8000/api/Enseignant/', formData, {
        params: { action: 'login' },  // Add a parameter to specify the login action
      });

      
      console.log('Response Data:', response.data);

      // Save the token in localStorage
      localStorage.setItem('token', response.data.token);

      console.log('Login successful');

      // Redirect to another page using window.location
      window.location.href = '/Welcome';
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Error logging in. Please check the console for details.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" name="username" value={formData.username} onChange={handleChange} required />
      </label>
      <br />

      <label>
        Password:
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
      </label>
      <br />

      <button type="submit">Login</button>
    </form>
  );
};

export default Authontification;
