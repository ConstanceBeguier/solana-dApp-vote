import { WalletDisconnectButton, WalletModalButton } from "@solana/wallet-adapter-react-ui";
import Image from 'next/image';
import Link from 'next/link';
import { useAppContext } from "../context/context";
import style from "../styles/Header.module.css";

const Header = () => {
    const {isCo} = useAppContext();

    return (
        <div className={style.wrapper}>
            <div className={style.pollisol}>
                <Image src="/logo.png" width={80} height={80} />
                <Link href="/">                
                    <div className={style.title}>PolliSol</div>
                </Link>
            </div>
            <nav className={style.nav}>
                <Link href="/">
                    <a>Home</a>
                </Link>
                {
                    isCo && <Link href="/proposal/create">
                        <a>Create a Proposal</a>
                    </Link>
                }
            </nav>
            {isCo ? <WalletDisconnectButton/> : <WalletModalButton/>}
        </div>
    );
};

export default Header;
