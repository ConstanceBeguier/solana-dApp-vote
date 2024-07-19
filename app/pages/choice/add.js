import React, { useState } from 'react';
import { useAppContext } from "../../context/context";
import style from '../../styles/Proposal.module.css';
import { useRouter } from 'next/router';

const AddChoice = () => {
    const router = useRouter();
    const { proposalPK } = router.query; // Accéder aux paramètres de requête
  
    const { add_choice_for_one_proposal } = useAppContext();
    const [choice, setChoice] = useState('');
  
    const createProposal = () => {
        add_choice_for_one_proposal(
            choice,
            proposalPK
        );
    };
  
    return (
      <div className={style.container}>
        <label className={style.label} htmlFor="choice">Choix pour la proposal : {proposalPK} </label>
        <input
          className={style.input}
          type="text"
          id="choice"
          value={choice}
          onChange={(e) => setChoice(e.target.value)}
        />

        <a className={style.button} onClick={createProposal}>
          Ajouter un choix
        </a>
      </div>
    );
  };

export default AddChoice;
