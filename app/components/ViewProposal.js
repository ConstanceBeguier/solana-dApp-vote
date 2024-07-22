import { useState } from "react";
import { useAppContext } from "../context/context";
import style from '../styles/ViewProposals.module.css';
import ResumeProposal from "./ResumeProposal";
import Link from 'next/link';
const ViewProposals = () => {
  const {proposals} = useAppContext();
  const [activeClass, setActiveClass] = useState({}); // Un objet pour garder les états actifs des différents ResumeProposal

  const handleSetActiveClass = (key, className) => {
    setActiveClass(prev => ({ ...prev, [key]: style[className] }));
  };

  return (
    <div  className={style.gridContainer}>
      {proposals?.map((proposal) => (
        <div key={proposal.publicKey} className={`${style.proposalContainer} ${activeClass[proposal.publicKey] || ''}`}>
          <Link href={`/proposal/${proposal.publicKey}`}>
            <a>
              <ResumeProposal 
                key={proposal.publicKey} 
                {...proposal} 
                setActiveClass={className => handleSetActiveClass(proposal.publicKey, className)}
              />
            </a>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ViewProposals;
