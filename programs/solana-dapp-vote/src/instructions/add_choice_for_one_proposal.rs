use anchor_lang::prelude::*;

use crate::state::proposal::{Choice, Proposal};

pub fn add_choice_for_one_proposal(
    ctx: Context<AddChoiceForOneProposal>,
    choice: String,
) -> Result<()> {
    let proposal_account = &mut ctx.accounts.proposal;

    proposal_account.choices.push(Choice {
        label: choice,
        count: 0,
    });

    Ok(())
}

#[derive(Accounts)]
pub struct AddChoiceForOneProposal<'info> {
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,
    #[account(mut)]
    pub admin: Signer<'info>,
}
