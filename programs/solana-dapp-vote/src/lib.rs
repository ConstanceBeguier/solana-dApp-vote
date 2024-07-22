use anchor_lang::prelude::*;

declare_id!("4AEtDMG3A5rFTFwj6KyA6K41dxxpagemC4CaG5w9oABc");

pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;

#[program]
pub mod solana_dapp_vote {
    use super::*;

    #[allow(clippy::too_many_arguments)]
    pub fn create_proposal(
        ctx: Context<CreateProposal>,
        title: [u8; 16],
        description: [u8; 32],
        choices_registration_start: u64,
        choices_registration_end: u64,
        voters_registration_start: u64,
        voters_registration_end: u64,
        voting_session_start: u64,
        voting_session_end: u64,
    ) -> Result<()> {
        instructions::create_proposal(
            ctx,
            title,
            description,
            choices_registration_start,
            choices_registration_end,
            voters_registration_start,
            voters_registration_end,
            voting_session_start,
            voting_session_end,
        )
    }

    pub fn add_choice_for_one_proposal(
        ctx: Context<AddChoiceForOneProposal>,
        choice: [u8; 16],
    ) -> Result<()> {
        instructions::add_choice_for_one_proposal(ctx, choice)
    }

    pub fn register_voter(ctx: Context<RegisterVoter>, voter_pubkey: Pubkey) -> Result<()> {
        instructions::register_voter(ctx, voter_pubkey)
    }

    pub fn cast_vote(ctx: Context<CastVote>, choice_index: u8) -> Result<()> {
        instructions::cast_vote(ctx, choice_index)
    }
}
