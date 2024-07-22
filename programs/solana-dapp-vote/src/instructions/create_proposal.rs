use anchor_lang::prelude::*;

use crate::constants::MAX_COUNT_OF_CHOICES;
use crate::errors::VoteError;
use crate::state::proposal::{Proposal, TimeInterval};

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
    let proposal_account = &mut ctx.accounts.proposal;

    // Check timeline
    require!(
        choices_registration_start < choices_registration_end,
        VoteError::InvalidTimeline
    );
    require!(
        choices_registration_end <= voters_registration_start,
        VoteError::InvalidTimeline
    );
    require!(
        voters_registration_start < voters_registration_end,
        VoteError::InvalidTimeline
    );
    require!(
        voters_registration_end <= voting_session_start,
        VoteError::InvalidTimeline
    );
    require!(
        voting_session_start < voting_session_end,
        VoteError::InvalidTimeline
    );

    proposal_account.admin = *ctx.accounts.admin.key;
    proposal_account.title = title;
    proposal_account.description = description;
    proposal_account.choices_registration_interval = TimeInterval {
        start: choices_registration_start,
        end: choices_registration_end,
    };
    proposal_account.voters_registration_interval = TimeInterval {
        start: voters_registration_start,
        end: voters_registration_end,
    };
    proposal_account.voting_session_interval = TimeInterval {
        start: voting_session_start,
        end: voting_session_end,
    };

    Ok(())
}

#[derive(Accounts)]
pub struct CreateProposal<'info> {
    #[account(init, payer = admin, space = 8 + 32 + 16 + 32 + 4 + (16 + 2)*MAX_COUNT_OF_CHOICES + 8*6)]
    pub proposal: Account<'info, Proposal>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}
