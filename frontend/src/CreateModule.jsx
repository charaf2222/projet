// CreateModule.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateModule = ({ onCreateOrUpdate, moduleId }) => {
  const [nom, setNom] = useState('');
  const [statut, setStatut] = useState('td');  // Default value

  useEffect(() => {
    if (moduleId) {
      axios.get(`http://127.0.0.1:8000/api/Modules/${moduleId}/`)
        .then(response => {
          const moduleData = response.data;
          setNom(moduleData.Nom);
          setStatut(moduleData.Statut);
        })
        .catch(error => {
          console.error('Error fetching module data:', error);
        });
    }
  }, [moduleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = moduleId
      ? `http://127.0.0.1:8000/api/Modules/${moduleId}/`
      : 'http://127.0.0.1:8000/api/Modules/';

    try {
      const response = await axios({
        method: moduleId ? 'PUT' : 'POST',
        url: apiUrl,
        data: {
          Nom: nom,
          Statut: statut,
        },
      });

      console.log('Module', moduleId ? 'updated' : 'created', 'successfully:', response.data);
      if (onCreateOrUpdate) {
        onCreateOrUpdate();
      }
      // Handle success, redirect or update UI as needed
    } catch (error) {
      console.error('Error', moduleId ? 'updating' : 'creating', 'module:', error);
      // Handle error, show error message, etc.
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nom:
        <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} />
      </label>
      <br />
      <label>
        Statut:
        <select value={statut} onChange={(e) => setStatut(e.target.value)}>
          <option value="td">TD</option>
          <option value="tp">TP</option>
        </select>
      </label>
      <br />
      <button type="submit">{moduleId ? 'Update Module' : 'Create Module'}</button>
    </form>
  );
};

export default CreateModule;
