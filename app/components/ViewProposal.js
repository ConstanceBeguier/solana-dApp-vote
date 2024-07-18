import { useAppContext } from "../context/context";
import style from '../styles/ViewProposals.module.css';
import ResumeProposal from "./ResumeProposal";
import Link from 'next/link';
const ViewProposals = () => {

  const {proposals} = useAppContext();
  console.log(proposals)
  return (
    <div  className={style.gridContainer}>
      {proposals?.map((proposal) => (
        <div key={proposal.publicKey} className={style.proposalContainer}>
          <Link href={`/proposal/${proposal.publicKey}`}>
            <a><ResumeProposal key={proposal.publicKey} {...proposal} /></a>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ViewProposals;
