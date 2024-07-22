import { useRouter } from 'next/router';
import Link from 'next/link';
import style from '../../styles/DetailProposal.module.css';
import { useEffect, useState } from 'react';
import { useAppContext } from "../../context/context";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

function ProposalDetails() {
  const { isCo, proposals, cast_vote, fetch_ballot } = useAppContext();
  const wallet = useAnchorWallet();
  const router = useRouter();
  const { id } = router.query;
  const [proposal, setProposal] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [period, setPeriod] = useState();
  const [winnerProposal, setWinnerProposal] = useState();

  useEffect(()=>{
    const currentPP = proposals.find((pp)=>pp.publicKey == id);
    setProposal(currentPP);
    if(currentPP){
      if(isCo && currentPP?.account?.admin == wallet?.publicKey.toString()){
        setIsAdmin(true);
      }else{
        setIsAdmin(false);
      }
      setPeriod(Number(Object.keys(currentPP?.account?.period)[0]));
      if(Number(Object.keys(currentPP?.account.period)[0]) === 3) {
        const highestCountChoice = proposal?.account?.choices.reduce((max, choice) => {
            return choice.count > max.count ? choice : max;
        }, proposal?.account?.choices[0]);
        setWinnerProposal(highestCountChoice);
      }
    }
  }, [id,proposals, isCo]);

  const castVote = async (index) => {

      const ballot = await fetch_ballot(proposal.publicKey);
      if(ballot?.choiceIndex == 255) {
        const voted = cast_vote(index, proposal.publicKey);
      }
    

  };
  return (
    <div className={style.container}>
      <h1>Détails de la Proposition</h1>
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
          <span className={style.end}>End : {proposal?.account?.choicesRegistrationInterval?.end.toLocaleString("fr-FR")}</span>
        </div>
      </div>
      <div className={style.containerInterval}>
        <h5 className={style.h5}>Voters Registration :</h5>
        <div>
          <span>Start : {proposal?.account?.votersRegistrationInterval?.start.toLocaleString("fr-FR")}</span>
          <span className={style.end}>End : {proposal?.account?.votersRegistrationInterval?.end.toLocaleString("fr-FR")}</span>
        </div>
      </div>
      <div className={style.containerInterval}>
         <h5 className={style.h5}>Voting Session :</h5>
         <div>
           <span>Start : {proposal?.account?.votingSessionInterval?.start.toLocaleString("fr-FR")}</span>
           <span className={style.end}>End : {proposal?.account?.votingSessionInterval?.end.toLocaleString("fr-FR")}</span>
         </div>
      </div>
      <div className={style.line}>
        <h5 className={style.h5}>ID of the Proposal : </h5>
        {id}
        </div>
        <div className={style.listChoices}>
          {period == 2 
            ? <>
              <h5 className={style.h5}>List Choices:</h5>
              {
                (proposal?.account?.choices.length > 0) 
                  ? proposal?.account?.choices.map((choice, index) => (
                    <div key={index} className={style.choiceItem} onClick={() => castVote(index)}>
                      <span className={style.choiceLabel}>{choice.label}</span>
                    </div>
                  ))
                  : <span className={style.noChoice}>No choice for the moment</span>
              }
            </>
            : period == 3 &&
              <div  className={style.line}>
              <h5 className={style.h5}>Winner Choices:</h5>
              <span>{winnerProposal?.label} with {winnerProposal?.count} vote.</span>
            </div>
          }
        </div>
      {/* Rendu des détails de la proposition ici */}
      {isAdmin && <>
      
        {(period == 0) 
          ? <Link href={`/choice/add?proposalPK=${id}`}>
            <a className={style.button}>
              ajouter un choix
            </a>
          </Link>
          : (period !=3) 
            ? <Link href={`/voter/add?proposalPK=${id}`}>
              <a className={style.button}>
                ajouter un voter
              </a>
            </Link>
            : <></> 
       } 
     </> }
    </div>
  );
}

export default ProposalDetails;