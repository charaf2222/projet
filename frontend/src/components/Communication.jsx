import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './styles.css'; // Importation de votre fichier CSS

export default function Communication() {
  const { enseignantId } = useParams();
  const [activeTab, setActiveTab] = useState('contact'); // 'contact' ou 'notify' pour contrôler l'affichage actif
  const [groupes, setGroupes] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [emailMessage, setEmailMessage] = useState(`Objet : Correction d'erreur de présence

Bonjour,

Je vous écris pour signaler une erreur dans la saisie des présences qui concerne un de nos étudiants. Il a été incorrectement marqué comme présent lorsqu'il ne l'était pas.

Détails de l'étudiant concerné :

Nom et prénom : Nom Prénom
Groupe : [Nom/Numéro du groupe]
Module : [Nom du module]
Date et heure de l'erreur : [jj/mm/aaaa à hh:mm]

Nous vous prions de bien vouloir corriger cette erreur dans votre système afin de garantir l'exactitude de nos registres.

Nous vous remercions pour votre attention et restons à votre disposition pour toute information complémentaire.

Cordialement`);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/Groupe/')
      .then(response => response.json())
      .then(data => setGroupes(data))
      .catch(error => console.error('Erreur de chargement des groupes:', error));
  }, []);

  const handleSendEmail = async (path, payload) => {
    const url = `http://127.0.0.1:8000/api/${path}/`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Réponse du réseau non ok');
      }

      const data = await response.json();
      console.log('Réponse du serveur:', data);
      alert('Email envoyé avec succès!');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      alert('Erreur lors de l\'envoi de l\'email.');
    }
  };

  return (
    <div className="communication-container">
      <button className="button" onClick={() => setActiveTab('contact')}>Contacter l'Administration</button>
      <button className="button" onClick={() => setActiveTab('notify')}>Notifier Changement</button>
      
      {activeTab === 'contact' && (
        <div className="message-container">
          <textarea
            className="email-text"
            value={emailMessage}
            onChange={e => setEmailMessage(e.target.value)}
          />
          <button className="button-email" onClick={() => handleSendEmail('EnvoyerEmailAdministration', { teacherId: enseignantId, emailContent: emailMessage })}>Envoyer</button>
        </div>
      )}
      
      {activeTab === 'notify' && (
        <div className="notification-container">
          <select
            value={selectedGroup}
            onChange={e => setSelectedGroup(e.target.value)}
            className="group-select"
          >
            <option value="">Sélectionner un groupe</option>
            {groupes.map(groupe => (
              <option key={groupe.id} value={groupe.id}>{groupe.Numero} - {groupe.Annee_Univ}</option>
            ))}
          </select>
          <textarea
            className="email-text"
            value={notificationMessage}
            placeholder="Entrez votre message de notification ici"
            onChange={e => setNotificationMessage(e.target.value)}
          />
          <button className="button-email" onClick={() => handleSendEmail('EnvoyerEmailEtudient', { teacherId: enseignantId, groupId: selectedGroup, emailContent: notificationMessage })}>Envoyer Email</button>
        </div>
      )}
    </div>
  );
}
