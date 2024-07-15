use wasi_sol::pubkey::Pubkey;

#[derive(Clone, PartialEq)]
pub struct Ballot {
    pub proposal: Pubkey,
    pub voter: Pubkey,
    pub choice_index: u8,
}
