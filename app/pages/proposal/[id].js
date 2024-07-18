import { useRouter } from 'next/router';
import Link from 'next/link';
import style from '../../styles/DetailProposal.module.css';
import { useEffect, useState } from 'react';
import { useAppContext } from "../../context/context";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import moment from 'moment';
function ProposalDetails() {
  const { isCo, proposals } = useAppContext();
  const wallet = useAnchorWallet();
  const router = useRouter();
  const { id } = router.query;
  const [proposal, setProposal] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(()=>{
    const currentPP = proposals.find((pp)=>pp.publicKey == id);
    setProposal(currentPP);
    console.log(currentPP?.account?.admin)
    console.log(wallet?.publicKey.toString())
    if(isCo && currentPP.account.admin == wallet.publicKey.toString()){
      setIsAdmin(true)
    }
  }, [id,proposals, isCo]);
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
      <p className={style.containerInterval}>
        <h5 className={style.h5}>Choices Registration :</h5> 
        <div>
          <span>Start : {proposal?.account?.choicesRegistrationInterval?.start?.format('L')}</span>
          <span className={style.end}>End : {proposal?.account?.choicesRegistrationInterval?.end?.format('L')}</span>
        </div>
      </p>
      <p className={style.containerInterval}>
        <h5 className={style.h5}>Voters Registration :</h5>
        <div>
          <span>Start : {proposal?.account?.votersRegistrationInterval?.start?.format('L')}</span>
          <span className={style.end}>End : {proposal?.account?.votersRegistrationInterval?.end?.format('L')}</span>
        </div>
      </p>
      <p className={style.containerInterval}>
        <h5 className={style.h5}>Voting Session :</h5>
        <div>
          <span>Start : {proposal?.account?.votingSessionInterval?.start?.format('L')}</span>
          <span className={style.end}>End : {proposal?.account?.votingSessionInterval?.end?.format('L')}</span>
        </div>
      </p>
      <div className={style.line}>
        <h5 className={style.h5}>ID de la Proposition : </h5>
        {id}
        </div>
      {/* Rendu des détails de la proposition ici */}
      {isAdmin && 
        <Link  href={`/choice/add?proposalPK=${id}`}>
          <a className={style.button}>
            ajouter un choix
          </a>
        </Link>
      }
    </div>
  );
}

export default ProposalDetails;