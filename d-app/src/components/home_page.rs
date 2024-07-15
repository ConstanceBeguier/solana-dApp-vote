use yew::prelude::*;
use crate::components::login::Login;
use crate::components::proposals_list::ProposalsList;
#[function_component]
pub fn HomePage() -> Html {
    let connected = use_state(|| false);
    let co = (*connected).clone();
    html! {
        <div class="wallet-adapter">
            <header class="header">
                <h1>{"PolliSol"}</h1>
                <Login {connected} />
            </header>
            if co {
                <ProposalsList />
            }
            <footer class="footer">
                <p>{ "2024 Alyra Turing Solana." }</p>
            </footer>
        </div>
    }
}