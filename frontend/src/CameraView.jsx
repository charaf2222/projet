import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CameraView() {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/capture-image/'); // Ajustez l'URL selon votre configuration d'API
        const imageObj = response.data[0]; // Supposant que la réponse est un tableau
        // Supposons que BASE_URL est l'URL de base que vous souhaitez enlever
        const BASE_URL = 'http://127.0.0.1:8000/api/capture-image/';
        const relativeImageUrl = imageObj.image.replace(BASE_URL, '');
        setImageUrl(relativeImageUrl);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'image:", error);
      }
    };

    fetchImage();
  }, []);

  // Utilisez une URL de base dynamique pour construire l'URL complète de l'image pour l'environnement actuel
  const fullImageUrl = `${"C:/Users/user/Desktop/Projet/backend"}/${imageUrl}`;

  return (
    <div>
      <h1>Vue de la caméra</h1>
      {/* Affichez l'image si imageUrl n'est pas vide */}
      {imageUrl ? <img src={fullImageUrl} alt="Capture de la caméra" /> : <p>Chargement de l'image...</p>}
    </div>
  );
}

export default CameraView;
