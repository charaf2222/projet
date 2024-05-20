import React, { useState, useEffect } from 'react'; // Ajout de useEffect
import { useParams } from 'react-router-dom';
import './HomeEnseignant.css';
import Dashboard from './components/Dashboard';
import StartSession from './components/StartSession';
import AttendanceReport from './components/AttendanceReport';
import Communication from './components/Communication';

const HomeEnseignant = () => {
  const [enseignantDetail, setEnseignantDetail] = useState({ Nom: '', Prenom: '' });
  let { enseignantId } = useParams();
  console.log('ID de lenseignant:', enseignantId);

  const [selectedTopic, setSelectedTopic] = useState('dashboard');
  let content;

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/Enseignant/${enseignantId}/`)
      .then(response => response.json())
      .then(data => {
        setEnseignantDetail({ Nom: data.Nom, Prenom: data.Prenom });
      })
      .catch(error => console.error('Erreur de chargement de l’enseignant:', error));
  }, [enseignantId]);

  if (selectedTopic === 'dashboard') {
    content = <Dashboard />;
  } else if (selectedTopic === 'start-session') {
    content = <StartSession />;
  } else if (selectedTopic === 'attendance-report') {
    content = <AttendanceReport />;
  } else if (selectedTopic === 'communication') {
    content = <Communication />;
  }

  return (
    <div className="App">
      <header>
        <h1>Gestion de Présence</h1>
      </header>
      <main>
        <div className="sidebar">
          <div className="logo"><span className="icon">&#128100;</span> {enseignantDetail.Nom} {enseignantDetail.Prenom}</div>
          <ul className="nav">
            <li><a href="#" onClick={(e) => { e.preventDefault(); setSelectedTopic('dashboard'); }}><span className="icon">&#128202;</span> Tableau de Bord</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setSelectedTopic('start-session'); }}><span className="icon">&#127979;</span> Commencer une Séance</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setSelectedTopic('attendance-report'); }}><span className="icon">&#128218;</span> Rapport des Présences</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setSelectedTopic('communication'); }}><span className="icon">&#128101;</span> Communication</a></li>
          </ul>
        </div>
        {content}
      </main>
    </div>
  );
};

export default HomeEnseignant;
