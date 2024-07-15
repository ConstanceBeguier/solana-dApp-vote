use yew::Properties;

use wasi_sol::pubkey::Pubkey;

#[derive(Properties, Clone, PartialEq)]
pub struct Proposal {
    pub admin: Pubkey,
    pub title: [u8; 16],
    pub description: [u8; 32],
    pub choices: Vec<Choice>,
    pub choices_registration_interval: TimeInterval,
    pub voters_registration_interval: TimeInterval,
    pub voting_session_interval: TimeInterval,
}

#[derive(Properties, Clone, PartialEq)]
pub struct TimeInterval {
    pub start: u64,
    pub end: u64,
}

#[derive(Properties, Clone, PartialEq)]
pub struct Choice {
    pub label: [u8; 16],
    pub count: u16,
}
