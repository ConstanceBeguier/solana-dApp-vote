use yew::prelude::*;
pub mod components;
pub mod state;
pub mod utils;
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
    let endpoint = "https://api.mainnet-beta.solana.com";
    let wallets = vec![
        Wallet::Phantom.into(),
    ];

    html! {
        <ConnectionProvider {endpoint}>
            <WalletProvider {wallets}>
                <HomePage />
            </WalletProvider>
        </ConnectionProvider>
    }
}


fn main() {
    console_error_panic_hook::set_once();
    wasm_logger::init(wasm_logger::Config::default());
    yew::Renderer::<App>::new().render();
}
