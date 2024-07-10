use anchor_lang::prelude::*;

#[account]
pub struct Ballot {
    pub proposal: Pubkey,
    pub voter: Pubkey,
    pub choice_index: u8,
}
