import { createContext, useState, useEffect, useContext, useMemo } from "react";
import { SystemProgram, Keypair, PublicKey } from "@solana/web3.js";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { BN } from "bn.js";

import {
  getProgram,
  getProposalAddress
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
    const readableProposals = proposals.map(proposal => {
      console.log(proposal)
      proposal.publicKey = proposal.publicKey
      console.log(proposal.account.title)
      console.log(u8ArrayToString(proposal.account.title))
      proposal.account.admin = u8ArrayToString(proposal.account.admin)
      proposal.account.title = u8ArrayToString(proposal.account.title)
      proposal.account.description = u8ArrayToString(proposal.account.description)
      proposal.account.choicesRegistrationInterval.start = new Date(proposal.account.choicesRegistrationInterval.start.toString())
      proposal.account.choicesRegistrationInterval.end = new Date(proposal.account.choicesRegistrationInterval.end.toString())
      proposal.account.votersRegistrationInterval.start = new Date(proposal.account.votersRegistrationInterval.start.toString())
      proposal.account.votersRegistrationInterval.end = new Date(proposal.account.votersRegistrationInterval.end.toString())
      proposal.account.votingSessionInterval.start = new Date(proposal.account.votingSessionInterval.start.toString())
      proposal.account.votingSessionInterval.end = new Date(proposal.account.votingSessionInterval.end.toString())
      return proposal;
    })
    setProposals(readableProposals);
    

    // if(wallet && wallet.publicKey){
    //   const updatedVotes = await Promise.all(sortedVotes.map(async(vote) => {
    //     const voterAccountAddress = await getVoterAddress(vote.publicKey, wallet.publicKey);
    //     const voterInfo = await program.account.voter.fetchNullable(voterAccountAddress);
    //     return {
    //       ...vote,
    //       voterInfo: voterInfo
    //     };
    //   }));

    //   setProposals(updatedVotes);
    // }
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
        new BN(cr_start),
        new BN(cr_end),
        new BN(vr_start),
        new BN(vr_end),
        new BN(vs_start),
        new BN(vs_end),
        proposal.publicKey,
        wallet,
        SystemProgram.programId.toString()
      )
      // const proposalTitle = stringToU8Array16("title test");
      // const proposalDesc = stringToU8Array32("desc test");
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
      await confirmTx(txHash, connection);

      fetch_proposals();
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
          signer: wallet.publicKey,
        })
        .signers([wallet])
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
      const ppAccountAddress = await getProposalAddress(new PublicKey(proposalPK), new PublicKey(voter));

      const txHash = await program.methods
        .registerVoter()
        .accounts({
          proposal: proposalPK,
          ballot: ppAccountAddress,
          voter: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([wallet])
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
      const ppAccountAddress = await getProposalAddress(proposalPK, wallet.publicKey);

      const txHash = await program.methods
      .castVote(index)
      .accounts({
        proposal: proposalPK,
        ballot: ppAccountAddress,
        voter: wallet.publicKey,
      })
      .signers([wallet])
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
