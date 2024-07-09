use anchor_lang::prelude::*;

declare_id!("D4qRptv9HurACjb5zjyjsgEQADzPL8jckrqWTs5xuWLH");

#[program]
pub mod solana_dapp_vote {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
