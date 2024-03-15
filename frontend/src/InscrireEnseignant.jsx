// InscrireEnseignant.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const InscrireEnseignant = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    Nom: '',
    Prenom: '',
    Modules_En: [],
  });

  const [modulesList, setModulesList] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/Modules/')
      .then(response => {
        setModulesList(response.data);
      })
      .catch(error => {
        console.error('Error fetching Modules:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        Modules_En: checked
          ? [...prevFormData.Modules_En, Number(name)] // Use Number() to convert to ID
          : prevFormData.Modules_En.filter((moduleId) => moduleId !== Number(name)),
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      
      console.log('Request Data:', formData);
      const response = await axios.post('http://127.0.0.1:8000/api/Enseignant/', formData);
      console.log('Response Data:', response.data);
      const navigate = useNavigate();
      navigate('/Authontification');
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Error registering user. Please check the console for details.');
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

      <label>
        Nom:
        <input type="text" name="Nom" value={formData.Nom} onChange={handleChange} />
      </label>
      <br />

      <label>
        Prenom:
        <input type="text" name="Prenom" value={formData.Prenom} onChange={handleChange} />
      </label>
      <br />
     
      <label>
        Modules:
        {modulesList.map(module => (
          <label key={module.id}>
            <input
              type="checkbox"
              name={module.id}  // Use module ID as the name
              checked={formData.Modules_En.includes(module.id)}
              onChange={handleCheckboxChange}
            />
            {module.Nom}
          </label>
        ))}
      </label>
      <br />

      <button type="submit">Sign Up</button>
    </form>
  );
};

export default InscrireEnseignant;
