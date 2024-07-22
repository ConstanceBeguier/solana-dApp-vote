import { useEffect, useState } from "react";
import moment from 'moment';
import style from '../styles/ResumeProposal.module.css';
const ResumeProposal = ({publicKey, account, setActiveClass}) => {
  console.log(publicKey)
  const [period, setPeriod] = useState('');
  const now = moment();
  useEffect(()=>{
      // Comparer avec l'heure actuelle pour déterminer l'intervalle actuel
    if (now.isBetween(account.choicesRegistrationInterval.start, account.choicesRegistrationInterval.end, undefined, '[]')) {
      setPeriod("Choices Registration");
      setActiveClass("choicesRegistration");
    } else if (now.isBetween(account.votersRegistrationInterval.start, account.votersRegistrationInterval.end, undefined, '[]')) {
      setPeriod("Voters Registration");
      setActiveClass("votersRegistration");
    } else if (now.isBetween(account.votingSessionInterval.start, account.votingSessionInterval.end, undefined, '[]')) {
      setPeriod("Voting Session");
      setActiveClass("votingSession");
    } else {
      setPeriod("Terminate");
      setActiveClass("terminate");

    }
  },[account]);
  return (
    <div className={style.card}>
      <div className={style.cardHeader}>
        <span className={style.cardTitle}>{account.title}</span>
      </div>
      <div className={style.cardBody}>
        <span className={style.cardPeriod}>Period : {period}</span>
      </div>
      <div className={style.cardFooter}>
        <span className={style.cardPubkey}>pubkey: {publicKey}</span>
      </div>
    </div>
  );
}

export default ResumeProposal;