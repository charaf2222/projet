import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [etudiantsAssister, setEtudiantsAssister] = useState([]);
  const { enseignantId } = useParams();

  useEffect(() => {
    const fetchEtudiantsAssister = async () => {
      try {
        // Récupérer la dernière séance de l'enseignant
        const lastSeanceResponse = await axios.get(`http://127.0.0.1:8000/api/seance_by_enseignant/${enseignantId}/`);
        const lastSeance = lastSeanceResponse.data[lastSeanceResponse.data.length - 1];

        // Récupérer les étudiants présents à la dernière séance
        const assisterResponse = await axios.get(`http://127.0.0.1:8000/api/assister_by_seance/${lastSeance.id}/`);

        // Pour chaque étudiant présent, récupérer son nom, prénom et module à partir de l'ID de la dernière séance
        const etudiantsAssisterData = await Promise.all(
          assisterResponse.data.map(async (assister) => {
            const moduleResponse = await axios.get(`http://127.0.0.1:8000/api/Modules/${lastSeance.ID_Module}/`);
            return {
              Nom: assister.Nom,
              Prenom: assister.Prenom,
              Module: moduleResponse.data.Nom,
              Etat: "present", // Étant donné qu'ils sont présents
              Nbr_Absence: assister.Nbr_Absence,
              Nbr_Absence_Justifier: assister.Nbr_Absence_Justifier
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
      <h2>Liste des étudiants présents</h2>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Module</th>
            <th>État</th>
            <th>Nombre Absence</th>
            <th>Nombre Absence Justifier</th>
          </tr>
        </thead>
        <tbody>
          {etudiantsAssister.map((etudiant, index) => (
            <tr key={index}>
              <td>{etudiant.Nom}</td>
              <td>{etudiant.Prenom}</td>
              <td>{etudiant.Module}</td>
              <td>{etudiant.Etat}</td>
              <td>{etudiant.Nbr_Absence}</td>
              <td>{etudiant.Nbr_Absence_Justifier}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
