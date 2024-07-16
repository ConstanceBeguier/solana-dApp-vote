use yew::prelude::*;

use wasi_sol::{
    // core::wallet::Wallet,
    provider::yew::{
        connection::use_connection,
        // wallet::use_wallet,
    },
    // pubkey::Pubkey,
    // spawn_local, system_instruction,
    // transaction::Transaction,
};
// use std::str::FromStr;
// use web_sys::HtmlInputElement;

use crate::utils::bytes_to_string;
use solana_dapp_vote::state::proposal::Proposal;

#[derive()]
struct ListProposal {
    proposals: Vec<Proposal>,
}

#[function_component]
pub fn ProposalsList() -> Html {
    let _connection_context = use_connection();
    // let phantom_context = use_wallet::<Wallet>(Wallet::Phantom);

    // let phantom_wallet_adapter = use_state(|| phantom_context);

    // let phantom_wallet_info = (*phantom_wallet_adapter).clone();

    let proposals = fetch_proposals();

   
    html! { proposals_list(&proposals) }
}

fn proposals_list(list_proposals: &ListProposal) -> Html {
    let proposals = &list_proposals.proposals;
    html! { <div>{
        match proposals.is_empty() {
            true => html! { <p>{"Liste vide"}</p> },
            false => html! {
                <>
                    { for proposals.iter().map(|proposal| {
                        html! {
                            <div>
                                <p>{ format!("Title: {}", bytes_to_string(&proposal.title)) }</p>
                                <p>{ format!("Description: {}", bytes_to_string(&proposal.description)) }</p>
                            </div>
                        }
                    })}
                </>
            },
        }
    }
    </div> }
}
fn fetch_proposals() -> ListProposal {
    // Logique pour récupérer les propositions depuis Solana
    // Placeholder: remplacez par votre implémentation réelle
   ListProposal { proposals: Vec::new() }
}