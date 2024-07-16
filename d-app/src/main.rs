use yew::prelude::*;
pub mod components;
pub mod utils;
pub mod context {
    pub mod wallet_context;
}
use crate::context::wallet_context::WalletProvider as MyWalletProvider;
use wasi_sol::{
    // core::traits::WalletAdapter,
    core::wallet::Wallet,
    // forms::yew::login::LoginForm,
    provider::yew::{
        connection::ConnectionProvider,
        wallet::WalletProvider,
    },
    // pubkey::Pubkey,
    // spawn_local, system_instruction,
    // transaction::Transaction,
};
use components::home_page::HomePage;

// use std::str::FromStr;
// use web_sys::HtmlInputElement;

#[function_component]
pub fn App() -> Html {
    // let endpoint = "https://api.mainnet-beta.solana.com";
    let endpoint = "https://api.devnet.solana.com";
    // let endpoint = "http://127.0.0.1:8899";
    let wallets = vec![
        Wallet::Phantom.into(),
    ];

    html! {
        <ConnectionProvider {endpoint}>
            <WalletProvider {wallets}>
                <MyWalletProvider>
                    <HomePage />
                </MyWalletProvider>
            </WalletProvider>
        </ConnectionProvider>
    }
}


fn main() {
    console_error_panic_hook::set_once();
    wasm_logger::init(wasm_logger::Config::default());
    yew::Renderer::<App>::new().render();
}
