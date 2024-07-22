import React from 'react';
import { useRouter } from 'next/router';
import style from '../styles/BackButton.module.css';

const BackButton = () => {
 const router = useRouter();

  const goBack = () => {
    router.goBack(); // Utilise la pile d'historique de React Router pour revenir en arrière
  };

  return (
    <button onClick={goBack} className={style.button}>
      Retour
    </button>
  );
};

export default BackButton;
