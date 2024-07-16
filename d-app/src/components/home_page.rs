use yew::prelude::*;
use crate::components::login::Login;
// use crate::components::proposals_list::ProposalsList;
use crate::components::proposal_form::ProposalForm;
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
                <ProposalForm />
            }
            <footer class="footer">
                <p>{ "2024 Alyra Turing Solana." }</p>
            </footer>
        </div>
    }
}