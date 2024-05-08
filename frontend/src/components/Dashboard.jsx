import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [etudiantsAssister, setEtudiantsAssister] = useState([]);
  const { enseignantId } = useParams();

  useEffect(() => {
    const fetchEtudiantsAssister = async () => {
      try {
        const lastSeanceResponse = await axios.get(`http://127.0.0.1:8000/api/seance_by_enseignant/${enseignantId}/`);
        const lastSeance = lastSeanceResponse.data[lastSeanceResponse.data.length - 1];

        const assisterResponse = await axios.get(`http://127.0.0.1:8000/api/assister_by_seance/${lastSeance.id}/`);

        const etudiantsAssisterData = await Promise.all(
          assisterResponse.data.map(async (assister) => {
            const moduleResponse = await axios.get(`http://127.0.0.1:8000/api/Modules/${lastSeance.ID_Module}/`);
            return {
              Nom: assister.Nom,
              Prenom: assister.Prenom,
              Module: moduleResponse.data.Nom,
              Etat: assister.Etat, // Étant donné qu'ils sont présents
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

  const getEtatStyle = (etat) => ({
    color: etat === 'Présent' ? 'green' : 'red',
    fontWeight: 'bold'
  });

  return (
    <div>
      <h2>Liste des étudiants dans la dernière séance</h2>
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
              <td style={getEtatStyle(etudiant.Etat)}>{etudiant.Etat}</td>
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
