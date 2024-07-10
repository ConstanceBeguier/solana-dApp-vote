use anchor_lang::prelude::*;

use crate::state::{ballot::Ballot, proposal::Proposal};
pub fn register_voter(ctx: Context<RegisterVoter>) -> Result<()> {
    let ballot_account = &mut ctx.accounts.ballot;

    ballot_account.proposal = ctx.accounts.proposal.key();
    ballot_account.voter = ctx.accounts.voter.key();

    Ok(())
}

#[derive(Accounts)]
pub struct RegisterVoter<'info> {
    pub proposal: Account<'info, Proposal>,
    #[account(init, payer = voter, space = 8 + 32 + 32 + 1 + 1, seeds = [proposal.key().as_ref(), voter.key().as_ref()], bump)]
    pub ballot: Account<'info, Ballot>,
    #[account(mut)]
    pub voter: Signer<'info>,
    pub system_program: Program<'info, System>,
}
