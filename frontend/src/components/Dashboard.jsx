import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Assurez-vous que vous utilisez le bon chemin pour react-router-dom
import axios from 'axios';

function Dashboard() {
  const [etudiantsAssister, setEtudiantsAssister] = useState([]);
  const { enseignantId } = useParams(); // Récupère enseignantId à partir de l'URL

  useEffect(() => {
    const fetchEtudiantsAssister = async () => {
      try {
        // Récupérer la dernière séance
        const lastSeanceResponse = await axios.get(`http://127.0.0.1:8000/api/seance_by_enseignant/${enseignantId}/`);
        const lastSeance = lastSeanceResponse.data[lastSeanceResponse.data.length - 1]; // Suppose que les séances sont triées par ordre chronologique

        // Récupérer les étudiants ayant assisté à la dernière séance
        const assisterResponse = await axios.get(`http://127.0.0.1:8000/api/assister_by_seance/${lastSeance.id}/`);
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
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    fetchEtudiantsAssister();
  }, [enseignantId]);

  return (
    <div>
      <h2>Liste des étudiants ayant assisté à la dernière séance</h2>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            {/* Ajoutez plus d'en-têtes si nécessaire */}
          </tr>
        </thead>
        <tbody>
          {etudiantsAssister.map((etudiant) => (
            <tr key={etudiant.id}>
              <td>{etudiant.nom}</td>
              <td>{etudiant.prenom}</td>
              {/* Ajoutez plus de colonnes si nécessaire */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
