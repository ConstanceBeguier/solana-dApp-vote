import React, {useState, useEffect} from 'react';
import {useAppContext} from "../../context/context";
import style from '../../styles/Proposal.module.css';
import {useRouter} from 'next/router';
import {isValidPublicKey} from "../../utils/helper";

const AddVoter = () => {
    const router = useRouter();
    const {proposalPK} = router.query; // Accéder aux paramètres de requête
    const {isCo, proposals, register_voter, error, success, setError} = useAppContext();
    const [proposal, setProposal] = useState({});
    const [voter, setVoter] = useState('');
    useEffect(() => {
        const currentPP = proposals.find((pp) => pp.publicKey == proposalPK);
        setProposal(currentPP);
    }, [proposalPK, proposals, isCo]);
    const registerVoter = () => {
        if (isValidPublicKey(voter)) {
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
            <h2>{proposal?.account?.title}</h2>
            <div>
                {
                    (proposal?.account?.voters.length > 0)
                        ? (
                            <div className={style.listChoices}>
                                <label className={style.label}>Registered voters :</label>
                                <br/>
                                {proposal?.account?.voters.map(voter => (
                                    <div>
                                        <span>{voter.toLocaleString("fr-FR").substring(0, 20)}...</span>
                                        <br/>
                                    </div>
                                ))
                                }
                            </div>)
                        : <span className={style.noChoice}>No voter registered</span>
                }
            </div>
            <label className={style.label} htmlFor="choice">Register a voter : </label>
            <input
                className={style.input}
                type="text"
                id="voter"
                value={voter}
                onChange={(e) => setVoter(e.target.value)}
            />
            {(error) && <span className={style.error}>{error}</span>}
            {(success) && <span className={style.success}>{success}</span>}
            <a className={style.button} onClick={registerVoter}>
                Add
            </a>
        </div>
    );
};

export default AddVoter;
