use anchor_lang::prelude::*;

use crate::constants::CHECK_TIMEINTERVALS;
use crate::errors::VoteError;
use crate::state::{ballot::Ballot, proposal::Proposal};

pub fn register_voter(ctx: Context<RegisterVoter>) -> Result<()> {
    let ballot_account = &mut ctx.accounts.ballot;

    if CHECK_TIMEINTERVALS {
        let now = Clock::get()?.unix_timestamp as u64;
        require!(
            ctx.accounts.proposal.voters_registration_interval.start < now
                && now < ctx.accounts.proposal.voters_registration_interval.end,
            VoteError::VotersRegistrationIsClosed
        );
    }

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
