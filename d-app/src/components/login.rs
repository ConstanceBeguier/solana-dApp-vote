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
use wasm_bindgen_futures::spawn_local;
use crate::context::wallet_context::WalletContext;

// use std::str::FromStr;
// use web_sys::HtmlInputElement;
#[derive(Properties, Clone, PartialEq)]
pub struct Props {
    pub connected: UseStateHandle<bool>,
}

#[function_component]
pub fn Login(props: &Props) -> Html {
    let wallet_context = use_context::<WalletContext>().expect("context not found");
    let connected = &props.connected;
    let is_connect = (*props.connected).clone();
    let _connection_context = use_connection();
    let phantom_context = use_wallet::<Wallet>(Wallet::Phantom);

    let phantom_wallet_adapter = use_state(|| phantom_context);

    let phantom_wallet_info = (*phantom_wallet_adapter).clone();
    let phantom_wallet_info_clone = phantom_wallet_info.clone();
    let balance = use_state(|| 0_u64);
    // Ecoute les changements sur `connected`
    let error = use_state(|| None as Option<String>);
    let balance_for_effect = balance.clone(); // Créez un clone pour l'effet
    use_effect_with(is_connect, move |_| {
        if is_connect {
            // Supposons que vous pouvez récupérer l'adapter depuis un état ou une source externe
            let wallet_adapter = phantom_wallet_info_clone; // Mettez ici la logique réelle pour obtenir le wallet

            // Mise à jour du contexte avec les nouvelles informations du wallet
            let wallet = wallet_adapter.clone();
            wallet_context.set_wallet_adapter.emit(Some(wallet_adapter));
            let pubkey = match wallet.public_key() {
                Some(key) => key,
                None => {
                    panic!("Keypair is required but was not found");
                }
            };
            spawn_local(async move {
                match _connection_context.connection.get_balance(&pubkey).await {
                    Ok(bal) => {
                        balance_for_effect.set(bal);
                    },
                    Err(e) => {
                        println!("Failed to get balance: {:?}", e);
                    }
                }
            });
        }
        || ()
    });
    

    // Callback::from(move |_| {
    //     let wallet_adapter = phantom_wallet_info_clone;

    // })
    html! {

            <div class="content">
                <div class="wallet-info">
                    if **connected {
                        if let Some(adapter) = &wallet_context.wallet_adapter {
                            if let Some(ref key) = adapter.public_key() {
                                <p>{ format!("Connected Public Key: {}", format_public_key(key.to_string())) }</p>
                                <p>{ format!("Balance  : {}", *balance) }</p>
                            } else {
                                <p>{ "Connected but no wallet info available" }</p>
                            }
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