import React from 'react';

// Props:
// - isSelected: un booléen indiquant si ce bouton est l'onglet actuellement actif
// - onSelect: une fonction à exécuter lorsque ce bouton est cliqué
// - children: le contenu du bouton (texte ou éléments JSX)
export default function TabButton({ isSelected, onSelect, children }) {
  // Style conditionnel en fonction de si le bouton est sélectionné
  const style = {
    padding: '10px 20px',
    margin: '0 5px',
    cursor: 'pointer',
    backgroundColor: isSelected ? '#007bff' : '#ffffff',
    color: isSelected ? '#ffffff' : '#000000',
    border: '1px solid',
    borderColor: isSelected ? '#007bff' : '#ddd',
    borderRadius: '5px',
  };

  return (
    <button onClick={onSelect} style={style}>
      {children}
    </button>
  );
}
