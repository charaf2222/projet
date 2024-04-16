import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './styles.css';
import TableuDesPresences from './TableuDesPresences'; // Assurez-vous que le chemin d'importation est correct

function StartSession() {
  const [seanceData, setSeanceData] = useState({
    ID_Groupe: '',
    ID_Module: '',
    ID_Enseignant: '',
    Date: '',
    Heure: '',
    Salle: ''
  });

  const [enseignantDetail, setEnseignantDetail] = useState({ Nom: '', Prenom: '' });
  const [groupes, setGroupes] = useState([]);
  const [modules, setModules] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const heuresChoices = ['8H30-10H', '10H-11H30', '11H30-13H', '14H-15H30', '15H30-17H'];

  let { enseignantId } = useParams();

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/Groupe/')
      .then(response => response.json())
      .then(data => setGroupes(data))
      .catch(error => console.error('Erreur de chargement des groupes:', error));

    fetch(`http://127.0.0.1:8000/api/Enseignant/${enseignantId}/`)
      .then(response => response.json())
      .then(data => {
        setSeanceData(prevState => ({
          ...prevState,
          ID_Enseignant: data.id,
        }));
        setEnseignantDetail({ Nom: data.Nom, Prenom: data.Prenom });

        const fetchModulesPromises = data.Modules_En.map(moduleId => 
          fetch(`http://127.0.0.1:8000/api/Modules/${moduleId}/`).then(response => response.json())
        );

        Promise.all(fetchModulesPromises)
          .then(modulesDetails => {
            setModules(modulesDetails);
          })
          .catch(error => console.error('Erreur lors du chargement des modules:', error));
      })
      .catch(error => console.error('Erreur de chargement de l’enseignant:', error));
  }, [enseignantId]);

  const handleChange = (e) => {
    setSeanceData({
      ...seanceData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/Seances/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(seanceData),
      });

      if (response.ok) {
        alert('Séance ajoutée avec succès!');
        setIsSubmitted(true);

        // Supposons que l'appel à reconize est une étape nécessaire et indépendante
        const reconizeResponse = await fetch('http://127.0.0.1:8000/api/reconize/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(seanceData),
        });

        if (reconizeResponse.ok) {
          const reconizeData = await reconizeResponse.json();
          console.log(reconizeData);
          
        } else {
          console.error('Échec de l’appel à l’API Reconize.');
          alert('Échec de l’appel à l’API Reconize.');
        }
      } else {
        alert('Erreur lors de l\'ajout de la séance.');
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      alert('Erreur lors de l\'envoi du formulaire');
    }
  };

  if (isSubmitted) {
    return <TableuDesPresences />;
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Groupe:</label>
          <select name="ID_Groupe" value={seanceData.ID_Groupe} onChange={handleChange} required>
            <option value="">Sélectionnez un groupe</option>
            {groupes.map(groupe => (
              <option key={groupe.id} value={groupe.id}>{groupe.Numero}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Enseignant:</label>
          <input type="text" value={`${enseignantDetail.Nom} ${enseignantDetail.Prenom}`} readOnly />
        </div>

        <div className="form-group">
          <label>Module:</label>
          <select name="ID_Module" value={seanceData.ID_Module} onChange={handleChange} required>
            <option value="">Sélectionnez un module</option>
            {modules.map(module => (
              <option key={module.id} value={module.id}>{module.Nom}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Date:</label>
          <input type="date" name="Date" value={seanceData.Date} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Heure:</label>
          <select name="Heure" value={seanceData.Heure} onChange={handleChange} required>
            <option value="">Sélectionnez une heure</option>
            {heuresChoices.map(heure => (
              <option key={heure} value={heure}>{heure}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Salle:</label>
          <input type="text" name="Salle" value={seanceData.Salle} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <button type="submit">Ajouter Séance</button>
        </div>
      </form>
    </div>
  );
}

export default StartSession;
