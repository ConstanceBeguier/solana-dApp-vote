use anchor_lang::prelude::*;

use crate::constants::{CHECK_TIMEINTERVALS, EMPTY_BALLOT};
use crate::errors::VoteError;
use crate::state::{ballot::Ballot, proposal::Proposal};

pub fn register_voter(ctx: Context<RegisterVoter>, voter_pubkey: Pubkey) -> Result<()> {
    let ballot_account = &mut ctx.accounts.ballot;

    if CHECK_TIMEINTERVALS {
        let now = Clock::get()?.unix_timestamp as u64;
        if !(ctx.accounts.proposal.voters_registration_interval.start <= now && now <= ctx.accounts.proposal.voters_registration_interval.end) {
            return Err(VoteError::VotersRegistrationIsClosed.into());
        }
    }

    ballot_account.proposal = ctx.accounts.proposal.key();
    ballot_account.voter = voter_pubkey;
    ballot_account.choice_index = EMPTY_BALLOT;

    Ok(())
}

#[derive(Accounts)]
#[instruction(voter_pubkey: Pubkey)]
pub struct RegisterVoter<'info> {
    #[account(has_one = admin)]
    pub proposal: Account<'info, Proposal>,
    #[account(init, payer = admin, space = 8 + 32 + 32 + 1 + 1, seeds = [proposal.key().as_ref(), voter_pubkey.as_ref()], bump)]
    pub ballot: Account<'info, Ballot>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}
