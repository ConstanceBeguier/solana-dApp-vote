use core::panic;

use yew::prelude::*;
// use chrono::prelude::*;
use solana_dapp_vote::state::proposal::Proposal;

use wasi_sol::{
    core::{traits::WalletAdapter, wallet::BaseWalletAdapter}, signer::Signer,
    transaction::Transaction,
    provider::yew::connection::use_connection,
    // provider::yew::wallet::use_wallet, //pubkey::Pubkey,
};
// use solana_client_wasm::WasmClient as RpcClient;
use solana_sdk::{
    system_program,
    instruction::{Instruction, AccountMeta},
    message::Message,
    signature::Keypair,
};
use borsh::{BorshSerialize, BorshDeserialize};
use crate::utils::{string_to_array_u8_16, string_to_u8_32_array};
use web_sys::HtmlInputElement;
use wasm_bindgen_futures::spawn_local;
use crate::context::wallet_context::WalletContext;

#[derive(Properties, PartialEq)]
pub struct Props {
    pub on_submit: Callback<Proposal>,
}
#[derive(Debug, BorshSerialize, BorshDeserialize)]
enum PolliSolInstruction {
    CreateProposal {
        title: [u8; 16],
        description: [u8; 32],
        choices_registration_start: u64,
        choices_registration_end: u64,
        voters_registration_start: u64,
        voters_registration_end: u64,
        voting_session_start: u64,
        voting_session_end: u64,
    },
}


#[function_component]
pub fn ProposalForm() -> Html {
    let connection_context = use_connection();
    let wallet_context = use_context::<WalletContext>().expect("context not found");
    let wallet_adapter =  wallet_context.wallet_adapter;
    // let phantom_context = use_wallet::<Wallet>(Wallet::Phantom);
    // phantom_context.
    let title = use_state(|| "title".to_string());
    let description = use_state(|| "description".to_string());
    let choices_registration_start = use_state(|| "2024-07-16T21:58".to_string());
    let choices_registration_end = use_state(|| "2024-07-17T21:58".to_string());
    let voters_registration_start = use_state(|| "2024-07-18T21:58".to_string());
    let voters_registration_end = use_state(|| "2024-07-19T21:58".to_string());
    let voting_session_start = use_state(|| "2024-07-20T21:58".to_string());
    let voting_session_end = use_state(|| "2024-07-21T21:58".to_string());
    let on_submit = {
        println!("on_submit");
        let title = (*title).clone();
        let description = (*description).clone();
        let choices_registration_start = (*choices_registration_start).clone(); 
        let choices_registration_end = (*choices_registration_end).clone();
        let voters_registration_start = (*voters_registration_start).clone();
        let voters_registration_end = (*voters_registration_end).clone();
        let voting_session_start = (*voting_session_start).clone();
        let voting_session_end = (*voting_session_end).clone();
        Callback::from(move |_| {
            let it_data = PolliSolInstruction::CreateProposal { 
                title: string_to_array_u8_16(&title).expect("REASON"),
                description: string_to_u8_32_array(&description).expect("REASON"),
                choices_registration_start:datetime_local_to_timestamp(&choices_registration_start).expect("REASON"),
                choices_registration_end:datetime_local_to_timestamp(&choices_registration_end).expect("REASON"),
                voters_registration_start:datetime_local_to_timestamp(&voters_registration_start).expect("REASON"),
                voters_registration_end:datetime_local_to_timestamp(&voters_registration_end).expect("REASON"),
                voting_session_start:datetime_local_to_timestamp(&voting_session_start).expect("REASON"),
                voting_session_end:datetime_local_to_timestamp(&voting_session_end).expect("REASON"),
            };

            // log::info!("create_proposal : {:?}", create_proposal);
            let connection_clone = connection_context.clone();

            let phantom_wallet_info_clone = match wallet_adapter.as_ref() {
                Some(wallet_adapter) => wallet_adapter.clone(),
                None => {
                    // Gérer l'absence de wallet_adapter, par exemple retourner ou afficher un message d'erreur
                   panic!("Wallet adapter is required.");
                }
            };
            let payer = match phantom_wallet_info_clone.public_key() {
                Some(key) => key,
                None => {
                    panic!("Keypair is required but was not found");
                }
            };
            // let proposal = solana_dapp_vote::state::proposal::Proposal::clone(&self);
            // proposal.
            let proposal_keypair = Keypair::new();
            let proposal_key = &proposal_keypair.pubkey();
            let admin_keypair = Keypair::new();
            let admin_key = &payer;

            let mut instr_in_bytes: Vec<u8> = Vec::new();
            it_data.serialize(&mut instr_in_bytes);
            let instruction = Instruction {
                program_id: solana_dapp_vote::ID,
                data: instr_in_bytes,
                accounts: vec![
                    AccountMeta::new(*proposal_key, true),
                    AccountMeta::new(*admin_key, true),
                    AccountMeta::new_readonly(solana_dapp_vote::ID, false),
                ]
            };
            log::info!("instruction : {:?}", instruction);
            

            spawn_local(async move {
                let hash = match connection_clone.connection.get_latest_blockhash().await {
                    Ok(hash) => hash,
                    Err(_)=> panic!("get hash")
                };
                log::info!("hash : {:?}", hash);

                // let message = Message::new_with_blockhash(
                //     &[instruction],
                //     Some(&payer),
                //     &hash,
                // );
                // log::info!("message : {:?}", message);

                let tx = Transaction::new_with_payer(&[instruction.clone()], Some(&payer));
                // tx.sign(&[payer], tx.message.recent_blockhash);
                let account = match phantom_wallet_info_clone.sign_send_transaction(tx).await{
                    Ok(sign) => sign,
                    Err(_)=> panic!("get sign")
                };;

                log::info!("account : {:?}", account);
            // Créez une transaction pour envoyer la proposal au programme Solana
                // create_proposal_transaction(&instruction, phantom_wallet_info_clone).await;
            });

        })
    };

    html! {
        <div >
            <input type="text"
                   placeholder="Title"
                   oninput={Callback::from(move |e: InputEvent| title.set(e.target_unchecked_into::<web_sys::HtmlInputElement>().value()))}
                   value={(*title).clone()} />
            <textarea placeholder="Description"
                      oninput={Callback::from(move |e: InputEvent| description.set(e.target_unchecked_into::<web_sys::HtmlInputElement>().value()))}
                      value={(*description).clone()} />
            <input type="datetime-local" oninput={date_input_handler(choices_registration_start)} value={{(*choices_registration_start).clone()}}/>
            <input type="datetime-local" oninput={date_input_handler(choices_registration_end)} value={{(*choices_registration_end).clone()}}/>
            <input type="datetime-local" oninput={date_input_handler(voters_registration_start)} value={{(*voters_registration_start).clone()}}/>
            <input type="datetime-local" oninput={date_input_handler(voters_registration_end)} value={{(*voters_registration_end).clone()}}/>
            <input type="datetime-local" oninput={date_input_handler(voting_session_start)} value={{(*voting_session_start).clone()}}/>
            <input type="datetime-local" oninput={date_input_handler(voting_session_end)} value={{(*voting_session_end).clone()}}/>
            <button type="button" onclick={on_submit.clone()}>{ "Submit Proposal" }</button>
        </div>
    }
}

