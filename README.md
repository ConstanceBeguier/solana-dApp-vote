# Solana Decentralized Voting Platform

This project is a decentralized voting platform leveraging the Solana blockchain to ensure secure and transparent voting
processes.
It allows for the initiation of various voting sessions that are accessible to all participants.

## Voting Sessions

Upon the creation of a proposal, where the administrator defines the title, description, and the start and end of each
period,
a voting session is divided into three non-overlapping periods:

1. **Choice Registration Period:** The administrator can add choices to a proposal.
2. **Voter Registration Period:** Administrator can register voters to participate in the proposal.
3. **Voting Period:** Registered voters can cast their votes.

## Features

- **Create Proposal:** Administrator can create proposals with a title, description, and defined time periods for
  choice registration, voter registration, and voting.
- **Add Choices:** Administrator can add choices to an existing proposal during the choice registration period.
- **Register Voters:** Administrator can register a voter to participate in a proposal during the voter registration
  period.
- **Cast Vote:** Registered voters can cast their votes during the voting period.

## Usage

To use the platform, follow these steps:

1. **Create a Proposal `create_proposal`:**
    - An administrator creates a proposal by specifying the title, description, and time periods for choice
      registration, voter registration, and voting.

2. **Add Choices `add_choice_for_one_proposal`:**
    - During the choice registration period, the administrator can add multiple choices to the proposal.

3. **Register Voters `register_voter`:**
    - During the voter registration period, administrator can register a voter to participate in the proposal.

4. **Cast Votes `cast_vote`:**

## Additional Information

- **Developers:** Sébastien Gazeau, Maxime Auburtin, and Constance Beguier
- **Deployed dApp Frontend:** [Link to Vercel Deployment](https://your-dapp-frontend.vercel.app)
- **Program Explorer Link:** [Solscan Explorer](https://solscan.io/?cluster=devnet)
- **Tech Stack Used:**
    - **Frontend:** React, TypeScript
    - **Blockchain Framework:** Anchor
