use anchor_lang::prelude::*;

declare_id!("D4qRptv9HurACjb5zjyjsgEQADzPL8jckrqWTs5xuWLH");

pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;

#[program]
pub mod solana_dapp_vote {
    use super::*;

    pub fn create_proposal(
        ctx: Context<CreateProposal>,
        title: String,
        description: String,
    ) -> Result<()> {
        instructions::create_proposal(ctx, title, description)
    }

    pub fn add_choice_for_one_proposal(
        ctx: Context<AddChoiceForOneProposal>,
        choice: String,
    ) -> Result<()> {
        instructions::add_choice_for_one_proposal(ctx, choice)
    }

    pub fn register_voter(ctx: Context<RegisterVoter>) -> Result<()> {
        instructions::register_voter(ctx)
    }

    pub fn cast_vote(ctx: Context<CastVote>, choice_index: u8) -> Result<()> {
        instructions::cast_vote(ctx, choice_index)
    }
}
