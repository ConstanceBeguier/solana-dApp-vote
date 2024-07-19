import React, { useState } from 'react';
import { useAppContext } from "../../context/context";
import style from '../../styles/Proposal.module.css';
import { useRouter } from 'next/router';
import { isValidPublicKey } from "../../utils/helper";
const AddVoter = () => {
    const router = useRouter();
    const { proposalPK } = router.query; // Accéder aux paramètres de requête
    const { isCo, proposals, register_voter } = useAppContext();
    const [voter, setVoter] = useState('');
    const [error, setError] = useState('');
    useEffect(()=>{
      const currentPP = proposals.find((pp)=>pp.publicKey == id);
      setProposal(currentPP);
    }, [id,proposals, isCo]);
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
        <label className={style.label} htmlFor="choice">Electeur à ajouter : {proposalPK} </label>
        <input
          className={style.input}
          type="text"
          id="voter"
          value={voter}
          onChange={(e) => setVoter(e.target.value)}
        />

        <a className={style.button} onClick={registerVoter}>
          Ajouter un Electeur
        </a>
        <span>{error}</span>
      </div>
    );
  };

export default AddVoter;
