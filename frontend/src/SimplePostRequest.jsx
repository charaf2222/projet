import React, { useState } from 'react';

function SimplePostRequest() {
  const [responseData, setResponseData] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // L'URL de votre endpoint Django
    const url = 'http://127.0.0.1:8000/api/reconize/';

    // Données que vous souhaitez envoyer, ajustez selon vos besoins
    const data = {
      key: 'value',
      // Autres données...
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Incluez d'autres headers ici si nécessaire, comme un token d'authentification
        },
        body: JSON.stringify(data), // Convertit les données en chaîne JSON
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      // Traiter la réponse ici si nécessaire
      const result = await response.json(); // Supposons que Django renvoie du JSON
      setResponseData(JSON.stringify(result, null, 2)); // Mise en forme du JSON pour l'affichage
    } catch (error) {
      console.error("Erreur lors de l'envoi de la requête POST:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <button type="submit">Envoyer la requête POST</button>
      </form>
      {responseData && <pre>Réponse: {responseData}</pre>}
    </div>
  );
}

export default SimplePostRequest;
