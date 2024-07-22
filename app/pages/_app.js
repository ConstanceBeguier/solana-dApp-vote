import {
    ConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
    PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { useMemo } from "react";
import { AppProvider } from "../context/context";
import "../styles/globals.css";

require("@solana/wallet-adapter-react-ui/styles.css");

import { useRouter } from 'next/router';
import Header from "../components/Header";
import style from "../styles/Home.module.css";
function MyApp({ Component, pageProps }) {
  // const endpoint = clusterApiUrl(WalletAdapterNetwork.Devnet); 
  const router = useRouter();
  const endpoint = "http://127.0.0.1:8899"; 

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AppProvider>
            <div className={style.wrapper}>
              <Header />
              {/* <BackButton /> */}
              <Component {...pageProps} />
            </div>
          </AppProvider>
          </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;
