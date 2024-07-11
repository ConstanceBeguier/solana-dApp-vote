use anchor_lang::prelude::*;

#[error_code]
pub enum VoteError {
    #[msg("Timeline is invalid")]
    InvalidTimeline,
    #[msg("Choices registration is closed")]
    ChoicesRegistrationIsClosed,
    #[msg("Voters registration is closed")]
    VotersRegistrationIsClosed,
    #[msg("Voting session is closed")]
    VotingSessionIsClosed,
}
