import { useRouter } from 'next/router';
import Link from 'next/link';
import style from '../../styles/Proposal.module.css';
function ProposalDetails() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className={style.container}>
      <h1>Détails de la Proposition</h1>
      <p>ID de la Proposition: {id}</p>
      {/* Rendu des détails de la proposition ici */}
      <Link  href={`/choice/add?proposalPK=${id}`}>
        <a className={style.button}>
          ajouter un choix
        </a>
      </Link>
    </div>
  );
}

export default ProposalDetails;