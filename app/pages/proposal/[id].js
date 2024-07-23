import {useRouter} from 'next/router';
import Link from 'next/link';
import style from '../../styles/DetailProposal.module.css';
import React, {useEffect, useState} from 'react';
import {useAppContext} from "../../context/context";
import {useAnchorWallet} from "@solana/wallet-adapter-react";

function ProposalDetails() {
    const {isCo, proposals, cast_vote, fetch_ballot, success, error} = useAppContext();
    const wallet = useAnchorWallet();
    const router = useRouter();
    const {id} = router.query;
    const [proposal, setProposal] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);
    const [period, setPeriod] = useState();
    const [winnerProposal, setWinnerProposal] = useState();

    useEffect(() => {
        const currentPP = proposals.find((pp) => pp.publicKey == id);
        console.log(currentPP)
        setProposal(currentPP);
        if (currentPP) {
            if (isCo && currentPP?.account?.admin == wallet?.publicKey.toString()) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
            setPeriod(Number(Object.keys(currentPP?.account?.period)[0]));
            if (Number(Object.keys(currentPP?.account.period)[0]) === 3) {
                const highestCountChoice = currentPP?.account?.choices.reduce((max, choice) => {
                    return choice.count > max.count ? choice : max;
                }, currentPP?.account?.choices[0]);
                console.log("highestCountChoice", highestCountChoice);
                setWinnerProposal(highestCountChoice);
            }
        }
    }, [id, proposals, isCo]);

    const castVote = async (index) => {

        const ballot = await fetch_ballot(proposal.publicKey);
        if (ballot?.choiceIndex == 255) {
            const voted = cast_vote(index, proposal.publicKey);
        }


    };
    return (
        <div className={style.container}>
            <h1>Proposal Details</h1>
            <div className={style.line}>
                <h5 className={style.h5}>Title : </h5>
                {proposal?.account?.title}
            </div>
            <div className={style.line}>
                <h5 className={style.h5}>Description : </h5>
                {proposal?.account?.description}
            </div>
            <div className={style.containerInterval}>
                <h5 className={style.h5}>Choices Registration :</h5>
                <div>
                    <span>Start : {proposal?.account?.choicesRegistrationInterval?.start.toLocaleString("fr-FR")}</span>
                    <span
                        className={style.end}>End : {proposal?.account?.choicesRegistrationInterval?.end.toLocaleString("fr-FR")}</span>
                </div>
            </div>
            <div className={style.containerInterval}>
                <h5 className={style.h5}>Voters Registration :</h5>
                <div>
                    <span>Start : {proposal?.account?.votersRegistrationInterval?.start.toLocaleString("fr-FR")}</span>
                    <span
                        className={style.end}>End : {proposal?.account?.votersRegistrationInterval?.end.toLocaleString("fr-FR")}</span>
                </div>
            </div>
            <div className={style.containerInterval}>
                <h5 className={style.h5}>Voting Session :</h5>
                <div>
                    <span>Start : {proposal?.account?.votingSessionInterval?.start.toLocaleString("fr-FR")}</span>
                    <span
                        className={style.end}>End : {proposal?.account?.votingSessionInterval?.end.toLocaleString("fr-FR")}</span>
                </div>
            </div>
            <div className={style.line}>
                <h5 className={style.h5}>Proposal ID : </h5>
                {id}
            </div>
            <>
                {period == 2
                    ? <div className={`${style.listChoices} ${style.forVote}`}>
                        <h5 className={style.h5}>Voting Choices:</h5>
                        <br/>
                        {
                            (proposal?.account?.choices.length > 0)
                                ? proposal?.account?.choices.map((choice, index) => (
                                    <div key={index} className={style.choiceItem} onClick={() => castVote(index)}>
                                        <span className={style.choiceLabel}>{choice.label}</span>
                                    </div>
                                ))
                                : <span className={style.noChoice}>No choice for the moment</span>
                        }
                        <br/>
                        {(error) && <span className={style.error}>{error}</span>}
                        {(success) && <span className={style.success}>{success}</span>}
                    </div>
                    : period == 3 &&
                    <div className={style.result}>
                        <h5 className={style.h5}>Result :</h5>
                        {
                            (Number(winnerProposal?.count) > 0)
                                ? <>
                                    <h6 className={style.ttWin}>Winner:</h6>
                                    <span
                                        className={style.infoWin}>{winnerProposal?.label} with {winnerProposal?.count} vote.</span>
                                    <span className={style.ttResultVote}>Detailed list :</span>
                                    <div className={style.resultVote}>
                                        {
                                            proposal?.account?.choices.map((choice, index) => (
                                                <div key={index} className={style.choiceItem}
                                                     onClick={() => castVote(index)}>
                                                    <span
                                                        className={style.choiceLabel}>{choice.label} : {choice.count}</span>
                                                </div>

                                            ))
                                        }
                                        {(error) && <span className={style.error}>{error}</span>}
                                        {(success) && <span className={style.success}>{success}</span>}

                                    </div>

                                </>
                                : <span className={style.noVote}>no vote</span>
                        }  </div>

                }
            </>
            {/* Rendu des détails de la proposition ici */}
            {isAdmin && <>

                {(period == 0)
                    ? <Link href={`/choice/add?proposalPK=${id}`}>
                        <a className={style.button}>
                            Create a choice
                        </a>
                    </Link>
                    : (period == 1)
                        ? <Link href={`/voter/add?proposalPK=${id}`}>
                            <a className={style.button}>
                                Register a voter
                            </a>
                        </Link>
                        : <></>
                }
            </>}
        </div>
    );
}

export default ProposalDetails;