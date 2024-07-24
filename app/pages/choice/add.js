import React, {useEffect, useState} from 'react';
import {useAppContext} from "../../context/context";
import style from '../../styles/Proposal.module.css';
import {useRouter} from 'next/router';

const AddChoice = () => {
    const router = useRouter();
    const {proposalPK} = router.query; // Accéder aux paramètres de requête

    const {isCo, proposals, add_choice_for_one_proposal, error, success} = useAppContext();
    const [choice, setChoice] = useState('');
    const [proposal, setProposal] = useState({});
    useEffect(() => {
        const currentPP = proposals.find((pp) => pp.publicKey == proposalPK);
        setProposal(currentPP);
    }, [proposalPK, proposals, isCo]);
    const createProposal = async () => {
        await add_choice_for_one_proposal(
            choice,
            proposalPK
        );
        setChoice('');
    };
    useEffect(() => {
        console.log(error)
    }, [error])
    return (
        <div className={style.container}>
            <h2>{proposal?.account?.title}</h2>
            <div>
                {
                    (proposal?.account?.choices.length > 0)
                        ? (
                            <div className={style.listChoices}>
                                <label className={style.label}>Existing Choices :</label>
                                <br/>
                                {proposal?.account?.choices.map((choice, index) => (
                                    <div key={index} className={style.choiceItem}>
                                        <span className={style.choiceLabel}>{choice.label}</span>
                                    </div>
                                ))
                                }
                            </div>)
                        : <span className={style.noChoice}>No choice for the moment</span>
                }
            </div>
            <label className={style.label} htmlFor="choice">Add a new choice : </label>
            <input
                className={style.input}
                type="text"
                id="choice"
                value={choice}
                onChange={(e) => setChoice(e.target.value)}
            />
            {(error) && <span className={style.error}>{error}</span>}
            {(success) && <span className={style.success}>{success}</span>}
            <a className={style.button} onClick={createProposal}>
                Add
            </a>
        </div>
    );
};

export default AddChoice;
