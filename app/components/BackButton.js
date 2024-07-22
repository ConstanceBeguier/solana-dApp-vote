import React from 'react';
import { useRouter } from 'next/router';

const BackButton = () => {
 const router = useRouter();

  const goBack = () => {
    router.goBack(); // Utilise la pile d'historique de React Router pour revenir en arrière
  };

  return (
    <button onClick={goBack} style={{ padding: '10px 20px', cursor: 'pointer' }}>
      Retour
    </button>
  );
};

export default BackButton;