fn datetime_local_to_timestamp(datetime: &str) -> Result<u64, &'static str> {
    if datetime.is_empty() {
        return Err("Datetime is empty");
    }
    log::info!("datetime : {}", datetime);
    match chrono::NaiveDateTime::parse_from_str(datetime, "%Y-%m-%dT%H:%M") {
        Ok(naive_datetime) => {
            let timestamp = naive_datetime.and_utc().timestamp() as u64;
            log::info!("timestamp : {}", timestamp);

            Ok(timestamp)
        },
        Err(_) => Err("Failed to parse datetime")
    }
}
fn date_input_handler(state: UseStateHandle<String>) -> Callback<InputEvent> {
    Callback::from(move |e: InputEvent| {
        let input: HtmlInputElement = e.target_unchecked_into();
        state.set(input.value());
    })
}

async fn create_proposal_transaction(instruction: &Instruction, phantom_wallet_info: BaseWalletAdapter) {
    println!("create_proposal_transaction");
    let mut wallet_info = phantom_wallet_info;
    let payer = match wallet_info.public_key() {
        Some(key) => key,
        None => {
            panic!("Keypair is required but was not found");
        }
    };

    let tx = Transaction::new_with_payer(&[instruction.clone()], Some(&payer));
    match wallet_info.sign_send_transaction(tx.clone()).await {
        Ok(tx) => {
            println!("{}", tx.to_string());
            // confirmed.set(true);
        }
        Err(err) => {
            log::error!("Error --: {}", err);
            // error.set(Some(err.to_string()));
        }
    }

}