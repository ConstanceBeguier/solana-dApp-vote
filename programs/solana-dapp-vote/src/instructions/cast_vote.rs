use anchor_lang::prelude::*;

use crate::constants::CHECK_TIMEINTERVALS;
use crate::errors::VoteError;
use crate::state::{ballot::Ballot, proposal::Proposal};

pub fn cast_vote(ctx: Context<CastVote>, choice_index: u8) -> Result<()> {
    let proposal_account = &mut ctx.accounts.proposal;
    let ballot_account = &mut ctx.accounts.ballot;

    if CHECK_TIMEINTERVALS {
        let now = Clock::get()?.unix_timestamp as u64;
        if !(proposal_account.voting_session_interval.start < now && now < proposal_account.voting_session_interval.end) {
            return Err(VoteError::VotingSessionIsClosed.into());
        }
    }

    require!(
        choice_index < proposal_account.choices.len() as u8,
        VoteError::InvalidChoiceIndex
    );

    require!(
        ballot_account.choice_index == u8::MAX,
        VoteError::AlreadyVoted
    );

    require!(
        proposal_account.choices[choice_index as usize].count < u16::MAX,
        VoteError::CountOverflow
    );

    ballot_account.choice_index = choice_index;
    proposal_account.choices[choice_index as usize].count += 1;

    Ok(())
}

#[derive(Accounts)]
pub struct CastVote<'info> {
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,
    #[account(mut, has_one = voter, seeds = [proposal.key().as_ref(), voter.key().as_ref()], bump)]
    pub ballot: Account<'info, Ballot>,
    #[account(mut)]
    pub voter: Signer<'info>,
}
