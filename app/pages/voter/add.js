import React, { useState, useEffect } from 'react';
import { useAppContext } from "../../context/context";
import style from '../../styles/Proposal.module.css';
import { useRouter } from 'next/router';
import { isValidPublicKey } from "../../utils/helper";
const AddVoter = () => {
    const router = useRouter();
    const { proposalPK } = router.query; // Accéder aux paramètres de requête
    const { isCo, proposals, register_voter, error, setError } = useAppContext();
    const [proposal, setProposal] = useState({});
    const [voter, setVoter] = useState('');
    useEffect(()=>{
      const currentPP = proposals.find((pp)=>pp.publicKey == proposalPK);
      setProposal(currentPP);
    }, [proposalPK, proposals, isCo]);
    const registerVoter = () => {
      if(isValidPublicKey(voter)){
        register_voter(
            voter, //add in param registerVoter
            proposalPK 
          );
      } else {
        setError('invalid pubkey')
      }
    };
  
    return (
      <div className={style.container}>
        <label className={style.label} htmlFor="choice">Add voter for : {proposalPK} </label>
        <input
          className={style.input}
          type="text"
          id="voter"
          value={voter}
          onChange={(e) => setVoter(e.target.value)}
        />
        {(error) && <span className={style.error}>{error}</span>}
        <a className={style.button} onClick={registerVoter}>
          Ajouter un Electeur
        </a>
        <span>{error}</span>
      </div>
    );
  };

export default AddVoter;
