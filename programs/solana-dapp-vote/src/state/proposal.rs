use anchor_lang::prelude::*;

#[account]
pub struct Proposal {
    pub title: String,
    pub description: String,
    pub choices: Vec<Choice>,
    pub choices_registration_interval: TimeInterval,
    pub voters_registration_interval: TimeInterval,
    pub voting_session_interval: TimeInterval,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct TimeInterval {
    pub start: u64,
    pub end: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Choice {
    pub label: String,
    pub count: u32,
}
