use anchor_lang::prelude::*;

declare_id!("D4qRptv9HurACjb5zjyjsgEQADzPL8jckrqWTs5xuWLH");

#[program]
pub mod solana_dapp_vote {
    use super::*;

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

    pub fn register_voter(ctx: Context<RegisterVoter>) -> Result<()> {
        let ballot_account = &mut ctx.accounts.ballot;

        ballot_account.proposal = ctx.accounts.proposal.key();
        ballot_account.voter = ctx.accounts.voter.key();

        Ok(())
    }

    pub fn cast_vote(ctx: Context<CastVote>, choice_index: u8) -> Result<()> {
        let proposal_account = &mut ctx.accounts.proposal;
        let ballot_account = &mut ctx.accounts.ballot;

        ballot_account.choice_index = choice_index;
        proposal_account.choices[choice_index as usize].count += 1;

        Ok(())
    }
}

const MAX_COUNT_OF_CHOICES: usize = 10;

#[derive(Accounts)]
pub struct CreateProposal<'info> {
    #[account(init, payer = admin, space = 8 + 32 + 32 + (32 + 4)*MAX_COUNT_OF_CHOICES)]
    pub proposal: Account<'info, Proposal>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddChoiceForOneProposal<'info> {
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,
    #[account(mut)]
    pub admin: Signer<'info>,
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

#[derive(Accounts)]
pub struct CastVote<'info> {
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,
    #[account(mut, seeds = [proposal.key().as_ref(), voter.key().as_ref()], bump)]
    pub ballot: Account<'info, Ballot>,
    #[account(mut)]
    pub voter: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Proposal {
    pub title: String,
    pub description: String,
    pub choices: Vec<Choice>,
    // pub registering_voters_interval: TimeInterval,
    // pub proposal_registering_interval: TimeInterval,
    // pub voting_session_interval: TimeInterval,
}

// #[account]
// pub struct TimeInterval{
//     pub start: u64,
//     pub end: u64,
// }

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Choice {
    pub label: String,
    pub count: u32,
}

#[account]
pub struct Ballot {
    pub proposal: Pubkey,
    pub voter: Pubkey,
    pub choice_index: u8,
}
