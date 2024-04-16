import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TableauDesPresences() {
  const [etudiantsAssister, setEtudiantsAssister] = useState([]);
  const [etatsEtudiantsAssister, setEtatsEtudiantsAssister] = useState([]);
  const [lastSeanceModule, setLastSeanceModule] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les séances
        const seancesResponse = await axios.get('http://127.0.0.1:8000/api/Seances/');
        
        // Vérifier si des séances ont été récupérées
        if (seancesResponse.data.length === 0) {
          console.log("Aucune séance trouvée.");
          return;
        }

        // Obtenir la dernière séance et son ID de module
        const lastSeance = seancesResponse.data[seancesResponse.data.length - 1];

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

        // Récupérer le module de la dernière séance
        const moduleResponse = await axios.get(`http://127.0.0.1:8000/api/Modules/${lastSeance.ID_Module}/`);
        setLastSeanceModule(moduleResponse.data);

        // Filtrer les états des étudiants pour ceux qui ont assisté à la dernière séance
        const etatEtudiantResponse = await axios.get('http://127.0.0.1:8000/api/Etat_Etudient_Module/');
        const etatsEtudiantsAssisterData = etatEtudiantResponse.data.filter(etudiant => 
          etudiantsAssisterData.some(assister => assister.ID_Etudient === etudiant.ID_Etudient) && etudiant.ID_Module === lastSeance.ID_Module
        );
        setEtatsEtudiantsAssister(etatsEtudiantsAssisterData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    // Appeler fetchData au montage du composant
    fetchData();

    // Mettre en place un intervalle pour vérifier les mises à jour périodiquement (toutes les 30 secondes)
    const interval = setInterval(fetchData, 3000); // Mettre à jour toutes les 3 secondes

    // Nettoyer l'intervalle lors du démontage du composant
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Tableau des Présences</h1>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Module</th>
            <th>Nbr Absences</th>
            <th>Nbr Absences Justifiées</th>
          </tr>
        </thead>
        <tbody>
          {etatsEtudiantsAssister.map(etudiantModule => (
            <tr key={etudiantModule.ID_Etudient + etudiantModule.ID_Module}>
              <td>{etudiantsAssister.find(etudiant => etudiant.ID_Etudient === etudiantModule.ID_Etudient).nom}</td>
              <td>{etudiantsAssister.find(etudiant => etudiant.ID_Etudient === etudiantModule.ID_Etudient).prenom}</td>
              <td>{lastSeanceModule && lastSeanceModule.Nom}</td>
              <td>{etudiantModule.Nbr_Absence}</td>
              <td>{etudiantModule.Nbr_Absence_Justifier}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableauDesPresences;
