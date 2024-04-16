import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './HomeEnseignant.css';
import TabButton from './components/TabButton';
import Dashboard from './components/Dashboard';
import StartSession from './components/StartSession';
import AttendanceReport from './components/AttendanceReport';
import Communication from './components/Communication';

const HomeEnseignant = () => {

  let { enseignantId } = useParams();

  console.log('ID de lenseignant:', enseignantId);


  const [selectedTopic, setSelectedTopic] = useState('dashboard');

  let content; // Cette variable contiendra le composant à afficher

  // Déterminer quel composant doit être affiché
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
        <menu>
          <TabButton
            isSelected={selectedTopic === 'dashboard'}
            onSelect={() => setSelectedTopic('dashboard')}
          >
            Tableau de Bord
          </TabButton>
          <TabButton
            isSelected={selectedTopic === 'start-session'}
            onSelect={() => setSelectedTopic('start-session')}
          >
            Commencer une Séance
          </TabButton>
          <TabButton
            isSelected={selectedTopic === 'attendance-report'}
            onSelect={() => setSelectedTopic('attendance-report')}
          >
            Rapport des Présences
          </TabButton>
          <TabButton
            isSelected={selectedTopic === 'communication'}
            onSelect={() => setSelectedTopic('communication')}
          >
            Communication avec les Étudiants
          </TabButton>
        </menu>
        
          {content}
      </main>
    </div>
  );
};

export default HomeEnseignant;
