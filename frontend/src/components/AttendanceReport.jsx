import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Assurez-vous que vous utilisez le bon chemin pour react-router-dom
import axios from 'axios';

function AttendanceReport() {
  const [seances, setSeances] = useState([]);
  const [etudiantsAssister, setEtudiantsAssister] = useState([]);
  const [selectedSeanceId, setSelectedSeanceId] = useState(null);
  const { enseignantId } = useParams(); // Récupère enseignantId à partir de l'URL

  useEffect(() => {
    const fetchSeances = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/seance_by_enseignant/${enseignantId}/`);
        setSeances(response.data);
      } catch (error) {
        console.error('Error fetching seances:', error);
      }
    };

    fetchSeances();
  }, [enseignantId]);

  const handleClick = async (seanceId) => {
    try {
      // Récupérer les étudiants ayant assisté à la séance
      const assisterResponse = await axios.get(`http://127.0.0.1:8000/api/assister_by_seance/${seanceId}/`);
      const etudiantsAssisterData = await Promise.all(
        assisterResponse.data.map(async (assister) => {
          const etudiantResponse = await axios.get(`http://127.0.0.1:8000/api/Etudient/${assister.ID_Etudient}/`);
          return {
            ...assister,
            nom: etudiantResponse.data.Nom,
            prenom: etudiantResponse.data.Prenom,
          };
        })
      );
      setEtudiantsAssister(etudiantsAssisterData);
    } catch (error) {
      console.error('Error fetching etudiants assister:', error);
    }
  };

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
            {/* Add more headers if needed */}
          </tr>
        </thead>
        <tbody>
          {seances.map((seance) => (
            <tr key={seance.id}>
              <td><button onClick={() => handleClick(seance.id)}>{seance.id}</button></td>
              <td>{seance.Date}</td>
              <td>{seance.Heure}</td>
              <td>{seance.Salle}</td>
              {/* Add more columns if needed */}
            </tr>
          ))}
        </tbody>
      </table>
      {etudiantsAssister.length > 0 && (
        <div>
          <h3>Liste des étudiants ayant assisté à la séance {selectedSeanceId}</h3>
          <ul>
            {etudiantsAssister.map((etudiant) => (
              <li key={etudiant.id}>{etudiant.nom} {etudiant.prenom}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AttendanceReport;
