use anchor_lang::prelude::*;

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
