import { createContext, useState, useEffect, useContext, useMemo } from "react";
import { SystemProgram, Keypair, PublicKey } from "@solana/web3.js";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { BN } from "bn.js";

import {
  getProgram,
  getBallotAddress
} from "../utils/program";
import { confirmTx, mockWallet, stringToU8Array16, stringToU8Array32, u8ArrayToString } from "../utils/helper";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isCo, setIsCo] = useState(false);
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const program = useMemo(() => {
    if (connection) {
      return getProgram(connection, wallet ?? mockWallet());
    }
  }, [connection, wallet]);
  useEffect(() => {
    connection && wallet ? setIsCo(true) : setIsCo(false);
  }, [connection, wallet]);
  useEffect(() => {
    if(proposals.length == 0){
      fetch_proposals();
    }
  }, [program]);

  const [proposals, setProposals] = useState([]);

  const fetch_proposals = async () => {
    const proposals = await program.account.proposal.all();
    // const sortedVotes = proposals.sort((a, b) => a.account.deadline - b.account.deadline);
    const now = new Date().getTime();
    const readableProposals = proposals.map(proposal => {
      const tmpProposal = {
        publicKey: '',
        account: {
          admin: '',
          title: '',
          description: '',
          choices: [],
          choicesRegistrationInterval: {start:'', end:''},
          votersRegistrationInterval: {start:'', end:''},
          votingSessionInterval: {start:'', end:''},
          period: {},
        },
      };

      tmpProposal.publicKey = proposal.publicKey.toString();
      tmpProposal.account.admin = proposal.account.admin.toString();
      tmpProposal.account.title = u8ArrayToString(proposal.account.title);
      tmpProposal.account.description = u8ArrayToString(proposal.account.description);
      tmpProposal.account.choices = (proposal.account.choices.length > 0 ) 
        ? proposal.account.choices.map(ch=> { return { count: ch.count, label: u8ArrayToString(ch.label)}}) 
        : [];
      const choicesRegistrationIntervalStart = Number(proposal.account.choicesRegistrationInterval.start) * 1000;
      const choicesRegistrationIntervalEnd = Number(proposal.account.choicesRegistrationInterval.end) * 1000;
      const votersRegistrationIntervalStart = Number(proposal.account.votersRegistrationInterval.start) * 1000;
      const votersRegistrationIntervalEnd = Number(proposal.account.votersRegistrationInterval.end) * 1000;
      const votingSessionIntervalStart = Number(proposal.account.votingSessionInterval.start) * 1000;
      const votingSessionIntervalEnd = Number(proposal.account.votingSessionInterval.end) * 1000;
      if(choicesRegistrationIntervalStart >= now && choicesRegistrationIntervalEnd <= now) {
        tmpProposal.account.period = {0: "Choices Registration"};
      } else if(votersRegistrationIntervalStart >= now && votersRegistrationIntervalEnd <= now) {
        tmpProposal.account.period = {1: "Voters Registration"};
      } else if(votingSessionIntervalStart >= now && votingSessionIntervalEnd <= now) {
        tmpProposal.account.period = {2: "Voting Session"};
      } else {
        tmpProposal.account.period = {3: "Terminate"};
      }
      tmpProposal.account.choicesRegistrationInterval.start = new Date(choicesRegistrationIntervalStart);
      tmpProposal.account.choicesRegistrationInterval.end = new Date(choicesRegistrationIntervalEnd);
      tmpProposal.account.votersRegistrationInterval.start = new Date(votersRegistrationIntervalStart);
      tmpProposal.account.votersRegistrationInterval.end = new Date(votersRegistrationIntervalEnd);
      tmpProposal.account.votingSessionInterval.start = new Date(votingSessionIntervalStart);
      tmpProposal.account.votingSessionInterval.end = new Date(votingSessionIntervalEnd);
      return tmpProposal;
    })
    setProposals(readableProposals);

  }

  const fetch_ballot = async (proposalPK) => {
    const ballotAddress = await getBallotAddress(new PublicKey(proposalPK), wallet.publicKey);
    const ballot = await program.account.ballot.fetch(ballotAddress);
    console.log(ballot);
    return ballot;
  }
  const create_proposal = async (
    title,
    description,
    cr_start,
    cr_end,
    vr_start,
    vr_end,
    vs_start,
    vs_end,
  ) => {
    setError("");
    setSuccess("");
    try {
      const proposal = Keypair.generate();
      console.log(
        stringToU8Array16(title), 
        stringToU8Array32(description),
        cr_start,
        cr_end,
        vr_start,
        vr_end,
        vs_start,
        vs_end,
        proposal.publicKey,
        wallet,
        SystemProgram.programId.toString()
      )

      const txHash = await program.methods
        .createProposal(
          stringToU8Array16(title), 
          stringToU8Array32(description),
          new BN(cr_start),
          new BN(cr_end),
          new BN(vr_start),
          new BN(vr_end),
          new BN(vs_start),
          new BN(vs_end),
        )
        .accounts({
          proposal: proposal.publicKey,
          admin: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([proposal])
        .rpc();
        console.log(`tx: ${txHash}`)
      const confirm = await confirmTx(txHash, connection);
      console.log('confirm', confirm)
      await fetch_proposals();
      if(confirm) {
        const newProposal = proposals.find(pp=>pp.account.title == title && pp.account.description == description);
        console.log("newProposal", newProposal)
        return newProposal;
      }
    } catch (err) {
      console.log("err", err);
      setError(err.message);
    }
  };

  const add_choice_for_one_proposal = async (choice, proposalPK) => {
    setError("");
    setSuccess("");
    try {

      const txHash = await program.methods
        .addChoiceForOneProposal(
          stringToU8Array16(choice),
        )
        .accounts({
          proposal: proposalPK,
          admin: wallet.publicKey,
        })
        .signers([])
        .rpc();
      await confirmTx(txHash, connection);

      fetch_proposals();
    } catch (err) {
      console.log("err", err);
      setError(err.message);
    }
  };
  const register_voter = async (voter, proposalPK) => {    
    setError("");
    setSuccess("");
    try {
      const ballotAddress = await getBallotAddress(new PublicKey(proposalPK), new PublicKey(voter));
      console.log('ballotAddress', ballotAddress)
      console.log('voter', voter  )
      const txHash = await program.methods
        .registerVoter(new PublicKey(voter))
        .accounts({
          proposal: proposalPK,
          ballot: ballotAddress,
          admin: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([])
        .rpc();
      await confirmTx(txHash, connection);

      fetch_proposals();
    } catch (err) {
      console.log("err", err);
      setError(err.message);
    }
  };
  const cast_vote = async (index, proposalPK) => {
    try {
      const ballotAddress = await getBallotAddress(new PublicKey(proposalPK), wallet.publicKey);

      const txHash = await program.methods
      .castVote(index)
      .accounts({
        proposal: proposalPK,
        ballot: ballotAddress,
        voter: wallet.publicKey,
      })
      .signers([])
      .rpc();
      await confirmTx(txHash, connection);

      fetch_proposals();
    } catch (err) {
      console.log("err", err);
      setError(err.message);
    }
  }
  return (
    <AppContext.Provider
      value={{
        create_proposal,
        fetch_proposals,
        fetch_ballot,
        cast_vote,
        register_voter,
        add_choice_for_one_proposal,
        proposals,
        error,
        success,
        isCo
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
