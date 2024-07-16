// src/context/wallet_context.rs
use yew::prelude::*;
use wasi_sol::core::wallet::BaseWalletAdapter;

#[derive(Properties, PartialEq)]
pub struct WalletProviderProps {
    pub children: Children,
}

#[derive(Clone, PartialEq)]
pub struct WalletContext {
    pub wallet_adapter: Option<BaseWalletAdapter>,
    pub set_wallet_adapter: Callback<Option<BaseWalletAdapter>>,
}

#[function_component(WalletProvider)]
pub fn wallet_provider(props: &WalletProviderProps) -> Html {
    let wallet_adapter = use_state(|| None);
    let set_wallet_adapter = {
        let wallet_adapter = wallet_adapter.clone();
        Callback::from(move |adapter: Option<BaseWalletAdapter>| {
            wallet_adapter.set(adapter)
        })
    };
    html! {
        <ContextProvider<WalletContext> context={WalletContext { wallet_adapter: (*wallet_adapter).clone(), set_wallet_adapter }}>
            { for props.children.iter() }
        </ContextProvider<WalletContext>>
    }
}
