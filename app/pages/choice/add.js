import React, { useEffect, useState } from 'react';
import { useAppContext } from "../../context/context";
import style from '../../styles/Proposal.module.css';
import { useRouter } from 'next/router';

const AddChoice = () => {
    const router = useRouter();
    const { proposalPK } = router.query; // Accéder aux paramètres de requête
  
    const { isCo, proposals, add_choice_for_one_proposal, error } = useAppContext();
    const [choice, setChoice] = useState('');
    const [proposal, setProposal] = useState({});
    useEffect(()=>{
      const currentPP = proposals.find((pp)=>pp.publicKey == proposalPK);
      setProposal(currentPP);
    }, [proposalPK, proposals, isCo]);
    const createProposal = () => {
        add_choice_for_one_proposal(
            choice,
            proposalPK
        );
    };

    return (
      <div className={style.container}>
        <div>
        {
          (proposal?.account?.choices.length > 0) 
            ? (
            <div className={style.listChoices}>
              <span>List Choices :</span>
              { proposal?.account?.choices.map((choice, index) => (
                <div key={index} className={style.choiceItem} onClick={() => castVote(index)}>
                  <span className={style.choiceLabel}>{choice.label}</span>
                </div>
              ))
              }
            </div>)
            : <span className={style.noChoice}>No choice for the moment</span>
        }
        </div>
        <label className={style.label} htmlFor="choice">Add choice for : {proposalPK} </label>
        <input
          className={style.input}
          type="text"
          id="choice"
          value={choice}
          onChange={(e) => setChoice(e.target.value)}
        />
        {(error) && <span className={style.error}>{error}</span>}
        <a className={style.button} onClick={createProposal}>
          Ajouter un choix
        </a>
      </div>
    );
  };

export default AddChoice;
