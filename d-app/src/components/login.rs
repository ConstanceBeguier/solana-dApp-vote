use yew::prelude::*;

use wasi_sol::{
    core::traits::WalletAdapter,
    core::wallet::Wallet,
    forms::yew::login::LoginForm,
    provider::yew::{
        connection::use_connection,
        wallet::use_wallet,
    },
    // pubkey::Pubkey,
    // spawn_local, system_instruction,
    // transaction::Transaction,
};
// use std::str::FromStr;
// use web_sys::HtmlInputElement;
#[derive(Properties, Clone, PartialEq)]
pub struct Props {
    pub connected: UseStateHandle<bool>,
}

#[function_component]
pub fn Login(props: &Props) -> Html {
    let connected = &props.connected;
    let _connection_context = use_connection();
    let phantom_context = use_wallet::<Wallet>(Wallet::Phantom);

    let phantom_wallet_adapter = use_state(|| phantom_context);

    let phantom_wallet_info = (*phantom_wallet_adapter).clone();

    let error = use_state(|| None as Option<String>);

    html! {

            <div class="content">
                <div class="wallet-info">
                    if **connected {
                        if let Some(ref key) = phantom_wallet_info.public_key() {
                            <p>{ format!("Connected Public Key: {}", format_public_key(key.to_string())) }</p>
                        } else {
                            <p>{ "Connected but no wallet info available" }</p>
                        }
                    }
                </div>
                <LoginForm
                    phantom={Some(phantom_wallet_adapter)}
                    solflare={None}
                    backpack={None}
                    connected={connected.clone()}
                />
                if let Some(ref e) = *error {
                    <p style="color: red;">{ e.clone() }</p>
                }
            </div>
    }
}

fn format_public_key(key: String) -> String {
    let len = key.len();
    if len > 10 {  
        return format!("{}...{}", &key[0..4], &key[len-4..]);
    } else {
        return key.to_string();
    }
}