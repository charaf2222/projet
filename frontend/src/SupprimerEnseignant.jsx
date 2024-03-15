import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SupprimerEnseignant = () => {
  const [enseignants, setEnseignants] = useState([]);
  const [selectedEnseignantId, setSelectedEnseignantId] = useState(null);

  useEffect(() => {
    const fetchEnseignants = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/Enseignant/');
        setEnseignants(response.data);
      } catch (error) {
        console.error('Error fetching enseignants:', error);
        // Handle error, display a message, etc.
      }
    };

    fetchEnseignants();
  }, []);

  const handleDelete = async () => {
    if (!selectedEnseignantId) {
      console.error('No enseignant selected for deletion');
      // Handle the case where no enseignant is selected
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:8000/api/Enseignant/${selectedEnseignantId}/`);
      console.log('Enseignant deleted successfully');
      // Handle success, such as updating the UI or redirecting
      window.location.href = '/SupprimerEnseignant';
    } catch (error) {
      console.error('Error deleting enseignant:', error);
      // Handle error, display a message, etc.
    }
  };

  return (
    <div>
      <h2>Liste des Enseignants</h2>
      <ul>
        {enseignants.map(enseignant => (
          <li key={enseignant.id}>
            <label>
              <input
                type="radio"
                name="enseignant"
                value={enseignant.id}
                onChange={() => setSelectedEnseignantId(enseignant.id)}
              />
              Username:{enseignant.username} Nom:{enseignant.Nom} Prenom:{enseignant.Prenom}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleDelete}>Supprimer Enseignant Sélectionné</button>
    </div>
  );
};

export default SupprimerEnseignant;
