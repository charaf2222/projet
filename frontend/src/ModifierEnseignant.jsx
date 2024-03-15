import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModifierEnseignant = () => {
  const [enseignants, setEnseignants] = useState([]);
  const [selectedEnseignantId, setSelectedEnseignantId] = useState(null);
  const [updatedEnseignant, setUpdatedEnseignant] = useState({
    Nom: '',
    Prenom: '',
    Modules_En: [],
    // Add other fields as needed
  });

  const [modules, setModules] = useState([]);

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

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/Modules/');
        setModules(response.data);
      } catch (error) {
        console.error('Error fetching modules:', error);
        // Handle error, display a message, etc.
      }
    };

    fetchModules();
  }, []);

  useEffect(() => {
    const fetchEnseignantDetails = async () => {
      if (selectedEnseignantId) {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/Enseignant/${selectedEnseignantId}/`);
          setUpdatedEnseignant(response.data);
        } catch (error) {
          console.error('Error fetching enseignant details:', error);
          // Handle error, display a message, etc.
        }
      }
    };

    fetchEnseignantDetails();
  }, [selectedEnseignantId]);

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
    } catch (error) {
      console.error('Error deleting enseignant:', error);
      // Handle error, display a message, etc.
    }
  };

  const handleUpdate = async () => {
    if (!selectedEnseignantId) {
      console.error('No enseignant selected for update');
      // Handle the case where no enseignant is selected for update
      return;
    }

    try {
      await axios.put(`http://127.0.0.1:8000/api/Enseignant/${selectedEnseignantId}/`, updatedEnseignant);
      console.log('Enseignant updated successfully');
      // Handle success, such as updating the UI or showing a confirmation
    } catch (error) {
      console.error('Error updating enseignant:', error);
      // Handle error, display a message, etc.
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEnseignant((prevEnseignant) => ({
      ...prevEnseignant,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (moduleId) => {
    setUpdatedEnseignant((prevEnseignant) => {
      const updatedModules = prevEnseignant.Modules_En.includes(moduleId)
        ? prevEnseignant.Modules_En.filter((id) => id !== moduleId)
        : [...prevEnseignant.Modules_En, moduleId];

      return {
        ...prevEnseignant,
        Modules_En: updatedModules,
      };
    });
  };

  return (
    <div>
      <h2>Liste des Enseignants</h2>
      <ul>
        {enseignants.map((enseignant) => (
          <li key={enseignant.id}>
            <label>
              <input
                type="radio"
                name="enseignant"
                value={enseignant.id}
                onChange={() => {
                  setSelectedEnseignantId(enseignant.id);
                }}
              />
              {enseignant.Nom} {enseignant.Prenom}
            </label>
          </li>
        ))}
      </ul>

      {selectedEnseignantId && (
        <div>
          <h2>Modifier Enseignant</h2>
          <form>
            <label>
              Nom:
              <input
                type="text"
                name="Nom"
                value={updatedEnseignant.Nom}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label>
              Prenom:
              <input
                type="text"
                name="Prenom"
                value={updatedEnseignant.Prenom}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label>
              Modules:
              {modules.map((module) => (
                <label key={module.id}>
                  <input
                    type="checkbox"
                    name={module.id}
                    checked={updatedEnseignant.Modules_En.includes(module.id)}
                    onChange={() => handleCheckboxChange(module.id)}
                  />
                  {module.Nom}
                </label>
              ))}
            </label>
            {/* Add other fields as needed */}
            <br />
            <button type="button" onClick={handleUpdate}>
              Modifier Enseignant
            </button>
          </form>
        </div>
      )}

      <button onClick={handleDelete}>Supprimer Enseignant Sélectionné</button>
    </div>
  );
};

export default ModifierEnseignant;
