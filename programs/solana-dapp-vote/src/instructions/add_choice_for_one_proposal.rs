use anchor_lang::prelude::*;

use crate::constants::CHECK_TIMEINTERVALS;
use crate::errors::VoteError;
use crate::state::proposal::{Choice, Proposal};

pub fn add_choice_for_one_proposal(
    ctx: Context<AddChoiceForOneProposal>,
    choice: [u8; 16],
) -> Result<()> {
    let proposal_account = &mut ctx.accounts.proposal;

    if CHECK_TIMEINTERVALS {
        let now = Clock::get()?.unix_timestamp as u64;

        if proposal_account.choices_registration_interval.start > now || now > proposal_account.voters_registration_interval.end {
            return Err(VoteError::ChoicesRegistrationIsClosed.into());
        }
    }

    require!(
        proposal_account.choices.len() < crate::constants::MAX_COUNT_OF_CHOICES,
        VoteError::MaxCountOfChoicesReached
    );

    for c in &proposal_account.choices {
        require!(c.label != choice, VoteError::ChoiceAlreadyExists);
    }

    proposal_account.choices.push(Choice {
        label: choice,
        count: 0,
    });

    Ok(())
}

#[derive(Accounts)]
pub struct AddChoiceForOneProposal<'info> {
    #[account(mut, has_one = admin)]
    pub proposal: Account<'info, Proposal>,
    #[account(mut)]
    pub admin: Signer<'info>,
}
