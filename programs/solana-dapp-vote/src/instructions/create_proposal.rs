use anchor_lang::prelude::*;

use crate::constants::MAX_COUNT_OF_CHOICES;
use crate::state::proposal::Proposal;

pub fn create_proposal(
    ctx: Context<CreateProposal>,
    title: String,
    description: String,
) -> Result<()> {
    let proposal_account = &mut ctx.accounts.proposal;

    proposal_account.title = title;
    proposal_account.description = description;

    Ok(())
}

#[derive(Accounts)]
pub struct CreateProposal<'info> {
    #[account(init, payer = admin, space = 8 + 32 + 32 + (32 + 4)*MAX_COUNT_OF_CHOICES)]
    pub proposal: Account<'info, Proposal>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}
