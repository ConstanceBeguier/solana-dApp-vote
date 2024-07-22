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
    #[msg("Too many choices for this proposal")]
    MaxCountOfChoicesReached,
    #[msg("Invalid choice index")]
    InvalidChoiceIndex,
    #[msg("Already voted")]
    AlreadyVoted,
    #[msg("Too many votes for this choice")]
    CountOverflow,
    #[msg("Choice already exists")]
    ChoiceAlreadyExists,
}
