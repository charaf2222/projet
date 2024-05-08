import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function AttendanceReport() {
  const [seances, setSeances] = useState([]);
  const [modules, setModules] = useState({});
  const [etudiantsAbsents, setEtudiantsAbsents] = useState([]);
  const [selectedSeanceId, setSelectedSeanceId] = useState(null);
  const { enseignantId } = useParams();

  useEffect(() => {
    const fetchSeances = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/seance_by_enseignant/${enseignantId}/`);
        setSeances(response.data);
        const moduleDetails = {};
        await Promise.all(response.data.map(async (seance) => {
          const moduleResponse = await axios.get(`http://127.0.0.1:8000/api/Modules/${seance.ID_Module}/`);
          moduleDetails[seance.ID_Module] = moduleResponse.data.Nom;
        }));
        setModules(moduleDetails);
      } catch (error) {
        console.error('Error fetching seances:', error);
      }
    };

    fetchSeances();
  }, [enseignantId]);

  const handleClick = async (seanceId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/assister_by_seance/${seanceId}/`);
      setSelectedSeanceId(seanceId);
      setEtudiantsAbsents(response.data);
    } catch (error) {
      console.error('Error fetching etudiants assister:', error);
    }
  };

  const getEtatStyle = (etat) => ({
    color: etat === 'Présent' ? 'green' : 'red',
    fontWeight: 'bold'
  });

  return (
    <div>
      <h2>Attendance Report for Enseignant ID: {enseignantId}</h2>
      <table>
        <thead>
          <tr>
            <th>Seance ID</th>
            <th>Date</th>
            <th>Heure</th>
            <th>Salle</th>
            <th>Module</th>
          </tr>
        </thead>
        <tbody>
          {seances.map((seance) => (
            <tr key={seance.id}>
              <td><button onClick={() => handleClick(seance.id)}>{seance.id}</button></td>
              <td>{seance.Date}</td>
              <td>{seance.Heure}</td>
              <td>{seance.Salle}</td>
              <td>{modules[seance.ID_Module]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {etudiantsAbsents.length > 0 && (
        <div>
          <h3>Liste des étudiants absents à la séance {selectedSeanceId}</h3>
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>État</th>
              </tr>
            </thead>
            <tbody>
              {etudiantsAbsents.map((etudiant, index) => (
                <tr key={index}>
                  <td>{etudiant.Nom}</td>
                  <td>{etudiant.Prenom}</td>
                  <td style={getEtatStyle(etudiant.Etat)}>{etudiant.Etat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AttendanceReport;
