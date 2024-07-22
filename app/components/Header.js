import { WalletModalButton ,WalletDisconnectButton} from "@solana/wallet-adapter-react-ui";
import { useAppContext } from "../context/context";
import style from "../styles/Header.module.css";
import Link from 'next/link';
const Header = () => {
  const {isCo} = useAppContext();

  return (
    <div className={style.wrapper}>
      <Link href="/">
        <div className={style.title}>PolliSol</div>
      </Link>
      <nav className={style.nav}>
      <Link href="/">
        <a>Accueil</a>
      </Link>
      <Link href="/proposal/create">
        <a>Créer une Proposition</a>
      </Link>
    </nav>
      {isCo ? <WalletDisconnectButton /> : <WalletModalButton/> }
    </div>
  );
};

export default Header;
