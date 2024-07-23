import {useEffect, useState} from "react";

import style from '../styles/ResumeProposal.module.css';
import {toCamelCase} from "../utils/helper";

const ResumeProposal = ({publicKey, account, setActiveClass}) => {
    const [period, setPeriod] = useState('');

    useEffect(() => {
        setPeriod(Object.values(account.period));
        setActiveClass(toCamelCase(Object.values(account.period)[0].toString()));
    }, [account]);

    return (
        <div className={style.card}>
            <div className={style.cardHeader}>
                <span className={style.cardTitle}>{account.title}</span>
            </div>
            <div className={style.cardBody}>
                <span className={style.cardPeriod}>Period : {period}</span>
            </div>
            <div className={style.cardFooter}>
                <span className={style.cardPubkey}>Proposal: {publicKey}</span>
            </div>
        </div>
    );
}

export default ResumeProposal;